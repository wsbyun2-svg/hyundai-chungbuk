import { get } from '@vercel/blob';
import { read, utils } from 'xlsx';

export default async function handler(req, res) {
  try {
    // 1. 창고에서 엑셀 파일 가져오기
    const fileUrl = "https://https://dcylpnbnb1uwhuwp.public.blob.vercel-storage.com/%E2%96%A0%2026%EB%85%84%201%EC%9B%94%20%ED%8A%B9%EB%B3%84%EC%A1%B0%EA%B1%B4%20%EB%8C%80%EC%83%81%20%EB%A6%AC%EC%8A%A4%ED%8A%B8_%EA%B3%B5%EC%A7%80%EC%9A%A9.xlsx/data.xlsx"; // 아래 설명 참고
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();

    // 2. 엑셀 읽기
    const workbook = read(new Uint8Array(arrayBuffer), { type: 'array' });
    const allData = {};

    // 3. 모든 시트(G80, 싼타페 등)를 데이터로 변환
    workbook.SheetNames.forEach(sheetName => {
      // 5번째 줄(Header)부터 실제 데이터가 시작됨 (range: 4)
      allData[sheetName] = utils.sheet_to_json(workbook.Sheets[sheetName], { range: 4 });
    });

    res.status(200).json(allData);
  } catch (error) {
    res.status(500).json({ error: "데이터 로딩 실패" });
  }
}
