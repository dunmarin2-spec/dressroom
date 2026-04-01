export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, category } = req.body;
  const REMOVE_BG_KEY = process.env.REMOVE_BG_KEY;

  try {
    // 1. 무료 AI로 옷 이미지 실시간 생성 (고화질 프롬프트 적용)
    const aiPrompt = encodeURIComponent(`high quality fashion, single ${prompt}, white background, isolated, flat lay`);
    const aiImageUrl = `https://image.pollinations.ai/prompt/${aiPrompt}?width=512&height=512&nologo=true`;

    // 만약 형님이 Vercel에 키를 안 넣었을 경우 엑박 대신 원본이라도 띄움
    if (!REMOVE_BG_KEY) {
      return res.status(200).json({ img: aiImageUrl });
    }

    // 2. Remove.bg API로 누끼 따기 (axios 대신 순정 fetch 사용 = 설치 불필요)
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: aiImageUrl,
        size: 'auto',
        type: 'product' // 옷 누끼에 최적화
      })
    });

    // 3. 🚨 생존 보험 🚨: 누끼 따는 데 실패하거나 시간이 초과되면 500 에러를 띄우는 대신, 
    // 방금 AI가 그린 '배경 있는 원본 옷'이라도 마네킹에 보여줍니다.
    if (!removeBgResponse.ok) {
      console.log("형님, 누끼 서버가 바쁘답니다. 원본으로 쏩니다!");
      return res.status(200).json({ img: aiImageUrl });
    }

    // 4. 누끼 성공 시: 투명 PNG로 변환해서 화면에 착! 입힘
    const arrayBuffer = await removeBgResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    
    return res.status(200).json({ img: `data:image/png;base64,${base64Image}` });

  } catch (error) {
    console.error("서버 뻗음:", error);
    return res.status(500).json({ error: '서버 에러 발생' });
  }
}
