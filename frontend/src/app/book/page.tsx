'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { SiteShell } from '@/components/layout/site-shell';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { publicApi } from '@/services';
import type { Service, Doctor } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone is required'),
  petType: z.string().min(1),
  service: z.string().min(1, 'Select a service'),
  doctor: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { petType: 'dog' },
  });

  useEffect(() => {
    Promise.all([publicApi.getServices('limit=20'), publicApi.getDoctors('limit=20')]).then(
      ([s, d]) => {
        setServices(s.data);
        setDoctors(d.data);
      }
    );
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await publicApi.bookAppointment({
        ...data,
        doctor: data.doctor || undefined,
      });
      setDone(true);
      toast.success('Appointment requested!');
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to book');
    }
  };

  return (
    <SiteShell>
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1400&h=700&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-paw-charcoal/85" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-white mb-3 font-[family-name:var(--font-jakarta)]">
              Book Your Appointment
            </h1>
            <p className="text-white/70 text-lg">Schedule in under 2 minutes — we&apos;ll confirm within the hour.</p>
          </div>
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl">
            {done ? (
              <div className="text-center py-12">
                <div className="text-7xl mb-6">🎉</div>
                <h3 className="text-2xl font-bold mb-3 text-paw-charcoal">Appointment Requested!</h3>
                <p className="text-lg mb-8 text-paw-muted">We&apos;ll confirm shortly via email.</p>
                <Button onClick={() => setDone(false)}>Book Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label>Pet Owner Name</Label>
                  <Input {...register('name')} placeholder="Your full name" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input type="email" {...register('email')} placeholder="you@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input {...register('phone')} placeholder="+1 (555) 000-0000" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <Label>Pet Type</Label>
                  <Select {...register('petType')}>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="bird">Bird</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
                <div>
                  <Label>Service Required</Label>
                  <Select {...register('service')}>
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                  {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
                </div>
                <div>
                  <Label>Doctor (optional)</Label>
                  <Select {...register('doctor')}>
                    <option value="">Any available</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} — {d.specialization}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label>Preferred Date</Label>
                  <Input type="date" {...register('date')} min={new Date().toISOString().split('T')[0]} />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label>Message</Label>
                  <Textarea {...register('message')} placeholder="Tell us about your pet..." />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Scheduling...' : 'Schedule Appointment 🐾'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
