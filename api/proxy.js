export default async function handler(req, res) {
  const targetUrl = 'https://hyundai-two-phi.vercel.app';
  
  try {
    // 1. 데이터 요청 경로 가로채기
    if (req.url.includes('/api/cars')) {
      const dataRes = await fetch(`${targetUrl}/api/cars`);
      const data = await dataRes.json();
      return res.status(200).json(data);
    }

    // 2. 메인 페이지 가져오기
    const response = await fetch(targetUrl);
    let html = await response.text();

    // 3. [핵심] 글자 치환 (동북부 -> 충북)
    html = html.replace(/동북부/g, '충북');

    // 4. [중요] 데이터 호출 주소 강제 치환
    // 원본 코드 내의 '/api/cars' 주소를 우리 사이트의 프록시 주소인 '/api/proxy?url=/api/cars'로 바꿉니다.
    html = html.replace(/\/api\/cars/g, '/api/proxy?url=/api/cars');

    // 5. 상대 경로 보정 (CSS, JS, 이미지)
    html = html.replace(/(href|src)="\//g, `$1="${targetUrl}/`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("데이터 연동 실패");
  }
}
