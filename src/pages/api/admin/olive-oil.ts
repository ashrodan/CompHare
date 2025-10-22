/**
 * Olive Oil Providers API - List and Create
 * GET /api/admin/olive-oil - List all providers
 * POST /api/admin/olive-oil - Create new provider
 */

import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../utils/auth';
import { prisma } from '../../../lib/db';

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
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

    return new Response(JSON.stringify(providers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching olive oil providers:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch providers' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.location || data.shipping === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create provider with volume options
    const provider = await prisma.oOVOProvider.create({
      data: {
        name: data.name,
        location: data.location,
        shipping: parseFloat(data.shipping),
        stockStatus: data.stockStatus || 'In Stock',
        link: data.link || '',
        description: data.description || '',
        volumeOptions: {
          create: (data.volumeOptions || []).map((option: any) => ({
            volume: parseFloat(option.volume),
            price: parseFloat(option.price)
          }))
        }
      },
      include: {
        volumeOptions: true
      }
    });

    return new Response(JSON.stringify(provider), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating olive oil provider:', error);
    return new Response(JSON.stringify({ error: 'Failed to create provider' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
