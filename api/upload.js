import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('POST 요청만 가능합니다.');

  try {
    // data.xlsx라는 이름으로 창고에 저장 (이미 있으면 덮어씀)
    const blob = await put('data.xlsx', req, {
      access: 'public',
      addRandomSuffix: false,
    });

    return res.status(200).json({ message: "성공적으로 업데이트되었습니다!", url: blob.url });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
