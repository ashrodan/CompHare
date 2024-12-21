export interface RateSet {
  steps: number[];
  dailyCharge: number;
  season: string;
}

export interface ProviderRates {
  summer: RateSet;
  nonSummer: RateSet;
}

export interface Providers {
  [key: string]: ProviderRates;
}

export interface CostResult {
  provider: string;
  cost: number;
  season: string;
}
