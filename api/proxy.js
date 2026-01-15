export default async function handler(req, res) {
  try {
    // 동북부 원본 사이트 주소
    const targetUrl = 'https://hyundai-two-phi.vercel.app/';
    const response = await fetch(targetUrl);
    let html = await response.text();

    // 모든 "동북부" 글자를 "충북"으로 치환
    html = html.replace(/동북부/g, '충북');

    // 상대 경로(css, js 등)가 깨지지 않게 원본 주소를 붙여줌
    html = html.replace(/(href|src)="\//g, `$1="${targetUrl}`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("데이터를 불러오는 중 오류가 발생했습니다.");
  }
}
