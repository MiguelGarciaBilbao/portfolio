import type { ReactNode } from 'react';
import './globals.css';

// El <html> lo renderiza app/[locale]/layout.tsx (next-intl).
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
