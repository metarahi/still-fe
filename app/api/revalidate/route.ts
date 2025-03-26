import {headers} from "next/headers";
import {ReadonlyHeaders} from "next/dist/server/web/spec-extension/adapters/headers";
import {revalidatePath} from "next/cache";
import { NextRequest } from 'next/server';

export const runtime = "edge";

export async function POST(request: NextRequest) {
    // Check for secret to confirm this is a valid request
    const headersList: ReadonlyHeaders = await headers();
    const requestHeaderSecret: string | null = headersList.get("x-webhook-secret");
    const webhookSecret: string | undefined = process.env.WORDPRESS_WEBHOOK_SECRET;
    if (!requestHeaderSecret || requestHeaderSecret !== webhookSecret) {
        return new Response(JSON.stringify({ message: "Invalid token" }), {
            status: 401,
        });
    }

    // Create the path
    const body = await request.json();
    const type = body.type;
    const id = body.id;
    const slug = body.slug;
    let path: string = "";
    let indexPath: string = "";

    if (type === "post") {
        path = `/articles/${slug}`;
        indexPath = "/articles";
    }
    else if (type === "project") {
        path = `/still-100/${slug}`;
        indexPath = "/still-100";
    }
    else if (type === "team-member") {
        path = `/our-team/${slug}`;
        indexPath = "/our-team";
    }
    else if (type === "page") {
        path = `/pages/${slug}`;

        if (id === 173) {
            path = "/still-100";
        }
        else if (id === 208) {
            path = "/our-team";
        }
        else if (id === 270) {
            path = "/contact";
        }
        // else if (id === 34) {
        //     path = "/";
        // }
    }

    try {
        revalidatePath(path);
        if (indexPath !== "") {
            revalidatePath(indexPath);
        }
        revalidatePath("/");

        return new Response(JSON.stringify({ revalidated: true, path: path }), {
            status: 200,
        });
    } catch (err) {
        return new Response(JSON.stringify({ message: "Error revalidating" }), {
            status: 500,
        });
    }
}
