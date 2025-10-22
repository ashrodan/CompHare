/**
 * Gas Provider API - Individual Operations
 * GET /api/admin/gas-providers/[id] - Get single provider
 * PUT /api/admin/gas-providers/[id] - Update provider
 * DELETE /api/admin/gas-providers/[id] - Delete provider
 */

import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../utils/auth';
import { prisma } from '../../../../lib/db';

export const GET: APIRoute = async ({ params, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const provider = await prisma.gasProvider.findUnique({
      where: { id: params.id },
      include: {
        summerRates: true,
        nonSummerRates: true,
      }
    });

    if (!provider) {
      return new Response(JSON.stringify({ error: 'Provider not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(provider), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching gas provider:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch provider' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();

    // Update provider and rates
    const provider = await prisma.gasProvider.update({
      where: { id: params.id },
      data: {
        name: data.name,
        summerRates: {
          update: {
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
          update: {
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
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating gas provider:', error);
    return new Response(JSON.stringify({ error: 'Failed to update provider' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    await prisma.gasProvider.delete({
      where: { id: params.id }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting gas provider:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete provider' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
