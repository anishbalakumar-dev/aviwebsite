import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# Template Site

A clean, minimal Astro blog template you can customize.

## Navigation

- [About](/about.md)
- [Posts](/posts.md)
- [Work](/work.md)
- [RSS Feed](/rss.xml)

## Links

- GitHub: [your-org](https://github.com/your-org)
- X: [@your-handle](https://x.com/your-handle)
- Email: hello@example.com

---

*This is the markdown-only version of the site.*`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
