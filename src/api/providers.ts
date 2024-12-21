import type { Providers } from '../types/gas';

const providersData: Providers = {
  Tango: {
    summer: {
      steps: [3.179, 2.816, 2.596, 2.453, 2.321],
      dailyCharge: 115.500,
      season: 'Summer (Nov-Apr)'
    },
    nonSummer: {
      steps: [3.443, 3.234, 3.003, 2.772, 2.596],
      dailyCharge: 115.500,
      season: 'Non-Summer (May-Oct)'
    }
  },
  Momentum: {
    summer: {
      steps: [3.080, 2.860, 2.530, 2.420, 2.310],
      dailyCharge: 95.260,
      season: 'Off Peak (Nov-Apr)'
    },
    nonSummer: {
      steps: [3.080, 2.860, 2.530, 2.420, 2.310],
      dailyCharge: 95.260,
      season: 'Peak (May-Oct)'
    }
  },
  Lumo: {
    summer: {
      steps: [3.509, 3.179, 2.596, 2.310, 2.200],
      dailyCharge: 82.500,
      season: 'Summer (Nov-Apr)'
    },
    nonSummer: {
      steps: [3.509, 3.179, 2.596, 2.310, 2.200],
      dailyCharge: 82.500,
      season: 'Non-Summer (May-Oct)'
    }
  }
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProviders(): Promise<Providers> {
  // Simulate network delay
  await delay(100);
  return providersData;
}

export async function getProvider(name: string): Promise<Providers[string] | null> {
  await delay(100);
  return providersData[name] || null;
}
