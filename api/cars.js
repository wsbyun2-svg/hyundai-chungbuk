import { read, utils } from 'xlsx';

export default async function handler(req, res) {
  try {
    // ⚠️ 반드시 본인의 실제 Vercel Blob URL로 교체하세요!
    const fileUrl = "https://dcylpnbnb1uwhuwp.public.blob.vercel-storage.com/%E2%96%A0%2026%EB%85%84%201%EC%9B%94%20%ED%8A%B9%EB%B3%84%EC%A1%B0%EA%B1%B4%20%EB%8C%80%EC%83%81%20%EB%A6%AC%EC%8A%A4%ED%8A%B8_%EA%B3%B5%EC%A7%80%EC%9A%A9.xlsx"; 
    
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = read(new Uint8Array(arrayBuffer), { type: 'array' });
    
    const result = {};
    workbook.SheetNames.forEach(name => {
      const sheet = workbook.Sheets[name];
      // 5행부터 데이터 시작 (range: 4)
      const data = utils.sheet_to_json(sheet, { range: 4 });
      result[name] = data;
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "데이터 로드 실패" });
  }
}
