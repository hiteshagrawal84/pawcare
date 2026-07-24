'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { publicApi } from '@/services';
import type { Service, Doctor, Product, AdoptionPet, BlogPost, Review } from '@/types';
import { SectionHeader, Skeleton, Badge } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store';
import { formatCurrency } from '@/lib/utils';

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getServices('limit=6')
      .then((r) => setServices(r.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          badge="What We Offer"
          title="Our Pet Care Services"
          description="Everything your pet needs, under one roof — from routine checkups to emergency care."
        />
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-hover rounded-2xl p-7 border border-transparent hover:border-paw-green/30"
                style={{ background: s.color || '#e8f5e9' }}
              >
                <div className="text-4xl mb-5">{s.icon || '🐾'}</div>
                <h3 className="text-lg font-bold mb-2 text-paw-charcoal font-[family-name:var(--font-jakarta)]">
                  {s.name}
                </h3>
                <p className="text-sm leading-relaxed mb-4 text-paw-muted">{s.description}</p>
                <Link href={`/services#${s.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-paw-green">
                  Learn More <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  const features = [
    'Certified & licensed veterinarians with 10+ years experience',
    'State-of-the-art medical equipment and diagnostics',
    'Personalized treatment plans for every pet',
    'Transparent, affordable pricing with no hidden fees',
    '24/7 emergency support and helpline',
  ];

  return (
    <section className="py-20 bg-paw-beige">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] bg-paw-light">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=700&h=875&fit=crop&auto=format"
              alt="Veterinarian examining a dog"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-paw-green/15">🏆</div>
            <div>
              <div className="font-bold text-lg text-paw-charcoal font-[family-name:var(--font-jakarta)]">Award Winning</div>
              <div className="text-sm text-paw-muted">Best Pet Clinic 2024</div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-paw-orange/15 text-paw-orange">
            Why PawCare
          </div>
          <h2 className="text-4xl font-extrabold leading-tight text-paw-charcoal font-[family-name:var(--font-jakarta)]">
            Trusted Care For Your
            <br />
            <span className="gradient-text">Furry Friends</span>
          </h2>
          <p className="text-lg leading-relaxed text-paw-muted">
            We believe every pet deserves exceptional healthcare. Our team of certified specialists combines medical excellence with genuine compassion.
          </p>
          <div className="space-y-4">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-3 p-4 rounded-xl bg-white shadow-sm">
                <Check className="text-paw-green mt-0.5 flex-shrink-0" size={18} />
                <span className="text-sm font-medium text-paw-charcoal">{f}</span>
              </div>
            ))}
          </div>
          <Link href="/book">
            <Button variant="orange" size="lg">
              Get Started Today <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  const stats = [
    { n: '10+', l: 'Years of Excellence' },
    { n: '32+', l: 'Expert Veterinarians' },
    { n: '5K+', l: 'Happy Pet Families' },
    { n: '12K+', l: 'Pets Treated' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-paw-green/15 text-paw-green">
              About PawCare
            </div>
            <h2 className="text-4xl font-extrabold leading-tight mb-6 text-paw-charcoal font-[family-name:var(--font-jakarta)]">
              More than healthcare,
              <br />
              <span className="gradient-text">we create lifelong bonds.</span>
            </h2>
            <p className="text-lg leading-relaxed mb-4 text-paw-muted">
              Founded in 2014, PawCare has grown from a single-room clinic to a full-service pet wellness center trusted by thousands of families.
            </p>
            <p className="text-base leading-relaxed text-paw-muted">
              From preventive wellness visits to complex surgical procedures, our team brings warmth, skill, and unwavering dedication to every appointment.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl aspect-[3/2] bg-paw-light">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&h=466&fit=crop&auto=format"
              alt="PawCare clinic team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => (
            <div key={s.l} className="stat-card rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold mb-1 text-paw-green font-[family-name:var(--font-jakarta)]">{s.n}</div>
              <div className="text-sm font-medium text-paw-muted">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    publicApi.getDoctors('limit=4').then((r) => setDoctors(r.data)).catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-paw-beige">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          badge="Our Team"
          title="Meet Our Veterinarians"
          description="Board-certified specialists who bring skill, science, and genuine care to every visit."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((v) => (
            <div key={v._id} className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm group">
              <div className="relative overflow-hidden aspect-square bg-paw-light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'}
                  alt={v.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <Badge>{v.experience} yrs exp.</Badge>
                <h3 className="font-bold mt-2 mb-0.5 text-paw-charcoal font-[family-name:var(--font-jakarta)]">{v.name}</h3>
                <p className="text-sm mb-3 text-paw-muted">{v.specialization}</p>
                <div className="text-xs text-paw-orange mb-3">⭐ {v.rating} ({v.reviewCount})</div>
                <Link href={`/doctors`}>
                  <Button variant="outline" className="w-full" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShopPreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    publicApi.getProducts('limit=4&featured=true').then((r) => setProducts(r.data)).catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          badge="🛍️ Pet Shop"
          title="Premium Pet Products"
          description="Vet-recommended nutrition, toys, and grooming essentials."
          badgeColor="orange"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
              <div className="relative overflow-hidden aspect-square bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.images[0] || ''}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {p.badge && (
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white"
                    style={{ background: p.badge === 'Sale' ? '#FF9F43' : '#5CB85C' }}
                  >
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1 text-paw-charcoal font-[family-name:var(--font-jakarta)]">{p.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-extrabold text-paw-green">{formatCurrency(p.price)}</span>
                  <Button
                    size="sm"
                    onClick={() =>
                      addItem({ productId: p._id, name: p.name, price: p.price, image: p.images[0] })
                    }
                  >
                    + Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/shop">
            <Button variant="outline" size="lg">
              View All Products <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function AdoptionPreview() {
  const [pets, setPets] = useState<AdoptionPet[]>([]);

  useEffect(() => {
    publicApi.getAdoptions('limit=3').then((r) => setPets(r.data)).catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-paw-light to-paw-beige">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          badge="❤️ Pet Adoption"
          title="Give a Loving Home To a Pet"
          description="Every pet deserves a forever family."
        />
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {pets.map((pet) => (
            <div key={pet._id} className="card-hover bg-white rounded-3xl overflow-hidden shadow-md group">
              <div className="relative overflow-hidden aspect-[4/3] bg-paw-light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pet.images[0]}
                  alt={pet.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-paw-green capitalize">
                  {pet.status}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-1 text-paw-charcoal font-[family-name:var(--font-jakarta)]">{pet.name}</h3>
                <p className="text-sm mb-1 text-paw-muted">{pet.breed}</p>
                <p className="text-sm font-medium mb-4 text-paw-orange">Age: {pet.age}</p>
                <Link href={`/adoption`}>
                  <Button variant="orange" className="w-full">
                    Adopt Now 🐾
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    publicApi.getReviews('featured=true&limit=5').then((r) => setReviews(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!reviews.length) return;
    const t = setInterval(() => setActive((a) => (a + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [reviews.length]);

  if (!reviews.length) return null;
  const t = reviews[active];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <SectionHeader badge="💬 Happy Owners" title="What Pet Families Say" />
        <div className="rounded-3xl p-8 lg:p-12 text-center shadow-lg bg-gradient-to-br from-paw-beige to-paw-light">
          <div className="flex justify-center gap-1 mb-6 text-paw-orange">
            {[...Array(t.rating)].map((_, j) => (
              <span key={j}>⭐</span>
            ))}
          </div>
          <p className="text-xl lg:text-2xl leading-relaxed mb-8 italic text-paw-charcoal font-[family-name:var(--font-jakarta)]">
            &ldquo;{t.comment}&rdquo;
          </p>
          <div className="font-bold text-paw-charcoal">{t.customer?.name || 'Pet Parent'}</div>
          <div className="text-sm text-paw-muted">{t.petType}</div>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all h-2.5"
              style={{
                width: i === active ? 28 : 10,
                background: i === active ? '#5CB85C' : '#d1fae5',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function BlogPreview() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    publicApi.getBlogs('limit=3').then((r) => setBlogs(r.data)).catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-paw-beige">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          badge="📚 Pet Tips & Guides"
          title="Latest from Our Blog"
          description="Expert advice, care guides, and heartwarming stories."
        />
        <div className="grid sm:grid-cols-3 gap-7">
          {blogs.map((b) => (
            <Link key={b._id} href={`/blog/${b.slug}`} className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm group block">
              <div className="relative overflow-hidden aspect-[16/10] bg-paw-light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.featuredImage || ''}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-paw-green">
                  {b.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold leading-snug mb-4 text-paw-charcoal font-[family-name:var(--font-jakarta)]">{b.title}</h3>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-paw-green">
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await publicApi.subscribe(email);
      setDone(true);
    } catch {
      setDone(true);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-paw-green to-paw-green-dark">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="text-5xl mb-4">🐾</div>
        <h2 className="text-3xl font-extrabold text-white mb-3 font-[family-name:var(--font-jakarta)]">
          Get Pet Care Tips Delivered
        </h2>
        <p className="text-white/80 text-lg mb-8">
          Join 8,000+ pet parents receiving weekly vet-approved care tips and deals.
        </p>
        {done ? (
          <div className="inline-flex items-center gap-3 bg-white/20 rounded-2xl px-6 py-4 text-white font-semibold text-lg">
            ✅ You&apos;re subscribed! Welcome to the PawCare family.
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-xl text-sm outline-none border-2 border-transparent focus:border-white/50 bg-white/20 text-white placeholder:text-white/60"
            />
            <button type="submit" className="px-7 py-3.5 rounded-xl font-bold text-sm bg-white text-paw-green hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
