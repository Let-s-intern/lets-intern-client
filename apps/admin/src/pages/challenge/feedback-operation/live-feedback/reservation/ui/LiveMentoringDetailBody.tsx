import { useEffect, useState } from 'react';

import { useUpdateLiveMentoringReservationAttendanceMutation } from '@/api/live-mentoring/liveMentoring';
import type {
  AdminLiveMentoringReservation,
  LiveMentoringAttendanceStatus,
} from '@/api/live-mentoring/liveMentoringSchema';
import { APPLICATION_STATUS_LABELS } from '@/domain/live-mentoring/constants';
import { MenteeSubmissionContent } from '@/domain/live-mentoring/ui/MenteeSubmission';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  formatApplyDateTime,
  formatReservationDateTime,
} from '../../utils/format';

/**
 * 1대1 라이브 멘토링 예약 상세.
 *
 * 챌린지 라이브 피드백과 같은 모달 안에서 같은 카드 배치를 쓴다. 예약 변경은
 * 헤더의 공용 "예약 변경" 버튼(`ReservationDetailModal`)이 이미 다룬다. 출석도
 * 입장 링크 복사도 이 안에서 바로 한다. 후기 점수·내용 수정만 아직 1대1에 없다.
 * 감추지 않고 아래 `제한 사항` 에 무엇이 왜 없는지 적는다.
 *
 * 목록 응답(`AdminLiveMentoringReservationVo`)이 상세용 조회가 가진 값을 모두 담고 있어
 * 상세 API 를 따로 부르지 않는다.
 */

/**
 * 웹 입장 페이지(`/live-mentoring/[role]/[applicationId]`) base URL.
 * 라이브 피드백 `ReservationDetailModal` 의 `getWebBaseUrl` 과 같은 로직이다 —
 * 컴포넌트를 공유하지 않는다는 원칙(`core.md`)에 따라 파일마다 그대로 둔다.
 */
function getWebBaseUrl(): string {
  const configured = import.meta.env.VITE_WEB_URL;
  if (configured) return configured.replace(/\/$/, '');
  return window.location.origin
    .replace('//test-admin.', '//test.')
    .replace('//admin.', '//www.');
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-2">
      <span className="w-24 shrink-0 text-neutral-40">{label}</span>
      <span className="break-words">{value || '-'}</span>
    </div>
  );
}

const LIMITATIONS: { label: string; reason: string }[] = [
  {
    label: '후기 점수·내용 수정',
    reason: '1대1 후기를 어드민이 고치는 API 가 없습니다.',
  },
];

/**
 * 알림톡 입장 링크 복사 — 멘토/멘티 각각의 딥링크를 클립보드에 복사한다.
 * 링크 형식: `{web}/live-mentoring/{role}/{applicationId}` (역할별 경로).
 * 라이브 피드백 `EntryLinkPanel` 과 같은 배치·문구를 쓴다.
 *
 * 웹 입장 페이지 경로와 반드시 같아야 한다. 알림톡 템플릿의 버튼 링크도 이 모양이다.
 */
function EntryLinkPanel({ applicationId }: { applicationId: number }) {
  const { snackbar } = useAdminSnackbar();

  const copyLink = async (role: 'mentor' | 'mentee') => {
    const url = `${getWebBaseUrl()}/live-mentoring/${role}/${applicationId}`;
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
      className="rounded-xl border border-neutral-80 p-4"
    >
      <p className="text-xxsmall12 font-medium text-neutral-40">
        입장 링크 복사
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => copyLink('mentor')}
          className="rounded-md border border-neutral-80 px-3 py-2 text-xsmall14 font-medium text-neutral-0 transition-colors hover:bg-neutral-95"
        >
          멘토 입장 링크 복사
        </button>
        <button
          type="button"
          onClick={() => copyLink('mentee')}
          className="rounded-md border border-neutral-80 px-3 py-2 text-xsmall14 font-medium text-neutral-0 transition-colors hover:bg-neutral-95"
        >
          멘티 입장 링크 복사
        </button>
      </div>
    </section>
  );
}

/** 출석 상태 선택 옵션. 라이브 피드백 어드민 수정 패널과 같은 값·같은 순서다. */
const ATTENDANCE_OPTIONS: ReadonlyArray<{
  value: LiveMentoringAttendanceStatus;
  label: string;
}> = [
  { value: 'PENDING', label: '대기' },
  { value: 'PRESENT', label: '참석' },
  { value: 'ABSENT', label: '불참' },
];

/**
 * 출석 수정 패널. PATCH /admin/live-mentoring/applications/{id}/attendance 로 저장한다.
 *
 * 서버는 멘토 입장 시 mentorStatus 를 자동으로 기록하지만, 그 값을 어드민이
 * 확인·정정할 방법이 이 패널이 생기기 전까지 없었다.
 */
