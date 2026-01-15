export default async function handler(req, res) {
  const targetUrl = 'https://hyundai-two-phi.vercel.app';
  
  try {
    // 1. 데이터 호출 경로 처리
    if (req.url.includes('/api/cars')) {
      const dataRes = await fetch(`${targetUrl}/api/cars`);
      const data = await dataRes.json();
      return res.status(200).json(data);
    }

    // 2. 메인 페이지 가져오기
    const response = await fetch(targetUrl);
    let html = await response.text();

    // 3. 동북부 -> 충북 글자 치환
    html = html.replace(/동북부/g, '충북');

    // 4. 경로 보정
    html = html.replace(/(href|src)="\//g, `$1="${targetUrl}/`);
    html = html.replace(/\/api\/cars/g, '/api/proxy?url=/api/cars');

    // 5. [모바일 새로고침 방지] 드롭박스 선택 시 튕기는 현상 막기
    const fixScript = `
      <script>
        // 모바일에서 선택 시 주소창 변경으로 인한 새로고침 강제 차단
        window.history.pushState = function() {};
        window.history.replaceState = function() {};
        
        // 드롭다운 선택 시 이벤트 전파 막기
        document.addEventListener('change', function(e) {
          if(e.target.tagName === 'SELECT') {
            e.stopPropagation();
          }
        }, true);
      </script>
    `;
    html = html.replace('</body>', fixScript + '</body>');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (e) {
    res.status(500).send("연결 오류");
  }
}
