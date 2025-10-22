import type { Providers, ProviderRates } from '../types/gas';
import { prisma } from '../lib/db';

/**
 * Fetch all gas providers from database
 */
export async function getProviders(): Promise<Providers> {
  const providers = await prisma.gasProvider.findMany({
    include: {
      summerRates: true,
      nonSummerRates: true,
    }
  });

  // Transform database format to expected API format
  const result: Providers = {};

  for (const provider of providers) {
    result[provider.name] = {
      summer: {
        steps: [
          provider.summerRates.step1Rate,
          provider.summerRates.step2Rate,
          provider.summerRates.step3Rate,
          provider.summerRates.step4Rate,
          provider.summerRates.step5Rate,
        ],
        dailyCharge: provider.summerRates.dailyCharge,
        season: provider.summerRates.season,
      },
      nonSummer: {
        steps: [
          provider.nonSummerRates.step1Rate,
          provider.nonSummerRates.step2Rate,
          provider.nonSummerRates.step3Rate,
          provider.nonSummerRates.step4Rate,
          provider.nonSummerRates.step5Rate,
        ],
        dailyCharge: provider.nonSummerRates.dailyCharge,
        season: provider.nonSummerRates.season,
      }
    };
  }

  return result;
}

/**
 * Fetch a specific gas provider by name
 */
export async function getProvider(name: string): Promise<ProviderRates | null> {
  const provider = await prisma.gasProvider.findUnique({
    where: { name },
    include: {
      summerRates: true,
      nonSummerRates: true,
    }
  });

  if (!provider) {
    return null;
  }

  return {
    summer: {
      steps: [
        provider.summerRates.step1Rate,
        provider.summerRates.step2Rate,
        provider.summerRates.step3Rate,
        provider.summerRates.step4Rate,
        provider.summerRates.step5Rate,
      ],
      dailyCharge: provider.summerRates.dailyCharge,
      season: provider.summerRates.season,
    },
    nonSummer: {
      steps: [
        provider.nonSummerRates.step1Rate,
        provider.nonSummerRates.step2Rate,
        provider.nonSummerRates.step3Rate,
        provider.nonSummerRates.step4Rate,
        provider.nonSummerRates.step5Rate,
      ],
      dailyCharge: provider.nonSummerRates.dailyCharge,
      season: provider.nonSummerRates.season,
    }
  };
}
