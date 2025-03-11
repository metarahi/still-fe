import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
      <Section className="page-page">
        <Container>
          <div
              className="mx-90px page-header"
          >
            <h1 className="h3-headings-and-pullquotes md:h2-headings-and-intros">404 - Page Not Found</h1>
          </div>
          <div className="mx-90px grid max-md:grid-cols-4 md:grid-cols-16 md:gap-6">
            <div className="page-html">
              <p className="pb-8">
                Sorry, the page you are looking for does not exist.
              </p>
              <Link href="/" className="button border py-3 px-10 border-black bg-transparent">Back to Home</Link>
            </div>
          </div>
        </Container>
      </Section>
  );
}
