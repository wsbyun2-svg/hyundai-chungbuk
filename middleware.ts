import { NextRequest, NextResponse } from "next/server";

export const config = {
  // 모든 경로에서 이 미들웨어가 실행되도록 설정합니다.
  matcher: '/:path*',
};

export async function middleware(req: NextRequest) {
  // 원본 사이트 주소와 현재 접속하려는 경로를 합칩니다.
  const targetUrl = "https://hyundai-two-phi.vercel.app" + req.nextUrl.pathname + req.nextUrl.search;
  
  try {
    const res = await fetch(targetUrl);
    const contentType = res.headers.get("content-type");

    // 불러온 내용이 HTML일 때만 글자를 바꿉니다.
    if (contentType && contentType.includes("text/html")) {
      let html = await res.text();
      
      // 모든 "동북부" 단어를 "충북"으로 치환합니다.
      html = html.replace(/동북부/g, "충북");

      // 수정된 HTML 내용을 담은 새 응답을 보냅니다.
      return new NextResponse(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    }

    // 이미지, CSS, JS 파일 등은 수정 없이 그대로 전달합니다.
    return res;
  } catch (error) {
    // 에러 발생 시 기본 응답을 반환합니다.
    return NextResponse.next();
  }
}
