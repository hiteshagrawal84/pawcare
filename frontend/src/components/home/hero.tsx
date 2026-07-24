'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-paw-beige to-paw-light">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 bg-[radial-gradient(circle,#5CB85C,transparent)]" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-15 bg-[radial-gradient(circle,#FF9F43,transparent)]" />

      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-paw-green/15 text-paw-green">
            <span>🐾</span> Trusted by 5,000+ Pet Families
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-paw-charcoal font-[family-name:var(--font-jakarta)]">
            Healthy Pets,
            <br />
            <span className="gradient-text">Happy Families</span>
          </h1>
          <p className="text-lg leading-relaxed text-paw-muted max-w-[480px]">
            Complete veterinary care, grooming, training and wellness services for your beloved pets — delivered with genuine love and expertise.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/book">
              <Button size="lg">
                Book Appointment <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline">
                Explore Services
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-6 pt-4">
            {[
              { n: '10+', l: 'Years Experience' },
              { n: '5K+', l: 'Happy Pets' },
              { n: '24/7', l: 'Support' },
            ].map((b) => (
              <div key={b.l} className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-paw-green font-[family-name:var(--font-jakarta)]">
                  {b.n}
                </span>
                <span className="text-xs leading-tight text-paw-muted whitespace-pre-line">
                  {b.l.replace(' ', '\n')}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative flex items-center justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] bg-paw-light">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=750&fit=crop&auto=format"
                alt="Happy golden retriever at PawCare clinic"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-paw-beige">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&auto=format"
                alt="Veterinarian with pet"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="float-badge absolute -top-4 -left-8 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="text-sm font-bold text-paw-charcoal">4.9/5 Rating</div>
                <div className="text-xs text-paw-muted">1,200+ reviews</div>
              </div>
            </div>
            <div className="float-badge-2 absolute top-1/3 -right-4 sm:-right-8 bg-white rounded-2xl shadow-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-paw-green/15">🏥</div>
                <div>
                  <div className="text-xs font-bold text-paw-charcoal">Next Available</div>
                  <div className="text-xs text-paw-green font-semibold">Today 2:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
