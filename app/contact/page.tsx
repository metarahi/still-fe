import {Container, Section} from "@/components/craft";
import {getPageById} from "@/lib/wordpress";
import type {Metadata} from "next";
import React, {ReactElement} from "react";
import ContactForm from "@/components/contact-form";
import {Page as WordpressPage} from "@/lib/wordpress.d";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Contact us",
};

export default async function Page(): Promise<ReactElement<any, any>> {
    const page: WordpressPage = await getPageById(270);

    return (
        <Section className="contact-page">
            <Container>
                <div
                    className="mx-90px page-header"
                >
                    <h1 className="h3-headings-and-pullquotes md:h2-headings-and-intros">{page.title.rendered}</h1>
                </div>
                <div className="mx-90px md:grid grid-cols-16 gap-6">
                    <div className="page-html" dangerouslySetInnerHTML={{'__html': page.content.rendered}}/>
                    <ContactForm/>
                </div>
            </Container>
        </Section>
    );
}
