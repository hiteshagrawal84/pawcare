'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SiteShell } from '@/components/layout/site-shell';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { useCartStore, useAuthStore } from '@/store';
import { customerApi } from '@/services';
import { formatCurrency } from '@/lib/utils';

export default function CheckoutPage() {
  const { items, total, clear } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  if (!user) {
    router.push('/login');
    return null;
  }

  if (!items.length) {
    router.push('/shop');
    return null;
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await customerApi.createOrder({
        items: items.map((i) => ({ product: i.productId, quantity: i.quantity })),
        shippingAddress: form,
        paymentMethod: 'card',
      });
      clear();
      toast.success('Order placed successfully!');
      router.push('/dashboard?tab=orders');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold mb-8 text-paw-charcoal font-[family-name:var(--font-jakarta)]">
          Checkout
        </h1>
        <form onSubmit={placeOrder} className="grid gap-4 bg-white rounded-3xl border p-6">
          <h2 className="font-bold text-lg">Shipping Address</h2>
          {(['name', 'phone', 'street', 'city', 'state', 'zip'] as const).map((field) => (
            <div key={field}>
              <Label className="capitalize">{field}</Label>
              <Input
                required
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}
          <div className="border-t pt-4 mt-2">
            <p className="text-sm text-paw-muted mb-1">Order total</p>
            <p className="text-2xl font-extrabold text-paw-green mb-4">{formatCurrency(total())}</p>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Placing order...' : 'Place Order'}
            </Button>
          </div>
        </form>
      </div>
    </SiteShell>
  );
}
