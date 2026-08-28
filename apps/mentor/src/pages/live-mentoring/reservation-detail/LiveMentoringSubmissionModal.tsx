import { useEffect, useState } from 'react';

import { useLiveMentoringReservationDetailQuery } from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringReservationDetail } from '@/api/live-mentoring/liveMentoringSchema';
import BaseModal from '@/common/modal/BaseModal';
import { twMerge } from '@/lib/twMerge';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';
import MenteeLinkPanel from '@/pages/feedback/ui/MenteeLinkPanel';
import { isNotionUrl } from '@/pages/feedback/utils/notion';

import { CATEGORY_LABELS, durationLabel } from '../constants';

interface LiveMentoringSubmissionModalProps {
  /** 열려는 예약의 신청 id. `null` 이면 모달이 닫힌 상태이며 조회도 하지 않는다. */
  applicationId: number | null;
  onClose: () => void;
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const pad2 = (value: number): string => String(value).padStart(2, '0');

/** 예약 일시 한 줄 표기 (예: `2026.08.30 (일) 10:00 ~ 11:00`). */
function formatReservationPeriod(startAt: string, endAt: string): string {
  const start = new Date(startAt);
  if (Number.isNaN(start.getTime())) return '';

  const end = new Date(endAt);
  const date = `${start.getFullYear()}.${pad2(start.getMonth() + 1)}.${pad2(
    start.getDate(),
  )}`;
  const time = (value: Date) =>
    `${pad2(value.getHours())}:${pad2(value.getMinutes())}`;
  const range = Number.isNaN(end.getTime())
    ? time(start)
    : `${time(start)} ~ ${time(end)}`;

  return `${date} (${WEEKDAY_LABELS[start.getDay()]}) ${range}`;
}

/** 질문 최종 수정 시각 표기 (예: `2026.08.29 18:20`). */
function formatUpdatedAt(value: string): string {
  const updatedAt = new Date(value);
  if (Number.isNaN(updatedAt.getTime())) return '';

  return (
    `${updatedAt.getFullYear()}.${pad2(updatedAt.getMonth() + 1)}.` +
    `${pad2(updatedAt.getDate())} ${pad2(updatedAt.getHours())}:${pad2(
      updatedAt.getMinutes(),
    )}`
  );
}

/** 질문을 실제로 냈는지. 나중에 작성하기를 골랐거나 본문이 비면 낸 것이 아니다. */
const hasQuestion = (detail: LiveMentoringReservationDetail): boolean =>
  !detail.questionDeferred && Boolean(detail.questionContent?.trim());

/**
 * 멘티가 낸 것을 한 줄로 요약한다.
 *
 * 캘린더 카드(`LiveMentoringCard`)의 어휘를 그대로 쓴다 — 멘토가 카드에서 본 문구와
 * 모달에서 보는 문구가 달라지면 같은 예약을 두 개로 읽는다(PRD 4.6).
 * 피드백 내역 표의 `제출 / 일부 제출 / 미제출` 은 이번에 바꾸지 않는다.
 *
 * 첨부는 멘토 전달 동의와 무관하게 "냈다" 로 센다. 동의하지 않았을 뿐 제출은 했다.
 */
function submissionSummary(detail: LiveMentoringReservationDetail): string {
  const questionSubmitted = hasQuestion(detail);
  const attachmentSubmitted = detail.attachmentType !== 'NONE';

  if (questionSubmitted && attachmentSubmitted) return '질문·파일 제출';
  if (questionSubmitted) return '질문만 제출';
  if (attachmentSubmitted) return '파일만 제출';
  return '미제출';
}

/** 닫기(X) 아이콘. */
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M6 6L18 18M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 멘티가 미리 적어 낸 질문 본문.
 *
 * 서버는 "나중에 작성하기" 를 고르는 순간 본문을 지운다(`updateQuestion`). 그래도 화면은
 * `questionDeferred` 와 빈 본문을 둘 다 본다 — 어느 쪽이든 빈 영역 대신 안내를 남긴다.
 *
 * `questionUpdatedAt` 은 백엔드가 이번에 내리지 않는다(PRD 4.5, 9-2). 값이 없으면 그 줄을
 * 그리지 않는다. 질문 수정 마감도 여기서 다시 계산하지 않는다 — 서버가 계산하는 값이다.
 */
const QuestionSection = ({
  detail,
}: {
  detail: LiveMentoringReservationDetail;
}) => {
  const updatedAtLabel = detail.questionUpdatedAt
    ? formatUpdatedAt(detail.questionUpdatedAt)
    : '';

  return (
    <section className={feedbackModalDesign.cardSurface}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className={feedbackModalDesign.fieldLabel}>멘티 질문</span>
        {updatedAtLabel && (
          <p className="text-xs text-neutral-400">최종 수정 {updatedAtLabel}</p>
        )}
      </div>
      <div className="mt-2">
        {hasQuestion(detail) ? (
          <p className={twMerge(feedbackModalDesign.qnaBody, 'break-words')}>
            {detail.questionContent}
          </p>
        ) : (
          <p className="text-sm leading-6 text-neutral-500">
            아직 질문을 작성하지 않았습니다.
          </p>
        )}
      </div>
    </section>
  );
};

/**
 * 새 탭으로 열어 줘도 되는 주소인지. `http`/`https` 만 통과시킨다.
 *
 * 첨부 주소는 멘티가 직접 적어 낸 값인데 **서버는 길이(2048)만 본다** — 스킴 검증이
 * 어디에도 없다(`UpdateLiveMentoringQuestionRequestDto.url` 은 `@Size` 뿐이고 엔티티도
 * 그대로 넣는다). 멘티 화면의 https 검사(`validateQuestionInput`)는 화면에만 있어 API 를
 * 직접 부르면 지나간다.
 *
 * 걸러 내지 않으면 `javascript:` 주소를 href 에 그대로 싣게 되고, 멘토가 누르는 순간
 * 멘토 앱 origin 에서 실행된다. `target="_blank"` 는 막지 못한다 — 브라우저는
 * `javascript:` 에서 target 을 무시한다. 멘토 세션은 담당 멘티 전원의 제출물을 볼 수
 * 있어 피해 범위가 넓다.
 *
 * 임베드 쪽은 `isNotionUrl` 이 호스트까지 보므로 이 스킴들이 애초에 통과하지 못한다.
 */
function isOpenableUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}

