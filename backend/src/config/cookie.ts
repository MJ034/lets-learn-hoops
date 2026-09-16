import type { CookieOptions } from 'express';

export const SESSION_COOKIE_NAME = 'session_id';

export const SESSION_COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function readBooleanEnv(name: string, fallback: boolean) {
  const value = process.env[name]?.trim().toLowerCase();
  if (!value) return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`${name} must be true or false`);
}

function readSameSiteEnv(): CookieOptions['sameSite'] {
  const value = process.env.SESSION_COOKIE_SAME_SITE?.trim().toLowerCase();
  if (!value) return 'lax';
  if (value === 'lax' || value === 'strict' || value === 'none') return value;
  throw new Error('SESSION_COOKIE_SAME_SITE must be lax, strict, or none');
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.SESSION_COOKIE_SECURE) {
    throw new Error('SESSION_COOKIE_SECURE must be set in production');
  }
  if (!process.env.SESSION_COOKIE_SAME_SITE) {
    throw new Error('SESSION_COOKIE_SAME_SITE must be set in production');
  }
}

export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: readBooleanEnv('SESSION_COOKIE_SECURE', false),
  sameSite: readSameSiteEnv(),
  maxAge: SESSION_COOKIE_MAX_AGE_MS,
};

if (process.env.SESSION_COOKIE_DOMAIN?.trim()) {
  sessionCookieOptions.domain = process.env.SESSION_COOKIE_DOMAIN.trim();
}