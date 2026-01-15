export default async function handler(req, res) {
  const targetUrl = 'https://hyundai-two-phi.vercel.app';
  
  try {
    // 1. 데이터 요청 처리
    if (req.url.includes('/api/cars')) {
      const dataRes = await fetch(`${targetUrl}/api/cars`);
      const data = await dataRes.json();
      return res.status(200).json(data);
    }

    // 2. 메인 페이지 가져오기
    const response = await fetch(targetUrl);
    let html = await response.text();

    // 3. 글자 치환 (동북부 -> 충북)
    html = html.replace(/동북부/g, '충북');

    // 4. 경로 보정
    html = html.replace(/(href|src)="\//g, `$1="${targetUrl}/`);
    html = html.replace(/\/api\/cars/g, '/api/proxy?url=/api/cars');

    // 5. [추가] 모바일 새로고침 방지: 히스토리 조작이나 폼 자동 제출 방지
    // 선택 시 주소창이 변하거나 새로고침되는 것을 막기 위해 강제로 스크립트를 삽입합니다.
    const antiRefreshScript = `
      <script>
        // 드롭다운 변경 시 폼 제출 방지
        document.addEventListener('change', function(e) {
          if(e.target.tagName === 'SELECT') {
            e.preventDefault();
            e.stopPropagation();
          }
        }, true);
        // 히스토리 변경(pushState)으로 인한 새로고침 차단
        window.history.pushState = function() {};
      </script>
    `;
    html = html.replace('</body>', antiRefreshScript + '</body>');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (e) {
    res.status(500).send("연결 오류");
  }
}
