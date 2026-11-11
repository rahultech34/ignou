import type { MetadataRoute } from "next";
import { getPrograms, getMbaSpecializations, getBlogs } from "@/lib/admin-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ignou.edukyu.com";

  // Fetch dynamic collections
  const [programs, mbaSpecs, blogs] = await Promise.all([
    getPrograms().catch(() => []),
    getMbaSpecializations().catch(() => []),
    getBlogs().catch(() => []),
  ]);

  // Static directory pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mba-specializations`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ug-programs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pg-programs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Dynamic Programs (UG, PG, Certificates)
  const programRoutes: MetadataRoute.Sitemap = programs
    .filter((p) => p.status === "published" || !p.status)
    .flatMap((p) => {
      const routes: MetadataRoute.Sitemap = [
        {
          url: `${baseUrl}/programs/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        },
      ];
      if (p.type === "ug") {
        routes.push({
          url: `${baseUrl}/ug-programs/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      } else if (p.type === "pg") {
        routes.push({
          url: `${baseUrl}/pg-programs/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
      return routes;
    });

  // Dynamic MBA Specializations
  const mbaRoutes: MetadataRoute.Sitemap = mbaSpecs
    .filter((m) => m.status === "published" || !m.status)
    .map((m) => ({
      url: `${baseUrl}/mba-specializations/${m.slug}`,
      lastModified: m.updatedAt ? new Date(m.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  // Dynamic Blog Posts
  const blogRoutes: MetadataRoute.Sitemap = blogs
    .filter((b) => b.status === "published" || !b.status)
    .map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...programRoutes, ...mbaRoutes, ...blogRoutes];
}
