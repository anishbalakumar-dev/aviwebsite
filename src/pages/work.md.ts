import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# Work

Companies and organizations.

---

[Back to Home](/index.md)`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
