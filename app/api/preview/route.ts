import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import {getPageBySlug, getPostBySlug, getProjectBySlug, getTeamMemberBySlug} from "@/lib/wordpress";
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const secret = searchParams.get('secret');
    const slug: string | null = searchParams.get('slug');
    const postType = searchParams.get('post_type');
    const wordpressNonce = searchParams.get('nonce');

    if (!wordpressNonce) {
        return new Response('Invalid nonce', {status: 401})
    }
    else {
        const cookieStore = await cookies();
        cookieStore.set('wordpress_nonce', wordpressNonce);
    }

    if (secret !== process.env.WORDPRESS_PREVIEW_SECRET || !slug || !postType) {
        return new Response('Invalid token', {status: 401})
    }

    if (postType === 'post' && slug) {
        const post = await getPostBySlug(slug);
        if (!post) {
            return new Response('Invalid post', {status: 401});
        }

        const draft = await draftMode();
        draft.enable();
        redirect('/articles/' + post.slug + '?preview=true');
    }

    if (postType === 'page' && slug) {
        const page = await getPageBySlug(slug);
        if (!page) {
            return new Response('Invalid page', {status: 401});
        }

        const draft = await draftMode();
        draft.enable();

        if (page.slug === 'home') {
            redirect('/?preview=true');
        }
        else if (page.slug === 'still-100' || page.slug === 'our-team' || page.slug === 'contact') {
            redirect('/' + page.slug + '?preview=true');
        }
        else {
            redirect('/pages/' + page.slug + '?preview=true');
        }
    }

    if (postType === 'project' && slug) {
        const post = await getProjectBySlug(slug);
        if (!post) {
            return new Response('Invalid post', {status: 401});
        }

        const draft = await draftMode();
        draft.enable();
        redirect('/still-100/' + post.slug + '?preview=true');
    }

    if (postType === 'team-member' && slug) {
        const post = await getTeamMemberBySlug(slug);
        if (!post) {
            return new Response('Invalid post', {status: 401});
        }

        const draft = await draftMode();
        draft.enable();
        redirect('/our-team/' + post.slug + '?preview=true');
    }
}
