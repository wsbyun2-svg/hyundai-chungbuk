import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 경로에서 실행:
     * api, _next/static, _next/image, favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  // 목적지 주소를 원본 사이트로 고정합니다.
  const targetUrl = `https://hyundai-two-phi.vercel.app${url.pathname}${url.search}`;

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get("content-type") || "";

    // HTML 응답인 경우에만 글자를 바꿉니다.
    if (contentType.includes("text/html")) {
      let html = await response.text();
      
      // 1. "동북부"를 "충북"으로 치환
      // 2. 상대 경로로 되어 있는 링크들을 원본 주소 절대 경로로 강제 변경 (필터 작동 핵심)
      html = html.replace(/동북부/g, "충북");
      html = html.replace(/(src|href)="\/([^/])/g, `$1="https://hyundai-two-phi.vercel.app/$2`);

      return new NextResponse(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    // HTML이 아닌 자원(이미지, JS, CSS 등)은 원본 서버에서 그대로 가져옵니다.
    return response;
  } catch (e) {
    return NextResponse.next();
  }
}
