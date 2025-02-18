// Craft Imports
import { Section, Container, Prose } from "@/components/craft";
import Balancer from "react-wrap-balancer";

import Link from "next/link";
import {getPageById, WordPressAPIError} from "@/lib/wordpress";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";
import {Property} from "csstype";
import Page = Property.Page;

export default async function Home() {
    const homePage = await getPageById(34);

    return (
        <Section>
            <Container>
                <HomeData data={homePage}/>
            </Container>
        </Section>
    );
}

const HomeData = (page: Page) => {
    page = page.data;
    const markup = { __html: page.content.rendered };

    return <div dangerouslySetInnerHTML={markup} />;
};
