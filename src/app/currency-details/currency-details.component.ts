import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CurrencyService } from '../services/currency.service';
import { Observable, forkJoin } from 'rxjs';
import { Color } from 'chart.js';

interface HistoricalData {
  name: string;
  series: HistoricalRate[];
}

interface HistoricalRate {
  name: string;
  value: number;
}

interface HistoricalResponse {
  success: boolean;
  rates: {
    [currency: string]: number;
  };
  date: string;
}

@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html',
  styleUrls: ['./currency-details.component.css']
})
export class CurrencyDetailsComponent implements OnInit {
  fromCurrency: string;
  toCurrency: string;
  toCurrencyFullName: string;
  historicalData: HistoricalData[] = [];
  constructor(private route: ActivatedRoute, private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.fromCurrency = params.get('from') ?? '';
      this.toCurrency = params.get('to') ?? '';
      this.currencyService.getCurrencyFullName(this.toCurrency ? this.toCurrency : '').subscribe(fullName => {
        this.toCurrencyFullName = fullName;
      });
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1); // Subtract 1 year from the current date
      startDate.setDate(1); // Set the day to the first day of the month
      const endDate = new Date();
      this.fetchMonthlyHistoricalData(startDate, endDate, this.fromCurrency, this.toCurrency);
    });
  }

  getFullName(currency: string): string {
    this.currencyService.getCurrencyFullName(currency);
    return 'Full Name'; // Placeholder value
  }

  fetchMonthlyHistoricalData(startDate: Date, endDate: Date, toCurrency: string, fromCurrency: string): void {
    const baseCurrency = 'EUR';
    const symbols: string[] = [fromCurrency, toCurrency];

    const dateRange = this.getMonthlyDateRange(startDate, endDate);
    const requests: Observable<HistoricalResponse>[] = [];

    dateRange.forEach(date => {
      const formattedDate = this.formatDate(date);
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const request = this.currencyService.getHistoricalData(formattedDate, baseCurrency, symbols) as Observable<HistoricalResponse>;
      requests.push(request);

      if (date.getTime() !== lastDayOfMonth.getTime()) {
        const lastDayRequest = this.currencyService.getHistoricalData(this.formatDate(lastDayOfMonth), baseCurrency, symbols) as Observable<HistoricalResponse>;
        requests.push(lastDayRequest);
      }
    });

    forkJoin([requests[0], requests[1]]).subscribe({
      next: (responses: HistoricalResponse[]) => {
        const historicalRates = responses
          .filter(response => response.success)
          .map(response => {
            const eurToFromCurrencyRate = response.rates[fromCurrency ? fromCurrency : ''];
            const eurToToCurrencyRate = response.rates[toCurrency ? toCurrency : ''];
            const toCurrencyToFromCurrencyRate = eurToFromCurrencyRate / eurToToCurrencyRate;

            const formattedDate = response.date;
            return {
              name: formattedDate,
              value: toCurrencyToFromCurrencyRate,
            } as HistoricalRate;
          });

        const historicalData: HistoricalData[] = [
          {
            name: fromCurrency,
            series: historicalRates.reverse(),
          },
        ];

        this.historicalData = historicalData;
      },
      error: (error) => {
        console.error('Error fetching historical data:', error);
      },
    });
  }

  getMonthlyDateRange(startDate: Date, endDate: Date): Date[] {
    const dateRange: Date[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      dateRange.push(lastDayOfMonth);
      currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
      currentDate.setDate(1); // Set the day to the first day of the next month
    }

    return dateRange;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    if (month.length < 2) {
      month = '0' + month;
    }

    if (day.length < 2) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  }

}
