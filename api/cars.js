import { read, utils } from 'xlsx';

export default async function handler(req, res) {
  try {
    // ⚠️ 반드시 본인의 실제 Vercel Blob URL로 교체하세요!
    const fileUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/data-XXXX.xlsx"; 
    
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
