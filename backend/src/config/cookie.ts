export const SESSION_COOKIE_NAME = 'session_id';

export const SESSION_COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: SESSION_COOKIE_MAX_AGE_MS,
};