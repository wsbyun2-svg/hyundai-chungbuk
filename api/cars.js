import { get } from '@vercel/blob';
import { read, utils } from 'xlsx';

export default async function handler(req, res) {
  try {
    // 1. 창고에서 엑셀 파일 가져오기
    const fileUrl = "https://본인의-blob-주소/data.xlsx"; // 아래 설명 참고
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
