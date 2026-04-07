import fs from "node:fs/promises";
import path from "node:path";
import Parser from "rss-parser";
import kebabCase from "lodash.kebabcase";

const WORKSPACE_ROOT = process.cwd();
const BLOG_ROOT = path.join(WORKSPACE_ROOT, "src", "content", "blog");
const DEFAULT_FEED_URL = "https://medium.com/feed/@avishek.g_63458";
const FEED_URL = process.env.MEDIUM_RSS_URL || DEFAULT_FEED_URL;

const parser = new Parser({
  customFields: {
    item: ["content:encoded", "content"],
  },
});

function extractPostId(item) {
  const candidates = [item.guid, item.id, item.link].filter(Boolean);
  for (const value of candidates) {
    const urlMatch = String(value).match(/\/p\/([0-9a-f]{6,})/i);
    if (urlMatch) return urlMatch[1];

    const hexMatch = String(value).match(/([0-9a-f]{12,})/i);
    if (hexMatch) return hexMatch[1];
  }
  return null;
}

function extractSlugFromLink(link) {
  if (!link) return null;
  try {
    const url = new URL(link);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function yamlString(value) {
  return JSON.stringify(value ?? "");
}

function normalizeTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return [];
  return Array.from(
    new Set(
      tags
        .map((tag) => String(tag).trim())
        .filter(Boolean)
        .map((tag) => tag.toLowerCase()),
    ),
  );
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function writePostFile({ year, slug, frontmatter, content }) {
  const dirPath = path.join(BLOG_ROOT, String(year));
  await ensureDir(dirPath);
  const filePath = path.join(dirPath, `${slug}.md`);
  const fileContent = `${frontmatter}\n\n${content}\n`;
  await fs.writeFile(filePath, fileContent, "utf8");
  return filePath;
}

async function run() {
  const feed = await parser.parseURL(FEED_URL);
  const items = feed.items ?? [];

  if (items.length === 0) {
    console.log(`No items found in feed: ${FEED_URL}`);
    return;
  }

  let written = 0;
  for (const item of items) {
    const title = (item.title || "Untitled").trim();
    const link = item.link || "";
    const postId = extractPostId(item);
    const slugFromLink = extractSlugFromLink(link);
    const titleSlug = kebabCase(title) || "post";

    let slug = titleSlug;
    if (postId && !slug.includes(postId)) {
      slug = `${slug}-${postId}`;
    } else if (slugFromLink && slugFromLink.includes("-")) {
      slug = slugFromLink;
    }

    const pubDate = item.isoDate || item.pubDate || new Date().toISOString();
    const pub = new Date(pubDate);
    const year = Number.isNaN(pub.getTime()) ? new Date().getFullYear() : pub.getUTCFullYear();

    const contentHtml = item["content:encoded"] || item.content || "";
    const description =
      (item.contentSnippet && item.contentSnippet.trim()) ||
      stripHtml(contentHtml).slice(0, 200) ||
      title;

    const tags = normalizeTags(item.categories);

    const frontmatterLines = [
      "---",
      `title: ${yamlString(title)}`,
      `description: ${yamlString(description)}`,
      "draft: false",
      `pubDatetime: ${pub.toISOString()}`,
      `tags: ${JSON.stringify(tags)}`,
      `canonicalURL: ${yamlString(link)}`,
      "source: \"medium\"",
      "---",
    ];

    const frontmatter = frontmatterLines.join("\n");
    await writePostFile({ year, slug, frontmatter, content: contentHtml });
    written += 1;
  }

  console.log(`Imported ${written} post${written === 1 ? "" : "s"} from Medium.`);
}

run().catch((error) => {
  console.error("Failed to import Medium RSS:", error);
  process.exit(1);
});
