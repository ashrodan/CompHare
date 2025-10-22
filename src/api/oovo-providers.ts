import type { OOVOItem } from '../types/oovo';
import { prisma } from '../lib/db';

/**
 * Fetch all olive oil providers from database
 */
export async function getOOVOProviders(): Promise<OOVOItem[]> {
  const providers = await prisma.oOVOProvider.findMany({
    include: {
      volumeOptions: {
        orderBy: {
          volume: 'asc'
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  // Transform database format to expected API format
  return providers.map(provider => ({
    name: provider.name,
    location: provider.location,
    shipping: provider.shipping,
    stockStatus: provider.stockStatus,
    link: provider.link,
    description: provider.description,
    volumeOptions: provider.volumeOptions.map(option => ({
      volume: option.volume,
      price: option.price
    }))
  }));
}
