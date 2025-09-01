/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

async function proxy(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  const { path } = context.params;

  const search = req.nextUrl.searchParams.toString();
  const targetUrl = `${process.env.API_URL!.replace(/\/$/, "")}/${path.join(
    "/"
  )}${search ? `?${search}` : ""}`;

  const headers: HeadersInit = {};
  const forwardHeaders = ["content-type", "accept", "authorization"];

  forwardHeaders.forEach((h) => {
    const val = req.headers.get(h);
    if (val) headers[h] = val;
  });

  headers["Origin"] = process.env.API_URL ?? "https://m-backend.dowinnsys.com";
  headers["Referer"] = process.env.API_URL ?? "https://m-backend.dowinnsys.com";

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.text()
      : undefined;

  let response;
  try {
    response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Proxy request failed", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

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
