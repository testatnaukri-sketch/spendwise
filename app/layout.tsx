import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Spendwise - AI-Powered Personal Finance Advisor',
  description:
    'Get personalized AI-powered recommendations for smarter spending decisions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
