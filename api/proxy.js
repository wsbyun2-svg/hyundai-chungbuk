export default async function handler(req, res) {
  try {
    const targetUrl = 'https://hyundai-two-phi.vercel.app/';
    
    // 1. 만약 데이터를 요청하는 경로(/api/cars)로 접속했다면?
    if (req.url.includes('/api/cars')) {
      const dataRes = await fetch(`${targetUrl}api/cars`);
      const data = await dataRes.json();
      return res.status(200).json(data);
    }

    // 2. 일반 화면(HTML) 요청인 경우
    const response = await fetch(targetUrl);
    let html = await response.text();

    // "동북부" -> "충북" 치환
    html = html.replace(/동북부/g, '충북');

    // 상대 경로(css, js)를 원본 주소로 고정
    html = html.replace(/(href|src)="\//g, `$1="${targetUrl}`);

    // 중요: 화면 안에서 데이터를 부를 때, 충북 사이트 내부의 프록시를 거치도록 수정
    // 원본 코드의 fetch('/api/cars') 부분을 강제로 가로챕니다.
    html = html.replace(/fetch\(['"]\/api\/cars['"]\)/g, "fetch('/api/proxy?url=/api/cars')");

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("데이터 연동 오류가 발생했습니다.");
  }
}
