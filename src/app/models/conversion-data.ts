export interface ConversionData {
    amount: number;
    fromRate: string;
    toRate: string;
    exchangeRates: { [currency: string]: number };
}
