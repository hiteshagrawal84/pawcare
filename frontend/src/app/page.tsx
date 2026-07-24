import { SiteShell } from '@/components/layout/site-shell';
import { Hero } from '@/components/home/hero';
import {
  ServicesSection,
  WhyChooseUs,
  AboutSection,
  DoctorsSection,
  ShopPreview,
  AdoptionPreview,
  TestimonialsSection,
  BlogPreview,
  Newsletter,
} from '@/components/home/sections';

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <ServicesSection />
      <WhyChooseUs />
      <AboutSection />
      <DoctorsSection />
      <ShopPreview />
      <AdoptionPreview />
      <TestimonialsSection />
      <BlogPreview />
      <Newsletter />
    </SiteShell>
  );
}