function AttendanceEditPanel({
  reservation,
}: {
  reservation: AdminLiveMentoringReservation;
}) {
  const { mutate: updateAttendance, isPending } =
    useUpdateLiveMentoringReservationAttendanceMutation();

  const [mentorStatus, setMentorStatus] =
    useState<LiveMentoringAttendanceStatus>(reservation.mentorStatus);
  const [menteeStatus, setMenteeStatus] =
    useState<LiveMentoringAttendanceStatus>(reservation.menteeStatus);

  // 다른 예약을 선택하면 폼 값을 그 예약 것으로 다시 맞춘다.
  useEffect(() => {
    setMentorStatus(reservation.mentorStatus);
    setMenteeStatus(reservation.menteeStatus);
  }, [reservation]);

  const handleSave = () => {
    updateAttendance({
      applicationId: reservation.applicationId,
      mentorStatus,
      menteeStatus,
    });
  };

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-neutral-80 p-4">
      <h3 className="text-xsmall14 font-semibold text-neutral-0">출석 수정</h3>

      <div className="flex items-center gap-3 py-1">
        <span className="w-24 shrink-0 text-xxsmall12 text-neutral-40">
          멘토 출석
        </span>
        <select
          value={mentorStatus}
          onChange={(e) =>
            setMentorStatus(e.target.value as LiveMentoringAttendanceStatus)
          }
          className="rounded-md border border-neutral-80 px-2 py-1 text-xsmall14"
        >
          {ATTENDANCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 py-1">
        <span className="w-24 shrink-0 text-xxsmall12 text-neutral-40">
          멘티 출석
        </span>
        <select
          value={menteeStatus}
          onChange={(e) =>
            setMenteeStatus(e.target.value as LiveMentoringAttendanceStatus)
          }
          className="rounded-md border border-neutral-80 px-2 py-1 text-xsmall14"
        >
          {ATTENDANCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="mt-1 rounded-lg bg-primary py-2.5 text-xsmall14 font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? '저장 중…' : '저장하기'}
      </button>
    </section>
  );
}

export default function LiveMentoringDetailBody({
  reservation,
}: {
  reservation: AdminLiveMentoringReservation;
}) {
  const hasSlot =
    reservation.reservationStartAt != null &&
    reservation.reservationEndAt != null;

  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-xl border border-neutral-80 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-7">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-medium20 font-semibold text-neutral-0">
                {reservation.menteeName || '-'}
              </h3>
              <span className="text-xxsmall12 font-medium text-neutral-40">
                {reservation.productName || '상품명 없음'}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xxsmall12 text-neutral-40">
                <span>결제 상태</span>
                <span className="font-medium text-neutral-20">
                  {APPLICATION_STATUS_LABELS[reservation.status]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xxsmall12 text-neutral-40">
                <span>플랜</span>
                <span className="font-medium text-neutral-20">
                  {reservation.durationMinutes != null
                    ? `${reservation.durationMinutes}분`
                    : '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-3">
            <div className="grid gap-2 text-xsmall14 text-neutral-20">
              <InfoRow
                label="멘토"
                value={reservation.mentorNickname || reservation.mentorName}
              />
              <InfoRow label="멘토 이메일" value={reservation.mentorEmail} />
              <InfoRow label="멘티 이메일" value={reservation.menteeEmail} />
              <InfoRow label="멘티 연락처" value={reservation.menteePhoneNum} />
              {/* 신청서에 적은 연락용 이메일이라 계정 이메일과 다를 수 있다. */}
              <InfoRow label="연락용 이메일" value={reservation.contactEmail} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-80 p-4">
        <p className="text-xxsmall12 font-medium text-neutral-40">
          멘티 제출 내역
        </p>
        <div className="mt-3">
          <MenteeSubmissionContent value={reservation} />
        </div>
      </section>

      <section
        aria-label="예약 정보"
        className="rounded-xl border border-neutral-80 p-4"
      >
        <ul className="flex flex-col gap-3 text-xsmall14">
          <li className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xxsmall12 font-medium text-neutral-40">
              예약 일시
            </span>
            <span className="text-neutral-0">
              {hasSlot
                ? formatReservationDateTime(
                    reservation.reservationStartAt as string,
                    reservation.reservationEndAt as string,
                  )
                : '예약 슬롯 없음'}
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xxsmall12 font-medium text-neutral-40">
              신청 시각
            </span>
            <span className="text-neutral-0">
              {formatApplyDateTime(reservation.createDate)}
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xxsmall12 font-medium text-neutral-40">
              신청 번호
            </span>
            <span className="text-neutral-0">{reservation.applicationId}</span>
          </li>
        </ul>
      </section>

      <EntryLinkPanel applicationId={reservation.applicationId} />

      <AttendanceEditPanel reservation={reservation} />

      <section
        aria-label="제한 사항"
        className="rounded-xl border border-neutral-80 p-4"
      >
        <p className="text-xxsmall12 font-medium text-neutral-40">제한 사항</p>
        <ul className="mt-3 flex flex-col gap-2 text-xsmall14 text-neutral-20">
          {LIMITATIONS.map((item) => (
            <li key={item.label} className="flex flex-col gap-0.5">
              <span className="font-medium">{item.label}</span>
              <span className="text-xxsmall12 text-neutral-40">
                {item.reason}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
