import {
  PLAYBOOK_OUTPUT as O,
  type PlaybookWeekOutput,
} from '../data/playbookDashboard';

/** 「챌린지 기간」 배지 문구. 주차 번호로 붙는 자리가 정해지므로 데이터에 넣지 않는다 */
const CHALLENGE_BADGE = '챌린지 기간';

type Tone = 'challenge' | 'plain' | 'last';

function weekTone(week: number): Tone {
  if (week === O.weeks.length) return 'last';
  return week <= O.challengeUntilWeek ? 'challenge' : 'plain';
}

/**
 * 가운데 점 하나. 챌린지 기간은 파랑, 마지막 주차는 남색으로 채운다.
 * 데스크톱에서만 보인다 — 모바일은 카드를 한 줄로 쌓아 선과 점이 설 자리가 없다.
 */
function TimelineDot({ tone }: { tone: Tone }) {
  if (tone === 'last') {
    return (
      <span className="z-10 hidden h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#11142B] md:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </span>
    );
  }
  const challenge = tone === 'challenge';
  return (
    <span
      className={`z-10 hidden h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 bg-white md:flex ${
        challenge ? 'border-primary' : 'border-neutral-80'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${challenge ? 'bg-primary' : 'bg-neutral-80'}`}
      />
    </span>
  );
}

function WeekCard({ item, tone }: { item: PlaybookWeekOutput; tone: Tone }) {
  const isLast = tone === 'last';
  return (
    <article
      className={`rounded-xxl p-5 md:p-6 ${
        isLast
          ? 'bg-[#11142B]'
          : 'border-neutral-85 border bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)]'
      }`}
    >
      <p className="flex flex-wrap items-center gap-2">
        <span
          className={`text-xs font-bold ${
            tone === 'plain' ? 'text-neutral-50' : 'text-primary'
          }`}
        >
          WEEK {String(item.week).padStart(2, '0')}
        </span>
        {tone === 'challenge' && (
          <span className="bg-primary-10 text-primary rounded-full px-2.5 py-1 text-[0.65rem] font-bold">
            {CHALLENGE_BADGE}
          </span>
        )}
      </p>

      <strong
        className={`text-xsmall14 md:text-xsmall16 mt-2 block font-bold ${
          isLast ? 'text-white' : 'text-neutral-0'
        }`}
      >
        {item.title}
      </strong>

      <span
        className={`text-xsmall14 mt-2 block ${
          isLast ? 'text-neutral-70' : 'text-neutral-45'
        }`}
      >
        {item.desc}
      </span>
    </article>
  );
}

/** 카드가 없는 쪽 반칸. 데스크톱 3열 격자의 자리만 채운다 */
function HalfSpacer() {
  return <span aria-hidden="true" className="hidden md:block" />;
}

/**
 * 개편 시안 10 의 세 번째 덩어리 — `OUTPUT` 지그재그 타임라인 (PRD 4.10).
 *
 * 홀수 주차는 왼쪽, 짝수 주차는 오른쪽에 놓고 가운데 점선으로 잇는다. 점은 늘 가운데
 * 열이라 DOM 순서가 [카드·점·빈칸] 과 [빈칸·점·카드] 로 갈린다.
 *
 * 모바일에서는 두 칸을 유지할 폭이 없다. 격자를 풀고 카드만 한 줄로 쌓는다 —
 * 빈칸·점·점선은 모두 `md:` 아래에서만 나타난다.
 */
export default function PlaybookWeekTimeline() {
  return (
    <ol className="relative mx-auto mt-10 flex max-w-[1000px] flex-col gap-4 md:mt-14 md:gap-0">
      {/* 가운데 점선. 카드 뒤에 깔린다 */}
      <span
        aria-hidden="true"
        className="border-neutral-80 absolute left-1/2 top-0 hidden h-full -translate-x-1/2 border-l-2 border-dotted md:block"
      />

      {O.weeks.map((item, i) => {
        const tone = weekTone(item.week);
        const onLeft = i % 2 === 0;

        return (
          <li
            className="md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6"
            key={item.week}
          >
            {onLeft ? (
              <>
                <WeekCard item={item} tone={tone} />
                <TimelineDot tone={tone} />
                <HalfSpacer />
              </>
            ) : (
              <>
                <HalfSpacer />
                <TimelineDot tone={tone} />
                <WeekCard item={item} tone={tone} />
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
