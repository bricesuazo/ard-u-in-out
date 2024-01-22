import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Providers } from '~/providers';
import '~/styles/globals.css';

const font = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ARN U IN/Out',
  description: 'ARN U IN/Out',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={font.className}>{children}</body>
      </html>
    </Providers>
  );
}
