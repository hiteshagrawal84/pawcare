'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteShell } from '@/components/layout/site-shell';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/card';
import { useCartStore, useAuthStore } from '@/store';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQty, removeItem, total, clear } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  if (!items.length) {
    return (
      <SiteShell>
        <EmptyState
          title="Your cart is empty"
          description="Browse our shop for premium pet products"
          action={
            <Link href="/shop">
              <Button>Go to Shop</Button>
            </Link>
          }
        />
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold mb-8 text-paw-charcoal font-[family-name:var(--font-jakarta)]">
          Shopping Cart
        </h1>
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-gray-50" />
              <div className="flex-1">
                <h3 className="font-bold text-paw-charcoal">{item.name}</h3>
                <p className="text-paw-green font-semibold">{formatCurrency(item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    className="w-8 h-8 rounded-lg border"
                    onClick={() => updateQty(item.productId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="w-8 h-8 rounded-lg border"
                    onClick={() => updateQty(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button className="text-red-500 text-sm ml-auto" onClick={() => removeItem(item.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-paw-beige rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-paw-muted">Subtotal</p>
            <p className="text-2xl font-extrabold text-paw-charcoal">{formatCurrency(total())}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={clear}>
              Clear
            </Button>
            <Button
              onClick={() => {
                if (!user) router.push('/login');
                else router.push('/checkout');
              }}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
