import { read, utils } from 'xlsx';

export default async function handler(req, res) {
  try {
    // ⚠️ 이 주소를 본인의 Vercel Blob 주소로 정확히 교체하세요.
    const fileUrl = "https://dcylpnbnb1uwhuwp.public.blob.vercel-storage.com/%E2%96%A0%2026%EB%85%84%201%EC%9B%94%20%ED%8A%B9%EB%B3%84%EC%A1%B0%EA%B1%B4%20%EB%8C%80%EC%83%81%20%EB%A6%AC%EC%8A%A4%ED%8A%B8_%EA%B3%B5%EC%A7%80%EC%9A%A9.xlsx"; 
    
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('파일을 불러올 수 없습니다.');
    
    const arrayBuffer = await response.arrayBuffer();
    const workbook = read(new Uint8Array(arrayBuffer), { type: 'array' });
    
    const result = {};
    workbook.SheetNames.forEach(name => {
      const sheet = workbook.Sheets[name];
      // 질문자님 엑셀은 5행(index 4)부터 제목입니다.
      const data = utils.sheet_to_json(sheet, { range: 4 }); 
      result[name] = data;
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
