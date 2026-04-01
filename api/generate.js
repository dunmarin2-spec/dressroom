// axios 대신 기본 fetch를 쓰면 도구 설치 안 해도 돼서 에러 확률이 더 낮습니다!
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, category } = req.body;

  try {
    // 테스트용 샘플 이미지 (이게 화면에 떠야 성공!)
    const mockImageMap = {
      top: "https://i.imgur.com/G4YmX7I.png",
      bottom: "https://i.imgur.com/9YFjR8K.png",
      shoes: "https://i.imgur.com/mOaU9O4.png"
    };

    return res.status(200).json({ 
      img: mockImageMap[category] || mockImageMap.top 
    });

  } catch (error) {
    return res.status(500).json({ error: '서버 내부 오류' });
  }
}