/** 첨부 영역의 안내 문구 한 줄. 어느 분기에서도 빈 영역을 남기지 않는다. */
const AttachmentNotice = ({ children }: { children: string }) => (
  <p className="text-sm leading-6 text-neutral-500">{children}</p>
);

/**
 * 멘티가 낸 첨부. `attachmentType` 과 `mentorShareAgreed` 조합으로 네 갈래다(PRD 4.7).
 *
 * - `NONE`: 첨부 자료 없음
 * - 동의 안 함: 냈다는 사실만 알린다. 여기서 아무 표시도 하지 않으면 멘토가 "안 냈다" 로
 *   오해한다. 링크는 서버가 이미 null 로 비워 내리므로 화면에서 가릴 것도 없다
 * - `FILE`: 냈다는 사실만. **링크도 파일명도 만들지 않는다** — 업로드 키가 원본 파일명이라
 *   이름을 보여주는 것이 곧 공개 주소를 알려주는 것이다(PRD 4.2)
 * - `URL` + 동의: 새 탭 링크. 노션 주소일 때만 임베드를 시도한다
 *
 * 임베드를 노션으로 한정하는 이유는 `MenteeLinkPanel` 이 노션의 `X-Frame-Options` 차단을
 * 타임아웃으로 감지해 새 탭 안내로 전환하는 로직을 갖고 있기 때문이다. iframe 이 무거워
 * 조건을 만족할 때만 마운트한다.
 */
