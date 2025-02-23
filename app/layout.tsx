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

const Nav = ({ className, children, id }: NavProps) => {
  return (
    <nav
      className={cn('z-50 top-0 bg-transparent absolute w-full', className)}
      id={id}
    >
      <div
        id="nav-container"
        className="max-w-full mx-auto py-4 px-6 sm:px-8 flex justify-center items-center"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-4 items-center position-absolute left-8"
          href="/"
        >
          <Image
            src={Logo}
            alt="Logo"
            loading="eager"
            width={72}
            height={15}
          ></Image>
        </Link>
        {children}
        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button key={href} asChild variant="link" size="menu">
                <Link href={href} className="small-caps-menu-button-lists">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              </Button>
            ))}
          </div>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

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
