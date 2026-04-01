import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, category } = req.body;
  
  // Vercel Settings에서 설정한 환경변수 가져오기
  const GEMINI_KEY = process.env.GEMINI_KEY;
  const REMOVE_BG_KEY = process.env.REMOVE_BG_KEY;

  try {
    // 1. Gemini Imagen 3 호출 (현재 텍스트 모델 API 키로 이미지를 직접 생성하는 구조)
    // ※ 참고: Gemini API 키로 직접 이미지 생성이 안 될 경우를 대비해 
    // 실제 실무에서는 Google Cloud Vertex AI 등을 쓰지만, 
    // 여기서는 형님이 바로 확인 가능하도록 '이미지 생성 API' 흐름을 구현합니다.
    
    // 임시로 옷의 질감을 살린 실제 옷 사진 이미지를 생성하는 프롬프트를 구성합니다.
    const fullPrompt = `High-quality, realistic ${prompt} for a mannequin, studio lighting, white background, isolated.`;

    // 2. 배경 제거 (Remove.bg) 호출
    // 형님이 입력한 옷과 유사한 '실제 이미지'를 가져와서 배경을 날리는 과정입니다.
    // (현재는 테스트를 위해 옷의 키워드에 맞는 실제 PNG 소스를 매칭하거나 생성 API를 연결합니다.)
    
    // ※ 형님, 지금 당장 작동 확인을 위해 '실제 옷 소스'를 리턴하게 세팅해뒀습니다.
    // 추후 Gemini Imagen API 정식 연동 시 이 부분을 교체하면 됩니다.
    const mockImageMap = {
      top: "https://i.imgur.com/G4YmX7I.png",    // 핑크 가디건 소스
      bottom: "https://i.imgur.com/9YFjR8K.png", // 청바지 소스
      shoes: "https://i.imgur.com/mOaU9O4.png"   // 운동화 소스
    };

    // 실제로는 아래와 같이 Remove.bg API를 거쳐서 나가야 합니다.
    /*
    const response = await axios.post('https://api.remove.bg/v1.0/removebg', {
      image_url: "생성된_이미지_URL",
      size: 'auto'
    }, {
      headers: { 'X-Api-Key': REMOVE_BG_KEY },
      responseType: 'arraybuffer'
    });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return res.status(200).json({ img: `data:image/png;base64,${base64}` });
    */

    // 지금은 우선 작동 확인용 데이터 전송!
    res.status(200).json({ img: mockImageMap[category] || mockImageMap.top });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI가 옷을 짓다가 실패했습니다 형님!' });
  }
}
