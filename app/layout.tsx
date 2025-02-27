import './globals.css';

import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import { mainMenu, footerMenu } from "@/menu.config";
import { Section, Container } from "@/components/craft";
import { Analytics } from "@vercel/analytics/react";
import { siteConfig } from "@/site.config";

import Balancer from "react-wrap-balancer";
import Logo from '@/public/logo.svg';
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {NavLink} from "@/components/nav/nav-link";
import Nav from "@/components/nav/nav";

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
        <Container className="grid grid-cols-16 gap-6">
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
            <p>Mailing list signup placeholder</p>
          </div>
        </Container>
      </Section>
    </footer>
  );
};
