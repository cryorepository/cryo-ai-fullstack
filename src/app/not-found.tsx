import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Page Not Found - CryoRepository AI',
  description: 'Your source of information on cryoprotective agents.',
  alternates: {
    canonical: 'https://ai.cryorepository.com',
  },
  openGraph: {
    siteName: 'CryoRepository',
    title: 'Page Not Found - CryoRepository AI',
    description: 'Your source of information on cryoprotective agents.',
    url: 'https://ai.cryorepository.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Not Found - CryoRepository AI',
    description: 'Your source of information on cryoprotective agents.',
    images: [
      '/favicon.png',
    ],
  },
};

export default function NotFound() {
    return (
      <div className="w-full h-screen flex items-center justify-center mx-auto">
        <div className="flex gap-2 items-center">
          <h1 className="text-4xl pr-2 border-r-[1px] border-(--foreground) font-semibold">404</h1>
          <h3 className="text-xl font-semibold">Page Not Found</h3>
        </div>
      </div>
    );
}