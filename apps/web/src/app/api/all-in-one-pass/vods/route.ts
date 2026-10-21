/** seminar-vod 공개 API 프록시 — 교차출처 CORS 우회(서버 경유). */
const VOD_API = 'https://seminar-vod.letscareer.co.kr/api/public/vods';

export async function GET() {
  try {
    const res = await fetch(VOD_API, { next: { revalidate: 600 } });
    if (!res.ok) {
      return Response.json(
        { message: 'VOD 목록을 불러오지 못했습니다.' },
        { status: 502 },
      );
    }
    return Response.json(await res.json());
  } catch {
    return Response.json(
      { message: 'VOD 목록을 불러오지 못했습니다.' },
      { status: 502 },
    );
  }
}
