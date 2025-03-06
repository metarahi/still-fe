import { MetadataRoute } from "next";
import {getAllPages, getAllPosts, getAllProjects, getAllTeamMembers} from "@/lib/wordpress";
import { siteConfig } from "@/site.config";
import { Page, Post } from "@/lib/wordpress.d";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: Page[] = await getAllPages();
  const posts: Post[] = await getAllPosts();
  const projects: Post[] = await getAllProjects();
  const teamMembers: Post[] = await getAllTeamMembers();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.site_domain}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.site_domain}/still-100`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.site_domain}/our-team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.site_domain}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.site_domain}/pages`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const pageUrls: MetadataRoute.Sitemap = pages.map((page: Page) => ({
    url: `${siteConfig.site_domain}/pages/${page.slug}`,
    lastModified: new Date(page.modified),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const postUrls: MetadataRoute.Sitemap = posts.map((post: Post) => ({
    url: `${siteConfig.site_domain}/articles/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const projectUrls: MetadataRoute.Sitemap = projects.map((project: Post) => ({
    url: `${siteConfig.site_domain}/still-100/${project.slug}`,
    lastModified: new Date(project.modified),
    changeFrequency: "monthly",
    priority: 1,
  }));

  const teamMemberUrls: MetadataRoute.Sitemap = teamMembers.map((teamMember: Post) => ({
    url: `${siteConfig.site_domain}/still-100/${teamMember.slug}`,
    lastModified: new Date(teamMember.modified),
    changeFrequency: "monthly",
    priority: 1,
  }));

  return [...staticUrls, ...pageUrls, ...postUrls, ...projectUrls, ...teamMemberUrls];
}
