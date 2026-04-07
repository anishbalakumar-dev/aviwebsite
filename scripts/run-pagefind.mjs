import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const candidates = [
  path.join(process.cwd(), ".vercel", "output", "static"),
  path.join(process.cwd(), "dist"),
];

function hasHtml(dir) {
  if (!fs.existsSync(dir)) return false;
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && entry.name.endsWith(".html")) {
        return true;
      }
    }
  }
  return false;
}

const target = candidates.find((dir) => hasHtml(dir));

if (!target) {
  console.log("Pagefind skipped: no HTML output found.");
  process.exit(0);
}

console.log(`Running pagefind on ${target}`);
const result = spawnSync("pagefind", ["--site", target], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