const AttachmentSection = ({
  detail,
}: {
  detail: LiveMentoringReservationDetail;
}) => {
  const [isEmbedOpen, setIsEmbedOpen] = useState(true);

  const { attachmentType, attachmentUrl, mentorShareAgreed, menteeName } =
    detail;
  const showEmbed = isNotionUrl(attachmentUrl);

  const renderBody = () => {
    if (attachmentType === 'NONE') {
      return <AttachmentNotice>첨부 자료 없음</AttachmentNotice>;
    }

    if (!mentorShareAgreed) {
      return (
        <AttachmentNotice>
          첨부를 냈으나 멘토 전달에 동의하지 않았습니다
        </AttachmentNotice>
      );
    }

    if (attachmentType === 'FILE') {
      return <AttachmentNotice>파일 첨부됨 — 준비 중</AttachmentNotice>;
    }

    // 주소가 비었거나 http(s) 가 아니면 링크를 만들지 않는다. 링크로 만드는 순간
    // 스킴이 그대로 실행되므로, 여는 대신 못 연다고 알린다.
    if (!attachmentUrl || !isOpenableUrl(attachmentUrl)) {
      return (
        <AttachmentNotice>첨부 주소를 확인할 수 없습니다</AttachmentNotice>
      );
    }

    return (
      <>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={feedbackModalDesign.panelEntryButton}
          >
            새 탭에서 열기
          </a>
          {showEmbed && (
            <button
              type="button"
              onClick={() => setIsEmbedOpen((open) => !open)}
              className="inline-flex items-center rounded px-2 py-1.5 text-sm font-medium text-neutral-500 hover:bg-neutral-50"
            >
              {isEmbedOpen ? '미리보기 접기' : '미리보기 펼치기'}
            </button>
          )}
        </div>
        {showEmbed && isEmbedOpen && (
          // 좁은 폭에서는 낮게 잡는다. 폭은 항상 컨테이너에 맞추고 넘치지 않는다.
          <div
            className="mt-3 h-[280px] w-full md:h-[420px]"
            data-testid="attachment-embed"
          >
            <MenteeLinkPanel
              link={attachmentUrl}
              menteeName={menteeName}
              onClose={() => setIsEmbedOpen(false)}
              hideHeader
              fit="native"
            />
          </div>
        )}
      </>
    );
  };

  return (
    <section className={feedbackModalDesign.cardSurface}>
      <span className={feedbackModalDesign.fieldLabel}>첨부 자료</span>
      <div className="mt-2">{renderBody()}</div>
    </section>
  );
};

/**
 * 예약 요약 카드 — 멘티명, 상품·카테고리·시간, 제출 상태, 예약 일시.
 *
 * 라이브 피드백 예약 모달의 멘티 정보 카드와 같은 어휘를 쓴다(큰 이름 + 작은 프로그램명,
 * 라벨 위 값 아래의 2열, 상태 점). 멘토가 두 종류의 세션을 오갈 때 같은 자리에서 같은
 * 정보를 찾을 수 있어야 한다.
 */
