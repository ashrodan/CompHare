export function calculateCost(usage: number, rates: number[], dailyCharge: number): number {
  let remainingUsage = usage;
  let totalCost = dailyCharge; // Start with daily charge
  
  // Step thresholds in MJ
  const thresholds = [100, 100, 100, 100, Number.POSITIVE_INFINITY];
  
  for (let i = 0; i < rates.length; i++) {
    const stepUsage = Math.min(remainingUsage, thresholds[i]);
    if (stepUsage <= 0) break;
    
    totalCost += stepUsage * rates[i];
    remainingUsage -= stepUsage;
  }
  
  return totalCost;
}

export const USAGE_THRESHOLDS = {
  STEP_1: 100,
  STEP_2: 100,
  STEP_3: 100,
  STEP_4: 100,
  STEP_5: Number.POSITIVE_INFINITY
};

export const SEASONS = {
  SUMMER: 'summer',
  NON_SUMMER: 'nonSummer'
} as const;

export type Season = typeof SEASONS[keyof typeof SEASONS];
