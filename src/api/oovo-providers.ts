import type { OOVOItem } from '../types/oovo';

export async function getOOVOProviders(): Promise<OOVOItem[]> {
  // Expanded data with multiple volume options
  return [
    {
      name: "Cobram Estate Extra Virgin Olive Oil",
      location: "Victoria",
      shipping: 9.95,
      stockStatus: "In Stock",
      link: "https://cobramestate.com.au/shop/extra-virgin-olive-oil",
      description: "Family-owned estate producing award-winning olive oils since 1996. Committed to sustainable farming practices.",
      volumeOptions: [
        { volume: 0.5, price: 14.99 },
        { volume: 1.0, price: 24.99 },
        { volume: 2.0, price: 44.99 }
      ]
    },
    {
      name: "Yellingbo Estate Extra Virgin Olive Oil",
      location: "Victoria", 
      shipping: 12.00,
      stockStatus: "Low Stock",
      link: "https://yellingboestate.com.au/product/extra-virgin-olive-oil",
      description: "Small-batch producer focusing on organic, cold-pressed olive oils from their own groves.",
      volumeOptions: [
        { volume: 0.75, price: 19.50 },
        { volume: 1.5, price: 35.99 }
      ]
    },
    {
      name: "Pukara Estate Extra Virgin Olive Oil",
      location: "New South Wales",
      shipping: 10.50,
      stockStatus: "In Stock",
      link: "https://pukaraestate.com.au/olive-oil",
      description: "Artisan producers using traditional methods to create high-quality, locally sourced olive oils.",
      volumeOptions: [
        { volume: 0.5, price: 16.75 },
        { volume: 1.0, price: 29.99 }
      ]
    },
    {
      name: "Mount Zero Olives",
      location: "Victoria",
      shipping: 8.50,
      stockStatus: "In Stock",
      link: "https://mountzeroolives.com.au/collections/olive-oil",
      description: "Regenerative agriculture pioneers, working with local Indigenous communities to produce exceptional olive oils.",
      volumeOptions: [
        { volume: 1.0, price: 22.00 },
        { volume: 2.0, price: 39.99 }
      ]
    }
  ];
}