const ReservationSummaryCard = ({
  detail,
  metaLine,
}: {
  detail: LiveMentoringReservationDetail;
  metaLine: string;
}) => {
  const summary = submissionSummary(detail);

  return (
    <section className={twMerge(feedbackModalDesign.cardSurface, 'shrink-0')}>
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="text-lg font-semibold text-neutral-900 md:text-2xl">
          {detail.menteeName}
        </h2>
        {metaLine && (
          <span className="text-xs font-medium text-neutral-500">
            {metaLine}
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className={feedbackModalDesign.fieldLabel}>제출 상태</span>
          <div className="flex items-center gap-1.5 text-sm">
            <span
              className={twMerge(
                feedbackModalDesign.dotBase,
                summary === '미제출'
                  ? feedbackModalDesign.dotNone
                  : feedbackModalDesign.dotOk,
              )}
            />
            <span className="font-medium text-neutral-700">{summary}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className={feedbackModalDesign.fieldLabel}>예약 일시</span>
          <span className="text-sm font-medium text-neutral-700">
            {formatReservationPeriod(
              detail.reservationStartAt,
              detail.reservationEndAt,
            )}
          </span>
        </div>
      </div>
    </section>
  );
};

/**
 * 모달 본문. `applicationId` 가 확정된 뒤에만 마운트된다.
 *
 * 조회 훅을 이 안에 두는 이유는 닫힌 상태에서 쿼리가 돌지 않게 하기 위해서다.
 * 훅 자체도 `enabled` 로 한 번 막지만, 컴포넌트를 아예 마운트하지 않으면 캐시 구독과
 * 리렌더까지 함께 사라진다.
 */
const SubmissionModalBody = ({
  applicationId,
  onClose,
}: {
  applicationId: number;
  onClose: () => void;
}) => {
  const { data, isLoading, isError } =
    useLiveMentoringReservationDetailQuery(applicationId);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 카테고리는 null 로 올 수 있다 — 기존 행이 유효 코드 밖인 0 이라 서버가 null 을 내린다.
  // 그 자리를 빈 칸으로 남기지 않고 항목 자체를 뺀다.
  const metaLine = data
    ? [
        data.productName,
        data.mentoringCategory ? CATEGORY_LABELS[data.mentoringCategory] : null,
        durationLabel(data.durationMinutes),
      ]
        .filter((part): part is string => Boolean(part))
        .join(' · ')
    : '';

  return (
    <BaseModal
      isOpen
      onClose={onClose}
      className={twMerge(
        feedbackModalDesign.modalContainer,
        // 1대1 은 질문·첨부만 담아 기준 모달(1040px)만큼 넓을 필요가 없다.
        // 라운드·여백·타이포는 토큰 그대로 두어 같은 제품으로 읽히게 한다.
        'w-[760px] md:h-[660px]',
      )}
    >
      <div className="flex h-full flex-col">
        {/*
          헤더 — FeedbackHeader 와 같은 여백·타이포를 쓴다. 다만 그 컴포넌트를 그대로
          쓰지는 않는다. 멘티 여러 명을 오가는 모달용이라 총원·진행 상태 카운터를
          요구하는데, 1대1 은 예약 한 건이라 채울 값이 없다(PRD 4.4).
        */}
        <div className="flex shrink-0 items-center gap-3 bg-white px-4 pb-3 pt-4 md:px-6 md:pt-6">
          <span className="shrink-0 text-xs font-medium text-neutral-700">
            1대1 라이브 멘토링
          </span>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            aria-label="제출물 모달 닫기"
            className="shrink-0 p-1 text-neutral-500 hover:text-neutral-700"
          >
            <CloseIcon />
          </button>
        </div>

        {/*
          긴 질문 본문은 이 안에서만 세로로 스크롤한다. 가로는 잘라 낸다 — 본문이 넘쳐
          페이지가 옆으로 밀리면 모달 밖 화면까지 함께 흔들린다.
        */}
        <div
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden px-4 pb-4 md:px-6 md:pb-6"
          data-testid="submission-modal-scroll"
        >
          {isLoading && (
            <p className="py-8 text-center text-sm text-neutral-500">
              제출물을 불러오는 중입니다...
            </p>
          )}
          {isError && (
            <p className="py-8 text-center text-sm text-neutral-500">
              제출물을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </p>
          )}
          {data && (
            <>
              <ReservationSummaryCard detail={data} metaLine={metaLine} />
              <QuestionSection detail={data} />
              <AttachmentSection detail={data} />
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

/**
 * 멘토가 멘티의 1대1 라이브 멘토링 제출물(질문·첨부)을 여는 모달.
 *
 * 챌린지 라이브 피드백 모달(`LiveFeedbackReservationModal`)을 재사용하지 않는다 —
 * 그쪽은 출석 마킹·서면 피드백 작성·멘티 네비게이션을 안고 있고 1대1 에는 그중
 * 어느 것도 없다(PRD 4.6).
 */
const LiveMentoringSubmissionModal = ({
  applicationId,
  onClose,
}: LiveMentoringSubmissionModalProps) => {
  if (applicationId === null) return null;

  return (
    <SubmissionModalBody applicationId={applicationId} onClose={onClose} />
  );
};

export default LiveMentoringSubmissionModal;
