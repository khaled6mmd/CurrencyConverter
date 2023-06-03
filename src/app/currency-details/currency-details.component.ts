import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyService } from '../services/currency.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html',
  styleUrls: ['./currency-details.component.css']
})
export class CurrencyDetailsComponent implements OnInit {
  fromCurrency: any;
  toCurrency: any;
  toCurrencyFullName: string;
  currencies: string[] = ['USD', 'EUR', 'GBP']; // Replace with your currency list
  historicalData: any[] = [];

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  chartOptions: { chart: { type: string; }; title: { text: string; }; xAxis: {}; yAxis: {}; series: { name: string; data: any[]; }[]; }
  constructor(private route: ActivatedRoute, private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.fromCurrency = params.get('from');
      this.toCurrency = params.get('to');
      this.currencyService.getCurrencyFullName(this.toCurrency).subscribe(fullName => {
        this.toCurrencyFullName = fullName;
      });
      const startDate = new Date('2023-05-01');
      const endDate = new Date('2023-05-3');
  
      this.fetchHistoricalData(startDate, endDate);    });
  }


  convert(): void {
    // Perform the conversion logic and update the details based on the selected currencies and other parameters
    // ...
  }

  getFullName(currency: string): string {
    this.currencyService.getCurrencyFullName(currency)
    return 'Full Name'; // Placeholder value
  }

  fetchHistoricalData(startDate: Date, endDate: Date): void {
    const baseCurrency = 'EUR';
    const symbols = ['USD'];
  
    let currentDate = new Date(startDate);
    const formattedEndDate = this.formatDate(endDate);
  
    while (currentDate <= endDate) {
      const formattedDate = this.formatDate(currentDate);
  
      this.currencyService.getHistoricalData(formattedDate, baseCurrency, symbols)
        .subscribe((response: any) => {
          if (response.success) {
            const rate = response.rates['USD'];
            const historicalRate = {
              name: formattedDate,
              value: rate
            };            
            this.historicalData.push(historicalRate);
            console.log(this.historicalData);
          } else {
            console.error('Error fetching historical data:', response.error);
          }
        });
  
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  formatXAxisTick(date: any): string {
    if (date) {
      const pipe = new DatePipe('en-US');
      return pipe.transform(date, 'MMM dd') || '';
    }
    return '';
  }
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
}
