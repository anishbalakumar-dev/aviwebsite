export const prerender = false;

const DEPLOY_HOOK_URL = process.env.DEPLOY_HOOK_URL;
const CRON_SECRET = process.env.CRON_SECRET;

function isAuthorized(request: Request) {
  if (!CRON_SECRET) return true;
  return request.headers.get("x-cron-secret") === CRON_SECRET;
}

export async function GET({ request }: { request: Request }) {
  if (!isAuthorized(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!DEPLOY_HOOK_URL) {
    return new Response("DEPLOY_HOOK_URL is not set", { status: 500 });
  }

  const response = await fetch(DEPLOY_HOOK_URL, { method: "POST" });
  const text = await response.text().catch(() => "");

  return new Response(`Triggered deploy hook: ${response.status}${text ? `\n${text}` : ""}`, {
    status: response.ok ? 200 : 502,
  });
}
