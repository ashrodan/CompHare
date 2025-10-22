/**
 * Simple Authentication Utility
 *
 * For production, consider using:
 * - Auth.js (formerly NextAuth)
 * - Clerk
 * - Supabase Auth
 */

import type { AstroCookies } from 'astro';

// Environment variables for admin credentials
const ADMIN_USERNAME = import.meta.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || 'comphare2024';
const SESSION_COOKIE_NAME = 'comphare_admin_session';
const SESSION_SECRET = import.meta.env.SESSION_SECRET || 'change-this-in-production';

/**
 * Verify admin credentials
 */
export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

/**
 * Create admin session
 */
export function createSession(cookies: AstroCookies): void {
  // In production, use proper JWT or session tokens
  const sessionToken = Buffer.from(`${SESSION_SECRET}:${Date.now()}`).toString('base64');

  cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  });
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(cookies: AstroCookies): boolean {
  const session = cookies.get(SESSION_COOKIE_NAME);
  return !!session?.value;
}

/**
 * Destroy admin session
 */
export function destroySession(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

/**
 * Redirect to login if not authenticated
 */
export function requireAuth(cookies: AstroCookies): Response | null {
  if (!isAuthenticated(cookies)) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/admin/login'
      }
    });
  }
  return null;
}
