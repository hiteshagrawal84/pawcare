'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { SiteShell } from '@/components/layout/site-shell';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { useAuthStore } from '@/store';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (['admin', 'super_admin'].includes(user.role)) router.push('/admin/dashboard');
      else if (user.role === 'doctor') router.push('/dashboard');
      else router.push('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-paw-beige to-paw-light">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🐾</div>
            <h1 className="text-2xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)]">
              Welcome Back
            </h1>
            <p className="text-paw-muted text-sm mt-2">Sign in to your PawCare account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" {...register('email')} placeholder="you@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" {...register('password')} placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-center text-sm text-paw-muted mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-paw-green font-semibold hover:underline">
              Register
            </Link>
          </p>
          <div className="mt-6 p-4 rounded-xl bg-paw-light text-xs text-paw-muted space-y-1">
            <p className="font-semibold text-paw-charcoal">Demo accounts (Password123!):</p>
            <p>admin@pawcare.vet · customer@pawcare.vet · sarah@pawcare.vet</p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
