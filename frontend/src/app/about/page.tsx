import { SiteShell } from '@/components/layout/site-shell';
import { AboutSection, WhyChooseUs } from '@/components/home/sections';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'About Us' };

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="py-12 bg-paw-beige text-center">
        <h1 className="text-4xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)]">About PawCare</h1>
      </section>
      <AboutSection />
      <WhyChooseUs />
      <div className="text-center pb-16">
        <Link href="/book">
          <Button size="lg">Book an Appointment</Button>
        </Link>
      </div>
    </SiteShell>
  );
}
