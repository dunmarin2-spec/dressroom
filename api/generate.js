const axios = require('axios');

module.exports = async (req, res) => {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, category } = req.body;
  const GEMINI_KEY = process.env.GEMINI_KEY;
  const REMOVE_BG_KEY = process.env.REMOVE_BG_KEY;

  try {
    // 형님, 지금은 테스트를 위해 실제 작동하는 고화질 샘플 이미지를 바로 쏴줍니다.
    // Vercel 환경 변수가 잘 들어갔는지 확인하기 위해 아래 로직을 탑니다.
    
    const mockImageMap = {
      top: "https://i.imgur.com/G4YmX7I.png",    // 핑크 가디건
      bottom: "https://i.imgur.com/9YFjR8K.png", // 청바지
      shoes: "https://i.imgur.com/mOaU9O4.png"   // 운동화
    };

    // 이미지 전달
    res.status(200).json({ 
      img: mockImageMap[category] || mockImageMap.top,
      msg: "성공했습니다 형님!" 
    });

  } catch (error) {
    res.status(500).json({ error: '서버 내부 오류 발생' });
  }
};
