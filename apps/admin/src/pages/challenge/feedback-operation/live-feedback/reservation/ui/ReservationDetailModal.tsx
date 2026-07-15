import type {
  FeedbackAttendanceStatus,
  FeedbackDetailAdminVo,
} from '@/api/feedback/feedbackSchema';
import {
  useAdminFeedbackDetailQuery,
  useUpdateAdminFeedbackMutation,
} from '@/api/feedback/feedback';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { twMerge } from '@/lib/twMerge';
import { sanitizeUrl } from '@/utils/url';
import { useEffect, useState } from 'react';
import { formatReservationDateTime } from '../../utils/format';

/**
 * 웹 입장 페이지(`/live-feedback/[role]/[feedbackId]`) base URL.
 * VITE_WEB_URL 미설정 시 어드민 호스트에서 웹 호스트를 유추한다
 * (test-admin.→test. / admin.→www.).
 */
function getWebBaseUrl(): string {
  const configured = import.meta.env.VITE_WEB_URL;
  if (configured) return configured.replace(/\/$/, '');
  return window.location.origin
    .replace('//test-admin.', '//test.')
    .replace('//admin.', '//www.');
}

interface ReservationDetailModalProps {
  /** 선택된 예약 id. null 이면 모달을 렌더하지 않는다(닫힘). */
  feedbackId: number | null;
  onClose: () => void;
}

const ATTENDANCE_LABEL: Record<FeedbackAttendanceStatus, string> = {
  PENDING: '대기',
  PRESENT: '참석',
  ABSENT: '불참',
};

/** 멘토 모달의 정보 그리드 행(라벨 + 값)과 동일한 스타일. */
function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-2">
      <span className="text-neutral-40 w-20 shrink-0">{label}</span>
      <span className="break-words">{value || '-'}</span>
    </div>
  );
}

/**
 * 알림톡 입장 링크 복사 — 멘토/멘티 각각의 딥링크를 클립보드에 복사한다.
 * 링크 형식: `{web}/live-feedback/{role}/{feedbackId}` (역할별 경로).
 */
