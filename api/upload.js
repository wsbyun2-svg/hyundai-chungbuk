import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('POST만 가능합니다.');

  try {
    // 엑셀 파일을 Vercel Blob 창고에 'data.xlsx'라는 이름으로 저장합니다.
    const blob = await put('data.xlsx', req, {
      access: 'public',
      addRandomSuffix: false, // 파일명을 고정해야 홈페이지가 찾기 쉽습니다.
    });

    return res.status(200).json({ message: "업로드 성공", url: blob.url });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
