import {Container, Section} from "@/components/craft";
import {getPageById} from "@/lib/wordpress";
import HomePage from "@/components/home";
import {ReactElement} from "react";
import {Page} from "@/lib/wordpress.d";

export const revalidate = 600;

export default async function Home(): Promise<ReactElement<any, any>> {
    const homePage: Page = await getPageById(34);

    return (
        <Section>
            <Container>
                <HomePage data={homePage} />
            </Container>
        </Section>
    );
}
