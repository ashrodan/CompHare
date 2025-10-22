/**
 * Olive Oil Provider API - Individual Operations
 * GET /api/admin/olive-oil/[id] - Get single provider
 * PUT /api/admin/olive-oil/[id] - Update provider
 * DELETE /api/admin/olive-oil/[id] - Delete provider
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
    const provider = await prisma.oOVOProvider.findUnique({
      where: { id: params.id },
      include: {
        volumeOptions: {
          orderBy: {
            volume: 'asc'
          }
        }
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
    console.error('Error fetching olive oil provider:', error);
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

    // Delete existing volume options and create new ones
    await prisma.oOVOVolumeOption.deleteMany({
      where: { providerId: params.id }
    });

    // Update provider with new volume options
    const provider = await prisma.oOVOProvider.update({
      where: { id: params.id },
      data: {
        name: data.name,
        location: data.location,
        shipping: parseFloat(data.shipping),
        stockStatus: data.stockStatus,
        link: data.link,
        description: data.description,
        volumeOptions: {
          create: (data.volumeOptions || []).map((option: any) => ({
            volume: parseFloat(option.volume),
            price: parseFloat(option.price)
          }))
        }
      },
      include: {
        volumeOptions: {
          orderBy: {
            volume: 'asc'
          }
        }
      }
    });

    return new Response(JSON.stringify(provider), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating olive oil provider:', error);
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
    await prisma.oOVOProvider.delete({
      where: { id: params.id }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting olive oil provider:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete provider' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
