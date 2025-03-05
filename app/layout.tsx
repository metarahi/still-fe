import './globals.css';

import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { footerMenu } from "@/menu.config";
import { Section, Container } from "@/components/craft";
import { Analytics } from "@vercel/analytics/react";
import { siteConfig } from "@/site.config";
import { AOSInit } from '@/components/ui/aos';

import Link from "next/link";

import { cn } from "@/lib/utils";
import Nav from "@/components/nav/nav";
import dynamic from "next/dynamic";
import {Input} from "@/components/ui/input";

// @ts-ignore
// const AOSInit = dynamic(() => import('@/components/ui/aos'), { ssr: true });

export const metadata: Metadata = {
  title: siteConfig.site_name,
  description: siteConfig.site_description,
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: '/',
  },
};

function getYear() {
  return new Date().getFullYear();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <AOSInit />
      <body className={cn('min-h-screen font-sans antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

const Footer = () => {
  return (
    <footer>
      <Section>
        <Container className="flex flex-col md:grid md:grid-cols-16 md:gap-6">
          <div className="flex flex-col footer-menu">
            {Object.entries(footerMenu).map(([key, href]) => (
                <Link
                    className="hover:underline underline-offset-4"
                    key={href}
                    href={href}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
            ))}
          </div>
          <div className="flex footer-copyright">
            <p>
              Copyright &copy; {getYear()} {siteConfig.site_name}&reg;
            </p>
          </div>
          <div className="flex flex-col footer-mailing-list">
            <div className="inner">
              <p>Sign up to our mailing list</p>
              <form className="mailing-list-form">
                <Input placeholder="Enter email" />
                <button type="submit" className="button border p-3 border-black">Submit</button>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </footer>
  );
};
