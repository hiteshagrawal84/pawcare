import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: {
    default: 'PawCare | Professional Pet Care Services',
    template: '%s | PawCare',
  },
  description:
    'Complete veterinary care, grooming, training and wellness services for your beloved pets.',
  openGraph: {
    title: 'PawCare | Healthy Pets, Happy Families',
    description: 'Complete veterinary care, grooming, training and wellness services.',
    type: 'website',
    siteName: 'PawCare',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'VeterinaryClinic',
              name: 'PawCare',
              description: 'Professional pet care and veterinary services',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
              telephone: '+1-800-572-9273',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '123 Paw Lane',
                addressLocality: 'Petsville',
                addressRegion: 'CA',
                postalCode: '90210',
                addressCountry: 'US',
              },
              openingHours: 'Mo-Sa 08:00-20:00',
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
