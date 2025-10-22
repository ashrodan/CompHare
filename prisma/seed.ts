/**
 * Prisma Database Seed Script
 *
 * Populates the database with initial data from existing providers
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🧹 Cleaning up existing data...')
  await prisma.oOVOVolumeOption.deleteMany()
  await prisma.oOVOProvider.deleteMany()
  await prisma.rateSet.deleteMany()
  await prisma.gasProvider.deleteMany()

  // Seed Gas Providers
  console.log('⛽ Seeding gas providers...')

  // Tango
  await prisma.gasProvider.create({
    data: {
      name: 'Tango',
      summerRates: {
        create: {
          season: 'Summer (Nov-Apr)',
          dailyCharge: 115.500,
          step1Rate: 3.179,
          step2Rate: 2.816,
          step3Rate: 2.596,
          step4Rate: 2.453,
          step5Rate: 2.321,
        }
      },
      nonSummerRates: {
        create: {
          season: 'Non-Summer (May-Oct)',
          dailyCharge: 115.500,
          step1Rate: 3.443,
          step2Rate: 3.234,
          step3Rate: 3.003,
          step4Rate: 2.772,
          step5Rate: 2.596,
        }
      }
    }
  })

  // Momentum
  await prisma.gasProvider.create({
    data: {
      name: 'Momentum',
      summerRates: {
        create: {
          season: 'Off Peak (Nov-Apr)',
          dailyCharge: 95.260,
          step1Rate: 3.080,
          step2Rate: 2.860,
          step3Rate: 2.530,
          step4Rate: 2.420,
          step5Rate: 2.310,
        }
      },
      nonSummerRates: {
        create: {
          season: 'Peak (May-Oct)',
          dailyCharge: 95.260,
          step1Rate: 3.080,
          step2Rate: 2.860,
          step3Rate: 2.530,
          step4Rate: 2.420,
          step5Rate: 2.310,
        }
      }
    }
  })

  // Lumo
  await prisma.gasProvider.create({
    data: {
      name: 'Lumo',
      summerRates: {
        create: {
          season: 'Summer (Nov-Apr)',
          dailyCharge: 82.500,
          step1Rate: 3.509,
          step2Rate: 3.179,
          step3Rate: 2.596,
          step4Rate: 2.310,
          step5Rate: 2.200,
        }
      },
      nonSummerRates: {
        create: {
          season: 'Non-Summer (May-Oct)',
          dailyCharge: 82.500,
          step1Rate: 3.509,
          step2Rate: 3.179,
          step3Rate: 2.596,
          step4Rate: 2.310,
          step5Rate: 2.200,
        }
      }
    }
  })

  console.log('✅ Gas providers seeded successfully')

  // Seed Olive Oil Providers
  console.log('🫒 Seeding olive oil providers...')

  // Cobram Estate
  await prisma.oOVOProvider.create({
    data: {
      name: 'Cobram Estate Extra Virgin Olive Oil',
      location: 'Victoria',
      shipping: 9.95,
      stockStatus: 'In Stock',
      link: 'https://cobramestate.com.au/shop/extra-virgin-olive-oil',
      description: 'Family-owned estate producing award-winning olive oils since 1996. Committed to sustainable farming practices.',
      volumeOptions: {
        create: [
          { volume: 0.5, price: 14.99 },
          { volume: 1.0, price: 24.99 },
          { volume: 2.0, price: 44.99 }
        ]
      }
    }
  })

  // Yellingbo Estate
  await prisma.oOVOProvider.create({
    data: {
      name: 'Yellingbo Estate Extra Virgin Olive Oil',
      location: 'Victoria',
      shipping: 12.00,
      stockStatus: 'Low Stock',
      link: 'https://yellingboestate.com.au/product/extra-virgin-olive-oil',
      description: 'Small-batch producer focusing on organic, cold-pressed olive oils from their own groves.',
      volumeOptions: {
        create: [
          { volume: 0.75, price: 19.50 },
          { volume: 1.5, price: 35.99 }
        ]
      }
    }
  })

  // Pukara Estate
  await prisma.oOVOProvider.create({
    data: {
      name: 'Pukara Estate Extra Virgin Olive Oil',
      location: 'New South Wales',
      shipping: 10.50,
      stockStatus: 'In Stock',
      link: 'https://pukaraestate.com.au/olive-oil',
      description: 'Artisan producers using traditional methods to create high-quality, locally sourced olive oils.',
      volumeOptions: {
        create: [
          { volume: 0.5, price: 16.75 },
          { volume: 1.0, price: 29.99 }
        ]
      }
    }
  })

  // Mount Zero Olives
  await prisma.oOVOProvider.create({
    data: {
      name: 'Mount Zero Olives',
      location: 'Victoria',
      shipping: 8.50,
      stockStatus: 'In Stock',
      link: 'https://mountzeroolives.com.au/collections/olive-oil',
      description: 'Regenerative agriculture pioneers, working with local Indigenous communities to produce exceptional olive oils.',
      volumeOptions: {
        create: [
          { volume: 1.0, price: 22.00 },
          { volume: 2.0, price: 39.99 }
        ]
      }
    }
  })

  console.log('✅ Olive oil providers seeded successfully')

  // Summary
  const gasCount = await prisma.gasProvider.count()
  const oovoCount = await prisma.oOVOProvider.count()
  const volumeCount = await prisma.oOVOVolumeOption.count()

  console.log('\n🎉 Database seeded successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - ${gasCount} gas providers`)
  console.log(`   - ${oovoCount} olive oil providers`)
  console.log(`   - ${volumeCount} volume options`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
