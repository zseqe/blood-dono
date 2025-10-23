// frontend/app/layout.tsx
import type { Metadata } from 'next';
import { Poppins as FontSans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Smart Blood Platform | AI Donor Matching',
  description: 'Intelligently connecting blood donors and hospitals using AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-left" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
