import { NextRequest, NextResponse } from "next/server";

// 이 설정이 있어야 모든 페이지에 대해 middleware가 실행됩니다.
export const config = {
  matcher: '/:path*',
};

export async function middleware(req: NextRequest) {
  // 원본 주소 설정 (뒤에 쿼리 스트링까지 포함)
  const url = new URL(req.nextUrl.pathname + req.nextUrl.search, "https://hyundai-two-phi.vercel.app");
  
  try {
    const res = await fetch(url.toString());
    const contentType = res.headers.get("content-type");

    // HTML 응답일 때만 텍스트를 수정함
    if (contentType && contentType.includes("text/html")) {
      let html = await res.text();
      
      // 글자 치환 (모든 '동북부'를 '충북'으로)
      html = html.replace(/동북부/g, "충북");

      // 수정된 HTML로 새로운 응답 생성
      return new NextResponse(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    }

    return res;
  } catch (e) {
    // 에러 발생 시 원본 응답 반환
    return NextResponse.next();
  }
}
