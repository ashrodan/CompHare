/**
 * Gas Providers API - List and Create
 * GET /api/admin/gas-providers - List all providers
 * POST /api/admin/gas-providers - Create new provider
 */

import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../utils/auth';
import { prisma } from '../../../lib/db';

export const GET: APIRoute = async ({ cookies }) => {
  // Check authentication
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const providers = await prisma.gasProvider.findMany({
      include: {
        summerRates: true,
        nonSummerRates: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return new Response(JSON.stringify(providers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching gas providers:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch providers' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check authentication
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.summerRates || !data.nonSummerRates) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create provider with rates
    const provider = await prisma.gasProvider.create({
      data: {
        name: data.name,
        summerRates: {
          create: {
            season: data.summerRates.season,
            dailyCharge: parseFloat(data.summerRates.dailyCharge),
            step1Rate: parseFloat(data.summerRates.step1Rate),
            step2Rate: parseFloat(data.summerRates.step2Rate),
            step3Rate: parseFloat(data.summerRates.step3Rate),
            step4Rate: parseFloat(data.summerRates.step4Rate),
            step5Rate: parseFloat(data.summerRates.step5Rate),
          }
        },
        nonSummerRates: {
          create: {
            season: data.nonSummerRates.season,
            dailyCharge: parseFloat(data.nonSummerRates.dailyCharge),
            step1Rate: parseFloat(data.nonSummerRates.step1Rate),
            step2Rate: parseFloat(data.nonSummerRates.step2Rate),
            step3Rate: parseFloat(data.nonSummerRates.step3Rate),
            step4Rate: parseFloat(data.nonSummerRates.step4Rate),
            step5Rate: parseFloat(data.nonSummerRates.step5Rate),
          }
        }
      },
      include: {
        summerRates: true,
        nonSummerRates: true,
      }
    });

    return new Response(JSON.stringify(provider), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating gas provider:', error);
    return new Response(JSON.stringify({ error: 'Failed to create provider' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
