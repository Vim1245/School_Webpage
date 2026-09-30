/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default user-provided credentials
const DEFAULT_SUPABASE_URL = 'https://gbmkshrvjqdbklufjoli.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWtzaHJ2anFkYmtsdWZqb2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODU2MDEsImV4cCI6MjEwNjE2MTYwMX0.H7IJMFLCDaOb0RUDXNjbo60WESk46_OG1n_zR4EMecw';

// Helper to get Supabase credentials safely from env or defaults
export function getSupabaseCredentials() {
  const metaEnv = (import.meta as any).env || {};
  const procEnv = typeof process !== 'undefined' ? process.env || {} : {};

  const url =
    procEnv.SUPABASE_URL ||
    metaEnv.VITE_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

  const anonKey =
    procEnv.SUPABASE_ANON_KEY ||
    metaEnv.VITE_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url !== 'MY_SUPABASE_URL' &&
    !url.includes('placeholder') &&
    url.startsWith('https://')
  );

  return { url, anonKey, isConfigured };
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return null;
  }

  if (!cachedClient) {
    try {
      cachedClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return cachedClient;
}