function EntryLinkPanel({ feedbackId }: { feedbackId: number }) {
  const { snackbar } = useAdminSnackbar();

  const copyLink = async (role: 'mentor' | 'mentee') => {
    const url = `${getWebBaseUrl()}/live-feedback/${role}/${feedbackId}`;
    const roleLabel = role === 'mentor' ? '멘토' : '멘티';
    try {
      await navigator.clipboard.writeText(url);
      snackbar(`${roleLabel} 입장 링크를 복사했습니다.`);
    } catch {
      snackbar('링크 복사에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <section
      aria-label="입장 링크"
      className="border-neutral-80 rounded-xl border p-4"
    >
      <p className="text-xxsmall12 text-neutral-40 font-medium">
        입장 링크 복사
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => copyLink('mentor')}
          className="border-neutral-80 text-xsmall14 text-neutral-0 hover:bg-neutral-95 rounded-md border px-3 py-2 font-medium transition-colors"
        >
          멘토 입장 링크 복사
        </button>
        <button
          type="button"
          onClick={() => copyLink('mentee')}
          className="border-neutral-80 text-xsmall14 text-neutral-0 hover:bg-neutral-95 rounded-md border px-3 py-2 font-medium transition-colors"
        >
          멘티 입장 링크 복사
        </button>
      </div>
    </section>
  );
}

/**
 * 멘토 예약 상세 모달(LiveFeedbackReservationModal)의 멘티정보 카드 디자인을
 * 어드민 단건 모달에 맞춰 재현한다. 어드민에 없는 필드(희망 직군/산업/기업·제출물)는
 * 어드민이 가진 값(멘토·이메일·연락처·출석)으로 대체한다.
 */
function DetailBody({ detail }: { detail: FeedbackDetailAdminVo }) {
  return (
    <div className="flex flex-col gap-3">
      {/* 멘티/예약 정보 카드 */}
      <section className="border-neutral-80 rounded-xl border p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-7">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-medium20 text-neutral-0 font-semibold">
                {detail.menteeName || '-'}
              </h3>
              <span className="text-xxsmall12 text-neutral-40 font-medium">
                {detail.programTitle || '-'}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="text-xxsmall12 text-neutral-40 flex items-center gap-2">
                <span>멘토 출석</span>
                <span className="text-neutral-20 font-medium">
                  {ATTENDANCE_LABEL[detail.mentorStatus]}
                </span>
              </div>
              <div className="text-xxsmall12 text-neutral-40 flex items-center gap-2">
                <span>멘티 출석</span>
                <span className="text-neutral-20 font-medium">
                  {ATTENDANCE_LABEL[detail.menteeStatus]}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-3">
            <div className="text-xsmall14 text-neutral-20 grid gap-2">
              <InfoRow label="멘토" value={detail.mentorName} />
              <InfoRow label="멘토 이메일" value={detail.mentorEmail} />
              <InfoRow label="멘티 이메일" value={detail.menteeEmail} />
              <InfoRow label="멘티 연락처" value={detail.menteePhoneNum} />
            </div>
          </div>
        </div>
      </section>

      {/* 사전 Q&A */}
      <section className="border-neutral-80 rounded-xl border p-4">
        <p className="text-xxsmall12 text-neutral-40 font-medium">
          사전 Q&amp;A
        </p>
        <p className="text-xsmall14 text-neutral-20 mt-3 whitespace-pre-wrap leading-6">
          {detail.preQuestion || '-'}
        </p>
      </section>

      {/* 예약 정보 패널 */}
      <section
        aria-label="예약 정보"
        className="border-neutral-80 rounded-xl border p-4"
      >
        <ul className="text-xsmall14 flex flex-col gap-3">
          <li className="flex items-center gap-3">
            <span className="text-xxsmall12 text-neutral-40 w-20 shrink-0 font-medium">
              예약 일시
            </span>
            <span className="text-neutral-0">
              {formatReservationDateTime(detail.startDate, detail.endDate)}
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-xxsmall12 text-neutral-40 w-20 shrink-0 font-medium">
              미팅 URL
            </span>
            {detail.meetingUrl ? (
              <a
                href={sanitizeUrl(detail.meetingUrl)}
                target="_blank"
                rel="noreferrer"
                className="break-all text-blue-600 hover:underline"
              >
                {detail.meetingUrl}
              </a>
            ) : (
              <span className="text-neutral-0">-</span>
            )}
          </li>
        </ul>
      </section>

      <EntryLinkPanel feedbackId={detail.feedbackId} />

      <EditPanel detail={detail} />
    </div>
  );
}

/** 출석 상태 선택 옵션 */
const ATTENDANCE_OPTIONS: ReadonlyArray<{
  value: FeedbackAttendanceStatus;
  label: string;
}> = [
  { value: 'PENDING', label: '대기' },
  { value: 'PRESENT', label: '참석' },
  { value: 'ABSENT', label: '불참' },
];

/**
 * 어드민 수정 패널 — 멘토/멘티 출석, 후기 점수/내용/공개여부.
 * PATCH /admin/feedback/{feedbackId} 로 저장한다.
 */
function EditPanel({ detail }: { detail: FeedbackDetailAdminVo }) {
  const { mutate: updateFeedback, isPending } =
    useUpdateAdminFeedbackMutation();

  const [mentorStatus, setMentorStatus] = useState<FeedbackAttendanceStatus>(
    detail.mentorStatus,
  );
  const [menteeStatus, setMenteeStatus] = useState<FeedbackAttendanceStatus>(
    detail.menteeStatus,
  );
  const [score, setScore] = useState<number>(detail.score ?? 0);
  const [review, setReview] = useState<string>(detail.review ?? '');
  const [reviewIsVisible, setReviewIsVisible] = useState<boolean>(
    detail.reviewIsVisible ?? false,
  );

  // 상세가 갱신되면 폼 값을 동기화 (다른 예약 선택 시)
  useEffect(() => {
    setMentorStatus(detail.mentorStatus);
    setMenteeStatus(detail.menteeStatus);
    setScore(detail.score ?? 0);
    setReview(detail.review ?? '');
    setReviewIsVisible(detail.reviewIsVisible ?? false);
  }, [detail]);

  const handleSave = () => {
    // 미선택(score 0)·빈 후기는 null 로 명시 전송해 기존 값을 초기화한다.
    const trimmedReview = review.trim();
    updateFeedback({
      feedbackId: detail.feedbackId,
      mentorStatus,
      menteeStatus,
      score: score > 0 ? score : null,
      review: trimmedReview ? trimmedReview : null,
      reviewIsVisible,
    });
  };

  return (
    <section className="border-neutral-80 flex flex-col gap-3 rounded-xl border p-4">
      <h3 className="text-xsmall14 text-neutral-0 font-semibold">
        출석 · 후기 수정
      </h3>

      <div className="flex items-center gap-3 py-1">
        <span className="text-xxsmall12 text-neutral-40 w-24 shrink-0">
          멘토 출석
        </span>
        <select
          value={mentorStatus}
          onChange={(e) =>
            setMentorStatus(e.target.value as FeedbackAttendanceStatus)
          }
          className="border-neutral-80 text-xsmall14 rounded-md border px-2 py-1"
        >
          {ATTENDANCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 py-1">
        <span className="text-xxsmall12 text-neutral-40 w-24 shrink-0">
          멘티 출석
        </span>
        <select
          value={menteeStatus}
          onChange={(e) =>
            setMenteeStatus(e.target.value as FeedbackAttendanceStatus)
          }
          className="border-neutral-80 text-xsmall14 rounded-md border px-2 py-1"
        >
          {ATTENDANCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 py-1">
        <span className="text-xxsmall12 text-neutral-40 w-24 shrink-0">
          후기 점수
        </span>
        <select
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="border-neutral-80 text-xsmall14 rounded-md border px-2 py-1"
        >
          <option value={0}>미선택</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}점
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5 py-1">
        <span className="text-xxsmall12 text-neutral-40">후기 내용</span>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={3}
          className="border-neutral-80 text-xsmall14 w-full resize-none rounded-md border p-2 outline-none"
          placeholder="멘티 후기 내용"
        />
      </div>

      <label className="text-xsmall14 text-neutral-0 flex items-center gap-2 py-1">
        <input
          type="checkbox"
          checked={reviewIsVisible}
          onChange={(e) => setReviewIsVisible(e.target.checked)}
        />
        후기 공개
      </label>

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="bg-primary hover:bg-primary-hover text-xsmall14 mt-1 rounded-lg py-2.5 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? '저장 중…' : '저장하기'}
      </button>
    </section>
  );
}

export default function ReservationDetailModal({
  feedbackId,
  onClose,
}: ReservationDetailModalProps) {
  const {
    data: detail,
    isLoading,
    isError,
  } = useAdminFeedbackDetailQuery(feedbackId ?? undefined);

  if (feedbackId == null) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="예약 상세"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={twMerge(
          'relative z-10 flex max-h-[85dvh] w-full max-w-3xl flex-col',
          'overflow-hidden rounded-lg bg-white shadow-lg',
        )}
      >
        <div className="border-neutral-80 flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-medium16 text-neutral-0 font-semibold">
            예약 상세
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-neutral-40 hover:text-neutral-0 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {isError ? (
            <div className="text-xsmall14 py-12 text-center text-red-500">
              예약 정보를 불러오지 못했습니다. 다시 시도해 주세요.
            </div>
          ) : isLoading || !detail ? (
            <div className="text-xsmall14 text-neutral-40 py-12 text-center">
              불러오는 중...
            </div>
          ) : (
            <DetailBody detail={detail} />
          )}
        </div>
      </div>
    </div>
  );
}
