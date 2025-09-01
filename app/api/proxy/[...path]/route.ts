/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

async function proxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  const search = req.nextUrl.searchParams.toString();

  // ✅ Safe fallback handling
  const apiUrl =
    process.env.API_URL?.replace(/\/$/, "") ||
    "https://m-backend.dowinnsys.com"; // default if not set

  if (!apiUrl) {
    return new Response(
      JSON.stringify({ error: "API_URL not defined in env" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const targetUrl = `${apiUrl}/${path.join("/")}${search ? `?${search}` : ""}`;
  console.log("🔀 Proxy forwarding to:", targetUrl);

  // Forward headers
  const headers: HeadersInit = {};
  const forwardHeaders = ["content-type", "accept", "authorization"];

  forwardHeaders.forEach((h) => {
    const val = req.headers.get(h);
    if (val) headers[h] = val;
  });

  headers["Origin"] = apiUrl;
  headers["Referer"] = apiUrl;

  // Forward body if not GET/HEAD
  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.text()
      : undefined;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
  });

  let resBody: unknown;
  try {
    resBody = await response.json();
  } catch {
    resBody = await response.text();
  }

  return new Response(JSON.stringify(resBody), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}
export async function POST(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}
export async function PATCH(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}
export async function PUT(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}
export async function DELETE(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}
