import { NavLink, useParams } from 'react-router-dom';

type StatsEmbed = {
  key: string;
  label: string;
  title: string;
  src: string;
  // 상/하단을 이만큼(px) 잘라 임베드 서비스 로고·헤더를 가린다(PostHog 로고/"Powered by" 배지 등). 미지정 시 크롭 없음.
  cropTop?: number;
  cropBottom?: number;
};

// 어드민 통계 임베드 정의. 상단 탭으로 전환하고 아래 영역에 해당 대시보드를 iframe 으로 노출한다.
// 가격 등 민감 수치는 각 대시보드(PostHog/Redash) 쿼리 단에서 비율만 노출하도록 처리한다는 전제.
// 대시보드 추가 = 이 배열에 항목 하나 추가로 끝난다(탭·라우트·iframe 모두 여기서 파생).
const STATS_EMBEDS: StatsEmbed[] = [
  {
    key: 'traffic',
    label: '페이지 유입',
    title: '페이지 유입 PostHog 통계',
    src: 'https://us.posthog.com/embedded/TKeLMbouSxBV0FtpgaOtUgDEPdYKuw',
    cropTop: 44,
  },
  {
    key: 'revenue',
    label: '매출 지표',
    title: '매출 지표 Redash 통계',
    src: 'https://redash.lets-career.com/public/dashboards/u8oU7JgzCDPajmkEviP1zzzv6cgmA72pQn2bSJjZ?org_slug=default',
    cropTop: 44,
  },
  {
    key: 'seminar',
    label: '무료 세미나 분석',
    title: '무료 세미나 PostHog 통계',
    src: 'https://us.posthog.com/embedded/ixnKagD2dNirQSkSYg3gq66chyTfBg',
    cropTop: 44,
  },
];

const Stats = () => {
  const { tab } = useParams();
  const active = STATS_EMBEDS.find((embed) => embed.key === tab);

  return (
    <div className="flex h-screen flex-col">
      <nav className="flex gap-1 border-b border-neutral-200 px-6 pt-5">
        {STATS_EMBEDS.map((embed) => (
          <NavLink
            key={embed.key}
            to={`/stats/${embed.key}`}
            className={({ isActive }) =>
              `text-xsmall14 -mb-px border-b-2 px-4 py-2 transition-colors ${
                isActive
                  ? 'border-neutral-800 font-semibold text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`
            }
          >
            {embed.label}
          </NavLink>
        ))}
      </nav>

      <div className="min-h-0 flex-1 p-6">
        {active ? (
          <div className="h-full w-full overflow-hidden rounded">
            <iframe
              key={active.key}
              title={active.title}
              src={active.src}
              className="w-full border-0"
              style={{
                marginTop: -(active.cropTop ?? 0),
                height: `calc(100% + ${(active.cropTop ?? 0) + (active.cropBottom ?? 0)}px)`,
              }}
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        ) : (
          <div className="text-xsmall14 flex h-full w-full items-center justify-center text-neutral-400">
            상단에서 통계 항목을 선택하세요.
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
