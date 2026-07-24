'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { useAuthStore, useCartStore } from '@/store';
import { Button } from '@/components/ui/button';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/shop', label: 'Shop' },
  { href: '/adoption', label: 'Adoption' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function AnnouncementBar() {
  return (
    <div className="text-white text-sm py-2 px-4 bg-gradient-to-r from-paw-green to-paw-green-dark">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span>🐾</span>
          <span className="font-medium">Professional Pet Care Services | Book Your Appointment Today</span>
        </div>
        <div className="flex items-center gap-4 text-white/90 text-xs sm:text-sm">
          <a href="tel:+18005729273" className="hover:text-white transition-colors">
            +1 800 572 9273
          </a>
          <a href="mailto:hello@pawcare.vet" className="hidden sm:inline hover:text-white transition-colors">
            hello@pawcare.vet
          </a>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartStore((s) => s.count());

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const accountHref = user
    ? ['admin', 'super_admin'].includes(user.role)
      ? '/admin/dashboard'
      : '/dashboard'
    : '/login';

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'white',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.08)' : '0 1px 0 #f0f0f0',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl bg-gradient-to-br from-paw-green to-paw-green-dark">
            🐾
          </div>
          <span className="text-xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)]">
            Paw<span className="text-paw-green">Care</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-paw-charcoal hover:text-paw-green transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={accountHref}
            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 text-paw-muted"
          >
            <User size={20} />
          </Link>
          <Link
            href="/cart"
            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 text-paw-muted relative"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center bg-paw-orange">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/book" className="hidden lg:inline-flex">
            <Button>Book Appointment</Button>
          </Link>
          <button className="lg:hidden text-paw-charcoal" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium py-2 border-b border-gray-50 text-paw-charcoal"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/book" onClick={() => setOpen(false)}>
            <Button className="w-full">Book Appointment</Button>
          </Link>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-paw-charcoal text-[#b2bec3]">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl bg-paw-green">
                🐾
              </div>
              <span className="text-xl font-extrabold text-white font-[family-name:var(--font-jakarta)]">
                Paw<span className="text-paw-green">Care</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Complete pet care for every stage of your companion&apos;s life — because they deserve nothing less than the best.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 font-[family-name:var(--font-jakarta)]">Quick Links</h4>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-paw-green transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 font-[family-name:var(--font-jakarta)]">Our Services</h4>
            <ul className="space-y-2.5 text-sm">
              {['Veterinary Care', 'Pet Grooming', 'Pet Training', 'Pet Boarding', 'Pet Nutrition', 'Emergency Care'].map(
                (l) => (
                  <li key={l}>
                    <Link href="/services" className="hover:text-paw-green transition-colors">
                      {l}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 font-[family-name:var(--font-jakarta)]">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li>📍 123 Paw Lane, Petsville, CA 90210</li>
              <li>📞 +1 800 572 9273</li>
              <li>✉️ hello@pawcare.vet</li>
              <li>⏰ Mon–Sat: 8am – 8pm</li>
            </ul>
            <div className="mt-5 p-3 rounded-xl text-sm font-semibold flex items-center gap-2 bg-paw-green/20 text-paw-green">
              <span className="w-2 h-2 rounded-full bg-paw-green animate-pulse inline-block" />
              24/7 Emergency: +1 800 911 PETS
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} PawCare. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/contact" className="hover:text-paw-green">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-paw-green">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
