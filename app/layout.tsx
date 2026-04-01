/**
 * MODIFIED FILE: app/layout.tsx
 * Change: wrap with <I18nProvider> — 2 lines added.
 */

import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n'; // ← NEW

export const metadata: Metadata = {
  title: 'PixelForge — Online Image Editor',
  description: 'Compress, crop, convert and compare images — right in your browser.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>{children}</I18nProvider> {/* ← NEW */}
      </body>
    </html>
  );
}