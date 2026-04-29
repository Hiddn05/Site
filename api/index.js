export const config = { runtime: "edge" };

const DEST = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");

export default async function (req) {
  const url = new URL(req.url);

  // --- مسیر مخفی تو (این را در v2rayNG ست کن) ---
  const secretPath = "/api/v3/assets/static"; 

  if (url.pathname.startsWith(secretPath)) {
    try {
      const targetUrl = DEST + url.pathname.replace(secretPath, "") + url.search;
      const newHeaders = new Headers(req.headers);
      newHeaders.delete("host");
      return await fetch(targetUrl, {
        method: req.method,
        headers: newHeaders,
        body: req.body,
        redirect: "manual",
      });
    } catch (e) {
      return new Response(null, { status: 500 });
    }
  }

  // اگر مسیر مخفی نبود، سایت شیک بالا را نشان بده
  return fetch(new URL("/index.html", req.url));
}

