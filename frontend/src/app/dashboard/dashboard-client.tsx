'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { SiteShell } from '@/components/layout/site-shell';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { Card, CardContent, Badge, EmptyState, Skeleton } from '@/components/ui/card';
import { useAuthStore } from '@/store';
import { customerApi, authApi } from '@/services';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Appointment, Order, Product } from '@/types';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'orders', label: 'Orders' },
  { id: 'pets', label: 'My Pets' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'profile', label: 'Profile' },
  { id: 'reviews', label: 'Reviews' },
];

export default function CustomerDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, logout, hydrate, setAuth, token } = useAuthStore();
  const [tab, setTab] = useState(searchParams.get('tab') || 'overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pets, setPets] = useState<Record<string, unknown>[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [petForm, setPetForm] = useState({ name: '', type: 'dog', breed: '', age: '', gender: 'unknown' });
  const [profile, setProfile] = useState({ name: '', phone: '' });
  const [review, setReview] = useState({ rating: 5, comment: '', title: '' });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
    if (user && ['admin', 'super_admin'].includes(user.role)) router.push('/admin/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    setProfile({ name: user.name, phone: user.phone || '' });
    setLoading(true);
    Promise.all([
      customerApi.getAppointments('limit=20'),
      customerApi.getOrders('limit=20'),
      customerApi.getPets('limit=20'),
      customerApi.getWishlist(),
    ])
      .then(([a, o, p, w]) => {
        setAppointments(a.data);
        setOrders(o.data);
        setPets(p.data as Record<string, unknown>[]);
        setWishlist(w.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (isLoading || !user) {
    return (
      <SiteShell>
        <div className="py-20 text-center text-paw-muted">Loading dashboard...</div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)]">
              Hello, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-paw-muted text-sm">Manage your pets, appointments, and orders</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              router.push('/');
            }}
          >
            Sign Out
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                tab === t.id ? 'bg-paw-green text-white' : 'bg-white border text-paw-muted hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <>
            {tab === 'overview' && (
              <div className="grid sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-5">
                    <p className="text-sm text-paw-muted">Appointments</p>
                    <p className="text-3xl font-extrabold text-paw-green">{appointments.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5">
                    <p className="text-sm text-paw-muted">Orders</p>
                    <p className="text-3xl font-extrabold text-paw-orange">{orders.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5">
                    <p className="text-sm text-paw-muted">Saved Pets</p>
                    <p className="text-3xl font-extrabold text-blue-500">{pets.length}</p>
                  </CardContent>
                </Card>
                <Card className="sm:col-span-3">
                  <CardContent className="pt-5 flex flex-wrap gap-3">
                    <Link href="/book"><Button>Book Appointment</Button></Link>
                    <Link href="/shop"><Button variant="outline">Shop Products</Button></Link>
                    <Link href="/adoption"><Button variant="orange">Adopt a Pet</Button></Link>
                  </CardContent>
                </Card>
              </div>
            )}

            {tab === 'appointments' && (
              <div className="space-y-3">
                {!appointments.length ? (
                  <EmptyState title="No appointments yet" action={<Link href="/book"><Button>Book Now</Button></Link>} />
                ) : (
                  appointments.map((a) => (
                    <Card key={a._id}>
                      <CardContent className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-bold">{typeof a.service === 'object' ? a.service.name : 'Service'}</p>
                          <p className="text-sm text-paw-muted">
                            {formatDate(a.date)} · {a.petType}{a.petName ? ` (${a.petName})` : ''}
                          </p>
                        </div>
                        <Badge variant={a.status === 'confirmed' ? 'blue' : a.status === 'completed' ? 'green' : a.status === 'cancelled' ? 'red' : 'orange'} className="capitalize w-fit">
                          {a.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {tab === 'orders' && (
              <div className="space-y-3">
                {!orders.length ? (
                  <EmptyState title="No orders yet" action={<Link href="/shop"><Button>Shop Now</Button></Link>} />
                ) : (
                  orders.map((o) => (
                    <Card key={o._id}>
                      <CardContent className="pt-5 flex justify-between items-center">
                        <div>
                          <p className="font-bold">{o.orderNumber}</p>
                          <p className="text-sm text-paw-muted">{formatDate(o.createdAt || '')} · {o.items.length} item(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-paw-green">{formatCurrency(o.total)}</p>
                          <Badge className="capitalize mt-1">{o.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {tab === 'pets' && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {pets.map((p) => (
                    <Card key={String(p._id)}>
                      <CardContent className="pt-5 flex justify-between">
                        <div>
                          <p className="font-bold">{String(p.name)}</p>
                          <p className="text-sm text-paw-muted capitalize">{String(p.type)} · {String(p.breed || '—')} · {String(p.age || '—')}</p>
                        </div>
                        <button className="text-red-500 text-sm" onClick={async () => {
                          await customerApi.deletePet(String(p._id));
                          setPets(pets.filter((x) => x._id !== p._id));
                          toast.success('Pet removed');
                        }}>Remove</button>
                      </CardContent>
                    </Card>
                  ))}
                  {!pets.length && <EmptyState title="No pets saved yet" />}
                </div>
                <Card>
                  <CardContent className="pt-5 space-y-3">
                    <h3 className="font-bold">Add Pet</h3>
                    <div><Label>Name</Label><Input value={petForm.name} onChange={(e) => setPetForm({ ...petForm, name: e.target.value })} /></div>
                    <div>
                      <Label>Type</Label>
                      <Select value={petForm.type} onChange={(e) => setPetForm({ ...petForm, type: e.target.value })}>
                        <option value="dog">Dog</option><option value="cat">Cat</option><option value="rabbit">Rabbit</option><option value="bird">Bird</option><option value="other">Other</option>
                      </Select>
                    </div>
                    <div><Label>Breed</Label><Input value={petForm.breed} onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })} /></div>
                    <div><Label>Age</Label><Input value={petForm.age} onChange={(e) => setPetForm({ ...petForm, age: e.target.value })} /></div>
                    <Button onClick={async () => {
                      const r = await customerApi.createPet(petForm) as { data: Record<string, unknown> };
                      setPets([...pets, r.data]);
                      setPetForm({ name: '', type: 'dog', breed: '', age: '', gender: 'unknown' });
                      toast.success('Pet added');
                    }}>Save Pet</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {tab === 'wishlist' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {!wishlist.length ? (
                  <div className="col-span-full"><EmptyState title="Wishlist is empty" action={<Link href="/shop"><Button>Browse Shop</Button></Link>} /></div>
                ) : wishlist.map((p) => (
                  <Card key={p._id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images?.[0]} alt={p.name} className="w-full aspect-square object-cover" />
                    <CardContent className="pt-3">
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-paw-green font-semibold">{formatCurrency(p.price)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {tab === 'profile' && (
              <Card className="max-w-lg">
                <CardContent className="pt-5 space-y-3">
                  <div><Label>Name</Label><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
                  <div><Label>Email</Label><Input value={user.email} disabled /></div>
                  <div><Label>Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
                  <Button onClick={async () => {
                    const r = await authApi.updateProfile(profile);
                    if (token) setAuth(r.data, token);
                    toast.success('Profile updated');
                  }}>Save Profile</Button>
                </CardContent>
              </Card>
            )}

            {tab === 'reviews' && (
              <Card className="max-w-lg">
                <CardContent className="pt-5 space-y-3">
                  <h3 className="font-bold">Leave a Review</h3>
                  <div>
                    <Label>Rating</Label>
                    <Select value={String(review.rating)} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                    </Select>
                  </div>
                  <div><Label>Title</Label><Input value={review.title} onChange={(e) => setReview({ ...review, title: e.target.value })} /></div>
                  <div><Label>Comment</Label><Textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} /></div>
                  <Button onClick={async () => {
                    await customerApi.createReview({ ...review, isFeatured: false });
                    toast.success('Review submitted');
                    setReview({ rating: 5, comment: '', title: '' });
                  }}>Submit Review</Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </SiteShell>
  );
}
