'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
