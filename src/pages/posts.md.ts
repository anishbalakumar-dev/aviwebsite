import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# Posts

LinkedIn activity feed.

- [View LinkedIn Profile](https://www.linkedin.com/in/avganguly/)

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
