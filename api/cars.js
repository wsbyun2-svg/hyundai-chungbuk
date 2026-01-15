import { read, utils } from 'xlsx';

export default async function handler(req, res) {
  try {
    // 여기에 Vercel에서 복사한 data.xlsx의 실제 주소를 넣으세요
    const fileUrl = "https://dcylpnbnb1uwhuwp.public.blob.vercel-storage.com/%E2%96%A0%2026%EB%85%84%201%EC%9B%94%20%ED%8A%B9%EB%B3%84%EC%A1%B0%EA%B1%B4%20%EB%8C%80%EC%83%81%20%EB%A6%AC%EC%8A%A4%ED%8A%B8_%EA%B3%B5%EC%A7%80%EC%9A%A9.xlsx"; 
    
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();

    // 엑셀 읽기
    const workbook = read(new Uint8Array(arrayBuffer), { type: 'array' });
    const allData = {};

    workbook.SheetNames.forEach(sheetName => {
      // 업로드하신 엑셀 양식에 맞춰 5번째 줄(Header)부터 읽습니다.
      const sheet = workbook.Sheets[sheetName];
      allData[sheetName] = utils.sheet_to_json(sheet, { range: 4 });
    });

    res.status(200).json(allData);
  } catch (error) {
    res.status(500).json({ error: "데이터를 불러오는 데 실패했습니다: " + error.message });
  }
}
