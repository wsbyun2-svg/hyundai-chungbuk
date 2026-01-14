import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = "https://hyundai-two-phi.vercel.app" + req.nextUrl.pathname;
  const res = await fetch(url);

  // HTML만 가로채기
  if (res.headers.get("content-type")?.includes("text/html")) {
    let html = await res.text();
    html = html.replace(/동북부/g, "충북");

    return new NextResponse(html, {
      headers: { "content-type": "text/html" },
    });
  }

  return res;
}
