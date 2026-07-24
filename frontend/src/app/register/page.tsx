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
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useAuthStore((s) => s.register);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
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
              Join PawCare
            </h1>
            <p className="text-paw-muted text-sm mt-2">Create your pet parent account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input {...register('name')} placeholder="Jane Doe" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" {...register('email')} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Phone</Label>
              <Input {...register('phone')} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" {...register('password')} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>
          <p className="text-center text-sm text-paw-muted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-paw-green font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
