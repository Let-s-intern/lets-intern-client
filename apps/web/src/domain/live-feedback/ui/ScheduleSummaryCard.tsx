import type { LiveRole } from '../hooks/liveRole';

interface Props {
  /** 프로그램명 */
  programTitle?: string;
  /** 미션 회차 라벨 (예: "2회차") */
  missionLabel?: string;
  /** 상대방 호칭 ("멘토" | "멘티"). */
  counterpartLabel: string;
  /** 상대방 이름 */
  counterpartName?: string;
  startDate?: string;
  endDate?: string;
  role: LiveRole;
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
  };
  const startTime = new Date(startDate).toLocaleTimeString('ko-KR', fmt);
  if (!endDate) return startTime;
  const endTime = new Date(endDate).toLocaleTimeString('ko-KR', fmt);
  return `${startTime} ~ ${endTime}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <span className="text-xsmall14 text-neutral-45 shrink-0">{label}</span>
      <span className="text-xsmall14 text-neutral-0 text-right font-medium">
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

const ScheduleSummaryCard = ({
  programTitle,
  missionLabel,
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
      <div className="flex flex-col items-center gap-2 bg-gradient-to-br from-[#4D55F5] to-[#6B6FFF] px-6 py-7 text-center text-white">
        <img
          src="/logo/horizontal-logo.svg"
          alt="렛츠커리어"
          className="h-5 w-auto brightness-0 invert"
        />
        <p className="text-xsmall14 text-white/80">
          예약하신 라이브 피드백이에요
        </p>
        <h1 className="text-small20 font-bold">곧 피드백이 시작돼요</h1>
      </div>

      {/* 세션 정보 */}
      <div className="px-6 py-2">
        {isLoading ? (
          <div className="flex flex-col">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : (
          <div className="divide-neutral-90 flex flex-col divide-y">
            <Row label="프로그램" value={programTitle ?? '-'} />
            <Row label="미션" value={missionLabel ?? '-'} />
            <Row label={counterpartLabel} value={counterpartName ?? '-'} />
            <Row
              label="일시"
              value={`${formatDay(startDate)} ${formatTimeRange(startDate, endDate)}`}
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

export default ScheduleSummaryCard;
