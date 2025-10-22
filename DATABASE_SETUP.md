# Database Setup Guide - CompHare

This guide will help you set up the Neon PostgreSQL database for CompHare.

## Prerequisites

- A Neon account (sign up at https://neon.tech)
- Node.js installed
- All npm dependencies installed (`npm install`)

## Step 1: Get Your Neon Database Connection String

1. Log in to your Neon account at https://console.neon.tech
2. Create a new project or select an existing one
3. Navigate to your project's **Connection Details**
4. Copy the connection string (it will look like this):
   ```
   postgresql://username:password@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

## Step 2: Configure Environment Variables

1. Open the `.env` file in the root of your project
2. Replace the placeholder `DATABASE_URL` with your actual Neon connection string:
   ```env
   DATABASE_URL="postgresql://your-username:your-password@your-neon-host.neon.tech/neondb?sslmode=require"
   ```

**Important:**
- Keep your `.env` file secure and never commit it to version control
- The `.env` file is already in `.gitignore` for your protection

## Step 3: Generate Prisma Client

Generate the Prisma client based on your schema:

```bash
npm run db:generate
```

This creates the TypeScript types and database client code.

## Step 4: Push Database Schema to Neon

Push the Prisma schema to your Neon database (creates all tables):

```bash
npm run db:push
```

This will create the following tables:
- `gas_providers` - Gas provider information
- `rate_sets` - Summer and non-summer rate tiers
- `oovo_providers` - Olive oil provider information
- `oovo_volume_options` - Volume and pricing options

## Step 5: Seed the Database

Populate the database with initial data:

```bash
npm run db:seed
```

This will add:
- 3 gas providers (Tango, Momentum, Lumo)
- 4 olive oil providers with their volume options

## Step 6: Verify the Setup

You can verify the setup by:

1. **Using Prisma Studio** (visual database browser):
   ```bash
   npm run db:studio
   ```
   This opens a browser interface at http://localhost:5555

2. **Running the dev server**:
   ```bash
   npm run dev
   ```
   Visit http://localhost:4321 and check:
   - `/GasCompare` - Should show gas rates from database
   - `/OOVOCompare` - Should show olive oil options from database

## Database Management Scripts

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema changes to database (dev) |
| `npm run db:migrate` | Create and apply migration (production) |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Populate database with initial data |

## Troubleshooting

### Connection Error: Can't reach database server

- **Check your internet connection**
- **Verify the DATABASE_URL** in `.env` is correct
- **Check Neon console** to ensure your project is running

### "Table does not exist" Error

You need to push the schema first:
```bash
npm run db:push
```

### Empty Data on Pages

Run the seed script to populate the database:
```bash
npm run db:seed
```

### Type Errors After Schema Changes

Regenerate the Prisma client:
```bash
npm run db:generate
```

## Database Schema Overview

### Gas Providers
- Each provider has two rate sets (summer and non-summer)
- Each rate set has 5 tier rates and a daily charge
- Tiered pricing based on consumption (100 MJ steps)

### Olive Oil Providers
- Each provider can have multiple volume options
- Pricing includes shipping costs
- Locations tracked for filtering
- Stock status and direct purchase links included

## Next Steps

- **Add more providers**: Modify the seed script or use Prisma Studio
- **Create admin interface**: Build pages to manage providers via UI
- **Add new comparison types**: Extend the schema for electricity, internet, etc.

## Production Deployment

For production deployments:

1. **Use migrations instead of `db:push`**:
   ```bash
   npm run db:migrate
   ```

2. **Set DATABASE_URL as environment variable** in your hosting platform (Vercel, Netlify, etc.)

3. **Run seed after deployment** (one-time):
   ```bash
   npm run db:seed
   ```

## Security Notes

- Never commit `.env` to version control
- Rotate database credentials periodically
- Use connection pooling for production (Prisma Accelerate or PgBouncer)
- Consider using read replicas for high-traffic scenarios

---

**Need help?** Check the [Neon documentation](https://neon.tech/docs) or [Prisma documentation](https://www.prisma.io/docs)
