import {Container, Section} from "@/components/craft";
import {getPageById, getPostRevisionsById} from "@/lib/wordpress";
import type {Metadata} from "next";
import React, {ReactElement} from "react";
import ContactForm from "@/components/contact-form";
import {Page as WordpressPage} from "@/lib/wordpress.d";
import {draftMode} from "next/headers";

export const revalidate = 600;
export const metadata: Metadata = {
    title: "Contact Us",
    description: "Contact us",
};

export default async function Page(): Promise<ReactElement<any, any>> {
    let page: WordpressPage = await getPageById(270);
    const { isEnabled } = await draftMode();
    if (isEnabled) {
        // @ts-ignore
        page = await getPostRevisionsById(page.id);
    }

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
