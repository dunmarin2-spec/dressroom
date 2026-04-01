export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, category } = req.body;
  const REMOVE_BG_KEY = process.env.REMOVE_BG_KEY;

  if (!REMOVE_BG_KEY) {
    return res.status(500).json({ error: 'Vercel 환경 변수에 키가 없습니다.' });
  }

  try {
    // 💡 마법 1: 캐시 방지 (매번 새로운 디자인)
    const randomSeed = Math.floor(Math.random() * 1000000);

    // 💡 마법 2: 카테고리별 영문 키워드 강제 주입
    let catKeyword = "";
    if(category === "top") catKeyword = "shirt, jacket, top garment";
    if(category === "bottom") catKeyword = "pants, skirt, trousers, bottom garment";
    if(category === "shoes") catKeyword = "pair of shoes, sneakers";

    // 💡 마법 3: 고스트 마네킹 프롬프트 (가장 중요!)
    // ghost mannequin photography (투명 마네킹 핏), invisible body (몸체 투명), 3d volume (입체감)
    const aiPrompt = encodeURIComponent(`high quality ghost mannequin photography of ${prompt}, ${catKeyword}, invisible body, 3d volume, hollow neck, isolated on pure white background, no human body, clear edges`);
    
    const aiImageUrl = `https://image.pollinations.ai/prompt/${aiPrompt}?width=512&height=512&nologo=true&seed=${randomSeed}`;

    // 누끼 따기 (Vercel 10초 타임아웃 방어 로직 포함)
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: aiImageUrl,
        size: 'auto',
        type: 'product'
      })
    });

    // 🚨 생존 보험: 누끼 서버가 10초 넘겨서 뻗으면 원본(하얀 배경)이라도 띄움
    if (!removeBgResponse.ok) {
      return res.status(200).json({ img: aiImageUrl, fallback: true });
    }

    const arrayBuffer = await removeBgResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    
    return res.status(200).json({ img: `data:image/png;base64,${base64Image}` });

  } catch (error) {
    console.error("서버 에러:", error);
    return res.status(500).json({ error: '서버 타임아웃 또는 내부 에러' });
  }
}
