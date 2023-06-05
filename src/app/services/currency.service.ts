import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConversionData } from '../models/conversion-data';
import { CurrencyResponse } from '../models/currency-response';
import { ExchangeRateResponse } from '../models/exchange-rate-response';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'http://data.fixer.io/api';
  private accessKey = 'cf35378d738da73c99bb0ddd37bad5ab'; // replace this with your key
  private latestConversionData: Subject<ConversionData | null> = new Subject<ConversionData | null>;

  constructor(private http: HttpClient) {}

  getAvailableCurrencies(): Observable<string[]> {
    return this.http
      .get<CurrencyResponse>(`${this.apiUrl}/symbols?access_key=${this.accessKey}`)
      .pipe(map(response => Object.keys(response.symbols)));
  }

  getExchangeRates(baseCurrency: string): Observable<{ [currency: string]: number }> {
    return this.http
      .get<ExchangeRateResponse>(`${this.apiUrl}/latest?access_key=${this.accessKey}&base=${baseCurrency}`)
      .pipe(map(response => response.rates));
  }

  setLatestConversionData(results: ConversionData): void {
    this.latestConversionData.next(results);
  }

  getLatestConversionData(): Observable<ConversionData | null> {
    return this.latestConversionData.asObservable();
  }

  getCurrencyFullName(currency: string): Observable<string> {
    const symbolsUrl = `${this.apiUrl}/symbols?access_key=${this.accessKey}`;
    return this.http.get<any>(symbolsUrl).pipe(
      map(response => {
        const symbols = response.symbols;
        if (symbols && symbols[currency]) {
          return symbols[currency];
        }
        return 'Unknown';
      })
    );
  }

  getHistoricalData(date: string, baseCurrency: string, symbols: string[] = []): Observable<any> {
    const url = `${this.apiUrl}/${date}?access_key=${this.accessKey}&base=${baseCurrency}&symbols=${symbols.join(',')}`;
    return this.http.get(url);
  }
  
}
