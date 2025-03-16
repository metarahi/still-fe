import {Container, Section} from "@/components/craft";
import {getPageById, getPostRevisionsById} from "@/lib/wordpress";
import HomePage from "@/components/home";
import {ReactElement} from "react";
import {Page} from "@/lib/wordpress.d";
import {draftMode} from "next/headers";

export const revalidate = 600;

export default async function Home(): Promise<ReactElement<any, any>> {
    let homePage: Page = await getPageById(34);
    const { isEnabled } = await draftMode();
    if (isEnabled) {
        // @ts-ignore
        homePage = await getPostRevisionsById(homePage.id);
    }

    return (
        <Section>
            <Container>
                <HomePage data={homePage} />
            </Container>
        </Section>
    );
}
