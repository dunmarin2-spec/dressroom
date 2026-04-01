export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, category } = req.body;

  try {
    // 엑박 안 뜨는 고화질 샘플 소스로 교체 (무료 이미지 사이트 소스)
    const mockImageMap = {
      top: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60", // 자켓
      bottom: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60", // 청바지
      shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60" // 빨간 운동화
    };

    return res.status(200).json({ 
      img: mockImageMap[category] || mockImageMap.top 
    });

  } catch (error) {
    return res.status(500).json({ error: '서버 내부 오류' });
  }
}
