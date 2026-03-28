import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PixelForge — Online Image Editor',
  description: 'Compress, crop, convert and compare images — right in your browser.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}