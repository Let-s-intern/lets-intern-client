import type { LiveRole } from '../hooks/resolveMyRole';

interface Props {
  /** 프로그램명 — §0.2 BE 미정, placeholder. */
  programTitle?: string;
  /** 미션 회차 라벨 (예: "3회차") — §0.2 BE 미정, placeholder. */
  missionLabel?: string;
  /** 상대방 호칭 ("멘토" | "멘티"). */
  counterpartLabel: string;
  /** 상대방 이름 — §0.2 BE 미정, placeholder. */
  counterpartName?: string;
  startDate?: string;
  endDate?: string;
  role: LiveRole;
  isLoading?: boolean;
}

function formatSchedule(startDate?: string, endDate?: string): string {
  if (!startDate) return '-';
  const start = new Date(startDate);
  const datePart = start.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
  const timeFmt: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  const startTime = start.toLocaleTimeString('ko-KR', timeFmt);
  if (!endDate) return `${datePart} ${startTime}`;
  const endTime = new Date(endDate).toLocaleTimeString('ko-KR', timeFmt);
  return `${datePart} ${startTime} ~ ${endTime}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xsmall14 text-neutral-40 w-16 shrink-0">
        {label}
      </span>
      <span className="text-xsmall14 text-neutral-20">{value}</span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-neutral-90 h-4 w-16 shrink-0 animate-pulse rounded" />
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
    <section className="border-neutral-80 flex flex-col gap-4 rounded-2xl border p-5">
      <h1 className="text-small18 text-neutral-0 font-semibold">
        라이브 피드백 입장
      </h1>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Row label="프로그램" value={programTitle ?? '-'} />
          <Row label="미션" value={missionLabel ?? '-'} />
          <Row label={counterpartLabel} value={counterpartName ?? '-'} />
          <Row label="일시" value={formatSchedule(startDate, endDate)} />
        </div>
      )}

      {role === null && !isLoading && (
        <p className="text-xsmall12 text-neutral-40">
          역할 정보를 확인하는 중입니다. 입장에 문제가 있으면 알림톡 링크를 다시
          확인해 주세요.
        </p>
      )}
    </section>
  );
};

export default ScheduleSummaryCard;
