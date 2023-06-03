import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CurrencyService } from 'src/app/services/currency.service';
import { ConversionData } from '../models/conversion-data';

@Component({
  selector: 'app-converter-panel',
  templateUrl: './converter-panel.component.html',
  styleUrls: ['./converter-panel.component.css']
})
export class ConverterPanelComponent implements OnInit, OnDestroy {
  popularCurrencies: string[] = ['USD', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];
  latestConversionData: ConversionData;
  private subscription: Subscription;

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.subscription = this.currencyService.getLatestConversionData().subscribe((data: any) => {      
      this.latestConversionData = data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  convertAmountToCurrency(toCurrency: string): number {
    const fromRate = this.latestConversionData.exchangeRates[this.latestConversionData.fromRate];
    const toRate = this.latestConversionData.exchangeRates[toCurrency];        
    return (this.latestConversionData.amount / fromRate) * toRate;
  }
}