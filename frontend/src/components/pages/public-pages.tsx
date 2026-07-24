'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteShell } from '@/components/layout/site-shell';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/card';
import { publicApi } from '@/services';
import type { Service, Doctor, BlogPost } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ServicesPageContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getServices('limit=20').then((r) => setServices(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <SiteShell>
      <section className="py-12 bg-paw-beige">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)]">Our Services</h1>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(6)].map((_, i) => <Skeleton key={i} className="h-56" />)
            : services.map((s) => (
                <div key={s._id} id={s.slug} className="rounded-2xl p-7" style={{ background: s.color || '#e8f5e9' }}>
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{s.name}</h3>
                  <p className="text-sm text-paw-muted mb-4">{s.description}</p>
                  <p className="font-bold text-paw-green mb-4">
                    {formatCurrency(s.price)} · {s.duration} min
                  </p>
                  <Link href="/book">
                    <Button size="sm">Book Now</Button>
                  </Link>
                </div>
              ))}
        </div>
      </section>
    </SiteShell>
  );
}

export function DoctorsPageContent() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    publicApi.getDoctors('limit=20').then((r) => setDoctors(r.data));
  }, []);

  return (
    <SiteShell>
      <section className="py-12 bg-paw-beige">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)]">
            Our Veterinarians
          </h1>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((d) => (
            <div key={d._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.photo} alt={d.name} className="w-full aspect-square object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-lg">{d.name}</h3>
                <p className="text-sm text-paw-muted">{d.specialization}</p>
                <p className="text-xs mt-2 text-paw-orange">⭐ {d.rating} · {d.experience} yrs</p>
                <p className="text-sm mt-3 text-paw-muted line-clamp-3">{d.bio}</p>
                <p className="font-semibold text-paw-green mt-3">{formatCurrency(d.consultationFee)} consult</p>
                <Link href="/book" className="block mt-4">
                  <Button variant="outline" className="w-full" size="sm">
                    Book with {d.name.split(' ')[1] || 'Doctor'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

export function BlogPageContent() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const params = category ? `limit=20&category=${encodeURIComponent(category)}` : 'limit=20';
    publicApi.getBlogs(params).then((r) => setBlogs(r.data));
  }, [category]);

  return (
    <SiteShell>
      <section className="py-12 bg-paw-beige">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)]">Pet Care Blog</h1>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {['', 'Pet Health', 'Training', 'Nutrition', 'Grooming'].map((c) => (
              <button
                key={c || 'all'}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  category === c ? 'bg-paw-green text-white' : 'bg-white border text-paw-muted'
                }`}
              >
                {c || 'All'}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-7">
            {blogs.map((b) => (
              <Link key={b._id} href={`/blog/${b.slug}`} className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.featuredImage} alt={b.title} className="w-full aspect-[16/10] object-cover" />
                <div className="p-5">
                  <span className="text-xs font-bold text-paw-green">{b.category}</span>
                  <h3 className="font-bold mt-2 text-paw-charcoal">{b.title}</h3>
                  <p className="text-xs text-paw-muted mt-2">{b.publishedAt ? formatDate(b.publishedAt) : ''}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
