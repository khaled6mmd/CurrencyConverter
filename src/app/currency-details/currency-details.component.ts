import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyService } from '../services/currency.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html',
  styleUrls: ['./currency-details.component.css']
})
export class CurrencyDetailsComponent implements OnInit {
  fromCurrency: string;
  toCurrency: string;
  toCurrencyFullName: string;
  historicalData: any[] = [];

  colorScheme: {domain: string[]} = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  chartOptions: { chart: { type: string; }; title: { text: string; }; xAxis: {}; yAxis: {}; series: { name: string; data: any[]; }[]; }
  constructor(private route: ActivatedRoute, private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.fromCurrency = params.get('from') ?? '';
      this.toCurrency = params.get('to') ?? '';
      this.currencyService.getCurrencyFullName(this.toCurrency? this.toCurrency: '').subscribe(fullName => {
        this.toCurrencyFullName = fullName;
      });
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1); // Subtract 1 year from the current date
      startDate.setDate(1); // Set the day to the first day of the month
      const endDate = new Date();
      this.fetchMonthlyHistoricalData(startDate, endDate);
    });
  }

  getFullName(currency: string): string {
    this.currencyService.getCurrencyFullName(currency)
    return 'Full Name'; // Placeholder value
  }

  fetchMonthlyHistoricalData(startDate: Date, endDate: Date): void {
    const baseCurrency = 'EUR';
    const symbols: string[] = [this.toCurrency];
    
    const dateRange = this.getMonthlyDateRange(startDate, endDate);
    const requests: Observable<any>[] = [];
    
    dateRange.forEach((date) => {
      const formattedDate = this.formatDate(date);
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const request = this.currencyService.getHistoricalData(formattedDate, baseCurrency, symbols);
      requests.push(request);
  
      if (date.getTime() !== lastDayOfMonth.getTime()) {
        requests.push(this.currencyService.getHistoricalData(this.formatDate(lastDayOfMonth), baseCurrency, symbols));
      }
    });
    
    forkJoin(requests).subscribe({
      next: (responses: any[]) => {
        const historicalRates = responses
          .filter((response) => response.success)
          .map((response) => {
            const rate = response.rates[this.toCurrency? this.toCurrency : ''];
            const formattedDate = response.date;
            return {
              name: formattedDate,
              value: rate,
            };
          });
    
        const historicalData: any[] = [
          {
            name: this.toCurrency,
            series: historicalRates.reverse()
          },
        ];
    
        this.historicalData = historicalData;
      },
      error: (error) => {
        console.error('Error fetching historical data:', error);
      },
      complete: () => {
        // Optional complete callback
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

  getDateRange(startDate: Date, endDate: Date): Date[] {
    const dateRange: Date[] = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
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
