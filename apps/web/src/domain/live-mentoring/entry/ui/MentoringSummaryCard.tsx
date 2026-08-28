import type { LiveMentoringRoleParam } from '../hooks/liveMentoringRole';

interface Props {
  /** 상품명(예: "자소서 실전 첨삭 멘토링"). */
  productName?: string;
  /** 진행시간(분). */
  durationMinutes?: number;
  /** 상대방 호칭 ("멘토" | "멘티"). */
  counterpartLabel: string;
  /** 상대방 이름 */
  counterpartName?: string;
  startDate?: string;
  endDate?: string;
  role: LiveMentoringRoleParam;
  isLoading?: boolean;
}

function formatDay(startDate?: string): string {
  if (!startDate) return '-';
  return new Date(startDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

function formatTimeRange(startDate?: string, endDate?: string): string {
  if (!startDate) return '';
  const fmt: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  const startTime = new Date(startDate).toLocaleTimeString('ko-KR', fmt);
  if (!endDate) return startTime;
  const endTime = new Date(endDate).toLocaleTimeString('ko-KR', fmt);
  return `${startTime} ~ ${endTime}`;
}

/** 값이 없으면(빈 문자열/undefined) 행 자체를 렌더하지 않는다 — 값이 온 항목만 표시. */
function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <span className="text-xsmall14 text-neutral-45 shrink-0">{label}</span>
      <span className="text-xsmall14 text-neutral-0 whitespace-nowrap text-right font-medium">
        {value}
      </span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="bg-neutral-90 h-4 w-14 shrink-0 animate-pulse rounded" />
      <div className="bg-neutral-90 h-4 w-40 animate-pulse rounded" />
    </div>
  );
}

/**
 * 1대1 세션 입장 화면의 일정 요약 카드.
 *
 * 라이브 피드백의 `ScheduleSummaryCard` 와 같은 모양(브랜드 그라데이션 헤더 +
 * 라벨-값 2열)을 쓴다. 필드는 다르다 — 라이브 피드백은 프로그램·회차가 있고
 * 1대1은 없다. 대신 상품명·진행시간이 있다.
 */
const MentoringSummaryCard = ({
  productName,
  durationMinutes,
  counterpartLabel,
  counterpartName,
  startDate,
  endDate,
  role,
  isLoading,
}: Props) => {
  return (
    <section className="border-neutral-80 rounded-xxl overflow-hidden border bg-white shadow-sm">
      {/* 헤더 — 브랜드 그라데이션 + 로고 */}
      <div className="flex flex-col items-center bg-gradient-to-br from-[#4D55F5] to-[#6B6FFF] px-6 pb-10 pt-8 text-center text-white">
        <img
          src="/logo/horizontal-logo.svg"
          alt="렛츠커리어"
          className="h-5 w-auto brightness-0 invert"
        />
        <div className="mt-5 flex flex-col gap-2">
          <p className="text-xsmall14 text-white/80">
            예약하신 1대1 라이브 멘토링이에요
          </p>
          <h1 className="text-small20 font-bold">곧 멘토링이 시작돼요</h1>
        </div>
      </div>

      {/* 세션 정보 */}
      <div className="px-6 py-2">
        {isLoading ? (
          <div className="flex flex-col">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : (
          <div className="divide-neutral-90 flex flex-col divide-y">
            <Row label="상품" value={productName} />
            <Row
              label="진행시간"
              value={durationMinutes ? `${durationMinutes}분` : undefined}
            />
            <Row label={counterpartLabel} value={counterpartName} />
            <Row
              label="일시"
              value={
                startDate
                  ? `${formatDay(startDate)} ${formatTimeRange(startDate, endDate)}`
                  : undefined
              }
            />
          </div>
        )}
      </div>

      {role === null && !isLoading && (
        <p className="text-xsmall12 text-neutral-40 px-6 pb-5">
          역할 정보를 확인하는 중입니다. 입장에 문제가 있으면 알림톡 링크를 다시
          확인해 주세요.
        </p>
      )}
    </section>
  );
};

export default MentoringSummaryCard;
