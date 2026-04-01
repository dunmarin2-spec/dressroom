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
    // 💡 마법 1: 매번 새로운 그림을 강제로 그리게 만드는 랜덤 번호
    const randomSeed = Math.floor(Math.random() * 1000000);

    // 💡 마법 2: 카테고리에 따라 AI에게 명확한 '영어 키워드'를 쥐여줍니다.
    let catKeyword = "";
    if(category === "top") catKeyword = "shirt, jacket, top garment";
    if(category === "bottom") catKeyword = "pants, skirt, trousers, bottom garment";
    if(category === "shoes") catKeyword = "pair of shoes, sneakers";

    // 💡 마법 3: "사람 몸 절대 그리지 마! 옷만 그려!" (no human body, flat lay)
    const aiPrompt = encodeURIComponent(`high quality product photography, flat lay, single ${catKeyword} matching this description: ${prompt}, isolated on pure white background, no human body, no mannequin, clear edges`);
    
    // URL 끝에 &seed=랜덤번호 를 붙여서 무조건 새로 그리게 만듭니다.
    const aiImageUrl = `https://image.pollinations.ai/prompt/${aiPrompt}?width=512&height=512&nologo=true&seed=${randomSeed}`;

    // Remove.bg 로 누끼 따기 시작
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: aiImageUrl,
        size: 'auto',
        type: 'product' // 무조건 '상품' 모드로 강제
      })
    });

    if (!removeBgResponse.ok) {
      // 누끼 서버가 파업해도 방금 그린 원본은 무조건 살려서 보냅니다!
      return res.status(200).json({ img: aiImageUrl });
    }

    const arrayBuffer = await removeBgResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    
    return res.status(200).json({ img: `data:image/png;base64,${base64Image}` });

  } catch (error) {
    console.error("서버 뻗음:", error);
    return res.status(500).json({ error: '서버 에러 발생' });
  }
}
