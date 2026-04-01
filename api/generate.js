const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, category } = req.body;
  
  // 형님의 진짜 누끼 API 키
  const REMOVE_BG_KEY = process.env.REMOVE_BG_KEY; 

  if (!REMOVE_BG_KEY) {
    return res.status(500).json({ error: 'Remove.bg API 키가 Vercel에 없습니다!' });
  }

  try {
    // 1. 진짜 AI 이미지 생성 (형님이 입력한 텍스트 기반)
    // AI가 옷을 잘 그리도록 프롬프트를 영어로 살짝 포장해줍니다.
    const aiPrompt = encodeURIComponent(`high quality fashion photography, single ${prompt}, isolated on white background, clothing flat lay`);
    
    // 무료 & 무제한 AI 이미지 생성 API 호출
    const aiImageUrl = `https://image.pollinations.ai/prompt/${aiPrompt}?width=512&height=512&nologo=true`;

    // 2. 형님의 Remove.bg 키를 써서 배경을 진짜로 날려버림
    const removeBgResponse = await axios.post('https://api.remove.bg/v1.0/removebg', {
      image_url: aiImageUrl,
      size: 'auto',
      type: 'product' // 상품(옷)에 최적화된 누끼 모드
    }, {
      headers: { 'X-Api-Key': REMOVE_BG_KEY },
      responseType: 'arraybuffer'
    });

    // 3. 투명해진 PNG 이미지를 프론트엔드(화면)로 쏴줌
    const base64Image = Buffer.from(removeBgResponse.data, 'binary').toString('base64');
    const finalTransparentUrl = `data:image/png;base64,${base64Image}`;

    res.status(200).json({ img: finalTransparentUrl });

  } catch (error) {
    console.error("AI 생성 에러:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'AI가 이미지를 만들거나 배경을 지우는 데 실패했습니다.' });
  }
};
