import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {
  conversionForm: FormGroup;

  convertedAmount: number;
  currencies: string[] = []; // Updated with the available currencies
  exchangeRates: { [currency: string]: number } = {}; // EUR to other currencies exchange rates
  currentCurrency: string;
  private subscriptions: Subscription[] = [];

  constructor(private currencyService: CurrencyService, private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.conversionForm = this.formBuilder.group({
      amount: [1, [Validators.required, Validators.min(0)]], // Set default amount to 1
      fromCurrency: ['EUR', Validators.required], // Set default 'from' currency to EUR
      toCurrency: ['USD', Validators.required], // Set default 'to' currency to USD
    });

    this.subscriptions.push(
      this.currencyService.getAvailableCurrencies().subscribe(currencies => {
        this.currencies = currencies;
      })
    );
    this.convert();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  convert(): void {
    const { amount, fromCurrency, toCurrency } = this.conversionForm.value;
    this.subscriptions.push(
      this.currencyService.getExchangeRates(fromCurrency).subscribe(rates => {
        this.exchangeRates = rates;
        if (amount && fromCurrency && toCurrency) {
          const fromRate = this.exchangeRates[fromCurrency];
          const toRate = this.exchangeRates[toCurrency];
          this.convertedAmount = (amount / fromRate) * toRate;
          this.currentCurrency = toCurrency;
          this.currencyService.setLatestConversionData({
            amount,
            fromRate: fromCurrency,
            toRate: toCurrency,
            exchangeRates: this.exchangeRates
          });
        }
      })
    );
  }

  swapCurrencies(): void {
    const { fromCurrency, toCurrency } = this.conversionForm.value;
    this.conversionForm.patchValue({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency
    });
    this.convert();
  }

  redirectToDetailsPage(): void {
    const { fromCurrency, toCurrency } = this.conversionForm.value;
    this.router.navigate(['/home/details'], {
      queryParams: { from: fromCurrency, to: toCurrency }
    });
  }
  
}
