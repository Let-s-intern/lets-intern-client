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
  /** 제출물(사전 질문·첨부) 수정 마감. 서버가 계산한 값이며 없으면 행을 숨긴다. */
  questionEditDeadline?: string | null;
  /** 지금 고칠 수 있는지. 서버 판정이다. 지났으면 문구를 바꾼다. */
  questionEditable?: boolean;
  /** 멘토가 보는 화면이면 제출물 행 라벨을 멘티 기준으로 바꾼다. */
  isMentorView?: boolean;
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

/**
 * 마감용 짧은 날짜 — "9월 8일 (화)".
 *
 * 일시 행은 연도까지 적지만, 마감은 뒤에 남은 시간이 붙어 한 줄이 길어진다.
 * 마감은 며칠 안이라 연도가 없어도 헷갈리지 않는다.
 */
function formatShortDay(date: string): string {
  return new Date(date).toLocaleDateString('ko-KR', {
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

/**
 * 마감까지 남은 시간을 "2일 5시간" 처럼 굵은 단위 둘로 줄인다.
 *
 * 입장 버튼(`EnterLiveButton`)이 분 단위까지 세는 것과 달리 여기는 며칠 단위가 흔하다.
 * 분까지 적으면 길어서 한 줄에 안 들어간다.
 */
function formatRemaining(deadline: string, now: number): string | null {
  const diffMs = new Date(deadline).getTime() - now;
  if (Number.isNaN(diffMs) || diffMs <= 0) return null;

  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return hours > 0 ? `${days}일 ${hours}시간` : `${days}일`;
  if (hours > 0)
    return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
  return `${minutes}분`;
}

/**
 * 값이 없으면(빈 문자열/undefined) 행 자체를 렌더하지 않는다 — 값이 온 항목만 표시.
 *
 * `wrap` 은 값이 한 줄에 안 들어가는 행에 쓴다. 기본은 `whitespace-nowrap` 인데,
 * 제출 기간처럼 "날짜 + 남은 시간"이 함께 붙는 값은 390px 화면에서 70px 넘친다.
 */
function Row({
  label,
  value,
  wrap = false,
}: {
  label: string;
  value?: string | null;
  wrap?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <span className="text-xsmall14 text-neutral-45 shrink-0">{label}</span>
      <span
        className={`text-xsmall14 text-neutral-0 text-right font-medium ${
          wrap ? 'break-keep' : 'whitespace-nowrap'
        }`}
      >
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
  questionEditDeadline,
  questionEditable,
  isMentorView = false,
}: Props) => {
  /*
    남은 시간은 렌더 시점 기준으로만 계산한다. 마감이 며칠 단위라 초 단위로 다시
    그릴 이유가 없고, 입장 버튼이 이미 타이머를 돌리고 있어 화면은 그때 함께 갱신된다.
  */
  const remaining = questionEditDeadline
    ? formatRemaining(questionEditDeadline, Date.now())
    : null;

  const submissionDeadlineText = !questionEditDeadline
    ? undefined
    : !questionEditable || !remaining
      ? '수정 기간 종료'
      : `${formatShortDay(questionEditDeadline)} ${formatTimeRange(questionEditDeadline)}까지 · ${remaining} 남음`;

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
            <Row
              /*
                멘토는 수정 주체가 아니다. "제출물 수정"이라고만 적으면 자기가 고치는
                것으로 읽히므로 누구의 기간인지 라벨에 드러낸다.
              */
              label={isMentorView ? '멘티 제출 기간' : '제출물 수정'}
              value={submissionDeadlineText}
              wrap
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
