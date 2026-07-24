'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { SiteShell } from '@/components/layout/site-shell';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Skeleton, EmptyState, Badge } from '@/components/ui/card';
import { publicApi } from '@/services';
import type { AdoptionPet } from '@/types';

export default function AdoptionPage() {
  const [pets, setPets] = useState<AdoptionPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdoptionPet | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    publicApi
      .getAdoptions('limit=20')
      .then((r) => setPets(r.data))
      .catch(() => setPets([]))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await publicApi.requestAdoption(selected._id, form);
      toast.success('Adoption request submitted!');
      setSelected(null);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed');
    }
  };

  return (
    <SiteShell>
      <section className="py-12 bg-gradient-to-br from-paw-light to-paw-beige">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)] mb-3">
            Pet Adoption
          </h1>
          <p className="text-paw-muted text-lg">Give a loving forever home to a pet in need</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid sm:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : !pets.length ? (
            <EmptyState title="No pets available" description="Check back soon for new friends" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <div key={pet._id} className="card-hover bg-white rounded-3xl overflow-hidden shadow-md border border-gray-50">
                  <div className="relative aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pet.images[0]} alt={pet.name} className="w-full h-full object-cover" />
                    <Badge className="absolute top-4 right-4 capitalize" variant="green">
                      {pet.status}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-paw-charcoal">{pet.name}</h3>
                    <p className="text-sm text-paw-muted">{pet.breed} · {pet.gender} · {pet.age}</p>
                    <p className="text-sm text-paw-muted mt-1">📍 {pet.location}</p>
                    <p className="text-sm mt-3 text-paw-charcoal line-clamp-2">{pet.description}</p>
                    <Button
                      variant="orange"
                      className="w-full mt-4"
                      disabled={pet.status === 'adopted'}
                      onClick={() => setSelected(pet)}
                    >
                      Request Adoption
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Adopt {selected.name}</h3>
            <form onSubmit={submit} className="space-y-3">
              <div>
                <Label>Your Name</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label>Why do you want to adopt?</Label>
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setSelected(null)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="orange" className="flex-1">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SiteShell>
  );
}
