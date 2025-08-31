/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

const API_URL = "https://m-backend.dowinnsys.com";

async function proxy(req: NextRequest, context: any) {
  const { path } = (await context.params) as { path: string[] };

  const search = req.nextUrl.searchParams.toString();
  const targetUrl = `${API_URL}/${path.join("/")}${search ? `?${search}` : ""}`;

  const headers: HeadersInit = {};
  const forwardHeaders = ["content-type", "accept", "authorization"];

  forwardHeaders.forEach((h) => {
    const val = req.headers.get(h);
    if (val) headers[h] = val;
  });

  headers["Origin"] = API_URL;
  headers["Referer"] = API_URL;

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
export async function PUT(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}
export async function PATCH(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}
export async function DELETE(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}
