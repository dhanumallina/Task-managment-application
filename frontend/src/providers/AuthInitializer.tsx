'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../lib/store';

/**
 * Mounts once at the root of the app.
 * Reads the stored accessToken from localStorage, fetches /auth/me to validate it,
 * and sets isLoading: false so every route's auth-guard works correctly.
 */
export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
