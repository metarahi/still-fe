import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
      <Section className="page-page page-not-found">
        <Container>
          <div className="mx-90px grid max-md:grid-cols-4 md:grid-cols-16 md:gap-6">
            <div className="page-html">
              <h1 className="h1-article-headings">Page not found</h1>
              <p>
                Sorry, this page isn’t available anymore or an error occurred.
              </p>
              <Link href="/" className="button border py-3 px-10 border-black bg-transparent">Go back</Link>
            </div>
          </div>
        </Container>
      </Section>
  );
}
