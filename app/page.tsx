import {Container, Section} from "@/components/craft";
import {getPageById} from "@/lib/wordpress";
import HomePage from "@/components/home";

export default async function Home() {
    const homePage = await getPageById(34);

    return (
        <Section>
            <Container>
                <HomePage data={homePage} />
            </Container>
        </Section>
    );
}
