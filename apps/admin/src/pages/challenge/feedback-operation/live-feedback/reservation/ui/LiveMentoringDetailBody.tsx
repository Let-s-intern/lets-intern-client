import type { AdminLiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import { APPLICATION_STATUS_LABELS } from '@/domain/live-mentoring/constants';
import {
  formatApplyDateTime,
  formatReservationDateTime,
} from '../../utils/format';

/**
 * 1대1 라이브 멘토링 예약 상세.
 *
 * 챌린지 라이브 피드백과 같은 모달 안에서 같은 카드 배치를 쓴다. 다만 챌린지에 있는
 * 조작(출석·후기 저장, 입장 링크, 예약 변경)은 1대1에 서버가 없다. 감추지 않고
 * 아래 `제한 사항` 에 무엇이 왜 없는지 적는다.
 *
 * 목록 응답(`AdminLiveMentoringReservationVo`)이 상세용 조회가 가진 값을 모두 담고 있어
 * 상세 API 를 따로 부르지 않는다.
 */

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-2">
      <span className="text-neutral-40 w-24 shrink-0">{label}</span>
      <span className="break-words">{value || '-'}</span>
    </div>
  );
}

/** 사전 질문 문구. 미룬 신청과 아직 안 쓴 신청은 다른 상태라 다르게 적는다. */
function preQuestionText(reservation: AdminLiveMentoringReservation): string {
  if (reservation.questionContent) return reservation.questionContent;
  if (reservation.questionDeferred) {
    return '멘티가 사전 질문을 나중에 보내겠다고 선택했습니다.';
  }
  return '작성한 사전 질문이 없습니다.';
}

const LIMITATIONS: { label: string; reason: string }[] = [
  {
    label: '멘토·멘티 출석 체크',
    reason: '1대1은 서버가 출석을 기록하지 않습니다.',
  },
  {
    label: '후기 점수·내용 수정',
    reason: '1대1 후기를 어드민이 고치는 API 가 없습니다.',
  },
  {
    label: '멘토·멘티 입장 링크 복사',
    reason: '1대1에는 역할별 입장 페이지가 아직 없습니다.',
  },
  {
    label: '예약 일정 변경',
    reason:
      '1대1 슬롯을 옮기는 API 가 없습니다. 취소 후 재신청으로만 옮길 수 있습니다.',
  },
];

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
      <section className="border-neutral-80 rounded-xl border p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-7">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-medium20 text-neutral-0 font-semibold">
                {reservation.menteeName || '-'}
              </h3>
              <span className="text-xxsmall12 text-neutral-40 font-medium">
                {reservation.productName || '상품명 없음'}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="text-xxsmall12 text-neutral-40 flex items-center gap-2">
                <span>결제 상태</span>
                <span className="text-neutral-20 font-medium">
                  {APPLICATION_STATUS_LABELS[reservation.status]}
                </span>
              </div>
              <div className="text-xxsmall12 text-neutral-40 flex items-center gap-2">
                <span>플랜</span>
                <span className="text-neutral-20 font-medium">
                  {reservation.durationMinutes != null
                    ? `${reservation.durationMinutes}분`
                    : '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-3">
            <div className="text-xsmall14 text-neutral-20 grid gap-2">
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

      <section className="border-neutral-80 rounded-xl border p-4">
        <p className="text-xxsmall12 text-neutral-40 font-medium">
          사전 Q&amp;A
        </p>
        <p className="text-xsmall14 text-neutral-20 mt-3 whitespace-pre-wrap leading-6">
          {preQuestionText(reservation)}
        </p>
      </section>

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
              {hasSlot
                ? formatReservationDateTime(
                    reservation.reservationStartAt as string,
                    reservation.reservationEndAt as string,
                  )
                : '예약 슬롯 없음'}
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-xxsmall12 text-neutral-40 w-20 shrink-0 font-medium">
              신청 시각
            </span>
            <span className="text-neutral-0">
              {formatApplyDateTime(reservation.createDate)}
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-xxsmall12 text-neutral-40 w-20 shrink-0 font-medium">
              신청 번호
            </span>
            <span className="text-neutral-0">{reservation.applicationId}</span>
          </li>
        </ul>
      </section>

      <section
        aria-label="제한 사항"
        className="border-neutral-80 rounded-xl border p-4"
      >
        <p className="text-xxsmall12 text-neutral-40 font-medium">제한 사항</p>
        <ul className="text-xsmall14 text-neutral-20 mt-3 flex flex-col gap-2">
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
