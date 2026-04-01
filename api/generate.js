// Vercel 환경 변수에서 키를 가져오므로 코드가 안전합니다.
export default async function handler(req, res) {
  const { prompt, category } = req.body;

  // 1. 여기서 Gemini Imagen API를 호출하거나 생성 이미지를 가져오는 로직이 들어갑니다.
  // 2. Remove.bg API로 배경을 날린 뒤 이미지 URL을 응답합니다.
  
  // 지금은 형님이 바로 구조를 테스트할 수 있도록 '성공 메시지'와 샘플 이미지를 돌려주는 뼈대입니다.
  res.status(200).json({ 
    img: "이미지_생성_후_배경날린_PNG_URL" 
  });
}
