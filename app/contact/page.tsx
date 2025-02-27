import {Container, Section} from "@/components/craft";
import {getPageById} from "@/lib/wordpress";
import type {Metadata} from "next";
import React from "react";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Contact us",
};

export default async function Page() {
    const page = await getPageById(270);

    return (
        <Section className="contact-page">
            <Container>
                <div
                    className="mx-90px page-header"
                >
                    <h1 className="h2-headings-and-intros">{page.title.rendered}</h1>
                </div>
                <div className="mx-90px grid grid-cols-16 gap-6">
                    <div className="page-html" dangerouslySetInnerHTML={{'__html': page.content.rendered}}/>
                    <ContactForm/>
                </div>
            </Container>
        </Section>
    );
}
