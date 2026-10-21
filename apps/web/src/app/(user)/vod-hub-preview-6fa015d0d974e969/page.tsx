import { Metadata } from 'next';

// [임시] VOD허브 공개 목록 API(GET /api/public/vods) 연동 확인용 페이지.
// 링크를 걸지 않고 주소를 길게 둔 비공개 테스트 페이지다. 확인이 끝나면 이 폴더째 삭제한다.

const VOD_HUB_ORIGIN =
  process.env.VOD_HUB_ORIGIN ?? 'https://vod.letscareer.co.kr';

interface HubVod {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string;
}

export const metadata: Metadata = {
  title: 'VOD허브 연동 테스트',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

async function getHubVods(): Promise<HubVod[] | null> {
  try {
    const res = await fetch(`${VOD_HUB_ORIGIN}/api/public/vods`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Page() {
  const vods = await getHubVods();

  return (
    <main className="mx-auto w-full max-w-[1120px] px-5 py-10">
      <h1 className="text-medium24 mb-2 font-bold">VOD허브 연동 테스트</h1>
      <p className="text-xsmall14 text-neutral-40 mb-8">
        {VOD_HUB_ORIGIN}/api/public/vods
      </p>

      {vods === null && <p>VOD허브 목록을 불러오지 못했습니다.</p>}
      {vods?.length === 0 && <p>노출 중인 VOD가 없습니다.</p>}

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {vods?.map((vod) => (
          <li key={vod.id}>
            <a
              href={vod.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={vod.thumbnailUrl}
                alt={vod.title}
                loading="lazy"
                className="aspect-video w-full rounded-sm object-cover"
              />
              <p className="text-small18 mt-3 font-semibold">{vod.title}</p>
              {vod.description && (
                <p className="text-xsmall14 text-neutral-40 mt-1 line-clamp-2">
                  {vod.description}
                </p>
              )}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
