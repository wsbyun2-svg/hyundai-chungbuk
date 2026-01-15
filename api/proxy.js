export default async function handler(req, res) {
  const targetUrl = 'https://hyundai-two-phi.vercel.app';
  
  try {
    // 1. 데이터 요청(/api/cars)이 들어오면 원본 서버에서 가져와서 전달
    if (req.url.includes('/api/cars')) {
      const dataRes = await fetch(`${targetUrl}/api/cars`);
      const data = await dataRes.json();
      return res.status(200).json(data);
    }

    // 2. 메인 페이지 가져오기
    const response = await fetch(targetUrl);
    let html = await response.text();

    // 3. [글자 치환] 모든 "동북부"를 "충북"으로 변경
    html = html.replace(/동북부/g, '충북');

    // 4. [경로 보정] 이미지, CSS, JS 파일들이 깨지지 않게 원본 주소 연결
    html = html.replace(/(href|src)="\//g, `$1="${targetUrl}/`);

    // 5. [데이터 주소 보정] 화면 내 자바스크립트가 데이터를 부를 때 우리 프록시를 통하게 강제 수정
    // 이 부분이 있어야 표에 데이터가 나타납니다.
    html = html.replace(/\/api\/cars/g, '/api/proxy?url=/api/cars');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (e) {
    res.status(500).send("연결 중 오류가 발생했습니다.");
  }
}
