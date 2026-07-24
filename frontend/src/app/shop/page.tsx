'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteShell } from '@/components/layout/site-shell';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Skeleton, EmptyState, Badge } from '@/components/ui/card';
import { publicApi } from '@/services';
import { useCartStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import type { Product, Category } from '@/types';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const addItem = useCartStore((s) => s.addItem);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '24', sort });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    publicApi
      .getProducts(params.toString())
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    publicApi.getCategories().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sort]);

  return (
    <SiteShell>
      <section className="py-12 bg-gradient-to-br from-paw-beige to-paw-light">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)] mb-3">
            Pet Shop
          </h1>
          <p className="text-paw-muted text-lg">Premium products curated by our veterinary team</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:max-w-[200px]">
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select value={sort} onChange={(e) => setSort(e.target.value)} className="sm:max-w-[180px]">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </Select>
            <Link href="/cart" className="sm:ml-auto">
              <Button variant="outline">View Cart</Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : !products.length ? (
            <EmptyState title="No products found" description="Try adjusting your filters" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div key={p._id} className="card-hover bg-white rounded-2xl overflow-hidden border border-gray-100">
                  <Link href={`/shop/${p.slug}`}>
                    <div className="aspect-square bg-gray-50 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                  </Link>
                  <div className="p-4">
                    {p.badge && <Badge variant={p.badge === 'Sale' ? 'orange' : 'green'}>{p.badge}</Badge>}
                    <h3 className="font-bold mt-2 text-paw-charcoal">{p.name}</h3>
                    <p className="text-xs text-paw-muted mt-1 line-clamp-2">{p.shortDescription || p.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-extrabold text-paw-green">{formatCurrency(p.price)}</span>
                      <Button
                        size="sm"
                        onClick={() =>
                          addItem({ productId: p._id, name: p.name, price: p.price, image: p.images[0] })
                        }
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
