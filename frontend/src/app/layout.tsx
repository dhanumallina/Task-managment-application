import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import QueryProvider from '../providers/QueryProvider';
import AuthInitializer from '../providers/AuthInitializer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Lumio — Clarity in every task',
  description: 'A premium SaaS task management platform for teams. Organize, track, and collaborate with real-time updates.',
  keywords: 'task management, project management, team collaboration, kanban, productivity',
  openGraph: {
    title: 'Lumio',
    description: 'Modern task management for productive teams',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <QueryProvider>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </QueryProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
