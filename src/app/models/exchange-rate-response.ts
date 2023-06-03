export interface ExchangeRateResponse {
    success: boolean;
    rates: { [currency: string]: number };
}
