export default async function handler(req, res) {
  const targetUrl = `https://hyundai-two-phi.vercel.app${req.url}`;
  
  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("text/html")) {
      let html = await response.text();
      
      // 1. 글자 치환
      html = html.replace(/동북부/g, "충북");
      
      // 2. 필터 기능 복구 (경로 치환)
      html = html.replace(/(src|href)="\/([^/])/g, `$1="https://hyundai-two-phi.vercel.app/$2`);

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(html);
    }

    // HTML이 아닌 경우 그대로 전달
    const data = await response.arrayBuffer();
    res.setHeader("Content-Type", contentType);
    return res.send(Buffer.from(data));

  } catch (error) {
    res.status(500).send("Proxy Error");
  }
}
