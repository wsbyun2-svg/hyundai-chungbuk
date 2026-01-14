import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: '/:path*',
};

export async function middleware(req: NextRequest) {
  const url = "https://hyundai-two-phi.vercel.app" + req.nextUrl.pathname + req.nextUrl.search;
  
  const res = await fetch(url);
  const contentType = res.headers.get("content-type");

  // HTML 페이지인 경우에만 텍스트 치환 진행
  if (contentType && contentType.includes("text/html")) {
    let html = await res.text();
    
    // "동북부"를 "충북"으로 치환
    html = html.replace(/동북부/g, "충북");

    return new NextResponse(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  }

  return res;
}
