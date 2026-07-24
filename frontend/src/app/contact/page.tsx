'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { SiteShell } from '@/components/layout/site-shell';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';

export default function ContactPage() {
  const [done, setDone] = useState(false);

  return (
    <SiteShell>
      <section className="py-12 bg-paw-beige text-center">
        <h1 className="text-4xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)]">Contact Us</h1>
      </section>
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-paw-charcoal">Get in Touch</h2>
            <p className="text-paw-muted">We&apos;d love to hear from you. Reach out anytime.</p>
            <div className="space-y-4 text-sm">
              <p>📍 123 Paw Lane, Petsville, CA 90210</p>
              <p>📞 +1 800 572 9273</p>
              <p>✉️ hello@pawcare.vet</p>
              <p>⏰ Mon–Sat: 8am – 8pm</p>
              <div className="p-4 rounded-xl bg-paw-green/10 text-paw-green font-semibold">
                24/7 Emergency: +1 800 911 PETS
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl border p-6 shadow-sm">
            {done ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <p className="font-bold text-lg">Message sent! We&apos;ll reply soon.</p>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                  toast.success('Message sent!');
                }}
              >
                <div>
                  <Label>Name</Label>
                  <Input required name="name" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input required type="email" name="email" />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea required name="message" rows={5} />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
