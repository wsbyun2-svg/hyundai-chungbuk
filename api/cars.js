import { read, utils } from 'xlsx';

export default async function handler(req, res) {
  try {
    const fileUrl = "https://dcylpnbnb1uwhuwp.public.blob.vercel-storage.com/%E2%96%A0%2026%EB%85%84%201%EC%9B%94%20%ED%8A%B9%EB%B3%84%EC%A1%B0%EA%B1%B4%20%EB%8C%80%EC%83%81%20%EB%A6%AC%EC%8A%A4%ED%8A%B8_%EA%B3%B5%EC%A7%80%EC%9A%A9.xlsx"; // 여기에 Vercel Blob에서 복사한 .xlsx 주소를 넣으세요.
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = read(new Uint8Array(arrayBuffer), { type: 'array' });
    
    const result = {};
    workbook.SheetNames.forEach(name => {
      // 5행(index 4)부터 제목으로 인식하여 데이터를 가져옵니다.
      const sheet = workbook.Sheets[name];
      result[name] = utils.sheet_to_json(sheet, { range: 4 });
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
