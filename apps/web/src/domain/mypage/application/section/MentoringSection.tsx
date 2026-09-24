'use client';

import { useState } from 'react';

import { useMyLiveMentoringApplicationsQuery } from '@/api/live-mentoring/liveMentoring';
import type { MyLiveMentoringApplication } from '@/api/live-mentoring/liveMentoringSchema';
import MentoringApplicationCard, {
  type MentoringCardPhase,
} from '@/domain/live-mentoring/mypage/MentoringApplicationCard';
import QuestionModal from '@/domain/live-mentoring/question/QuestionModal';
import EmptySection from './EmptySection';

/**
 * 예약 구간과 현재 시각으로 카드를 가른다.
 *
 * 서버는 신청 상태(`CONFIRMED` 등)만 주고 참여 단계는 주지 않는다. 시각 비교는
 * 타임존 없는 `LocalDateTime` 문자열끼리 하면 브라우저 타임존이 끼어들지 않는다 —
 * 사용자와 멘토가 같은 한국 시간을 보는 서비스라 로컬 시각으로 비교하는 것이 맞다.
 */
export const resolvePhase = (
  application: MyLiveMentoringApplication,
  now: Date,
): MentoringCardPhase => {
  const nowLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  /*
    슬롯이 없으면 서버가 시작·종료를 null 로 준다(결제 만료·취소로 슬롯이 풀린 뒤
    멘토가 그 슬롯을 지운 경우). 일정을 모르는 것이지 끝난 것이 아니므로 '참여 예정'
    에 둔다. '참여 종료' 로 몰면 멘티가 아직 남은 예약을 지난 것으로 오해한다.
   */
  if (!application.reservationStartAt || !application.reservationEndAt)
    return 'upcoming';

  if (nowLocal < application.reservationStartAt) return 'upcoming';
  if (nowLocal < application.reservationEndAt) return 'ongoing';
  return 'ended';
};

const SECTION_TITLE: Record<MentoringCardPhase, string> = {
  upcoming: '참여 예정',
  ongoing: '참여 중',
  ended: '참여 종료',
};

const PHASE_ORDER: MentoringCardPhase[] = ['upcoming', 'ongoing', 'ended'];

/**
 * 마이페이지 신청현황 — 멘토링 탭 (시안 `3-0`).
 *
 * 참여 예정 / 참여 중 / 참여 종료 세 구간으로 나눈다. 비어 있는 구간은 제목까지
 * 감춘다 — 시안에 세 제목이 다 있지만, 실제로는 대부분 "참여 예정" 하나만 차므로
 * 빈 제목 두 개가 남으면 뭔가 사라진 것처럼 보인다.
 */
const MentoringSection = () => {
  const { data, isLoading, isError } = useMyLiveMentoringApplicationsQuery();
  const [openApplicationId, setOpenApplicationId] = useState<number | null>(
    null,
  );

  const applications = data?.applicationList ?? [];

  if (isLoading) {
    return <p className="text-neutral-40 py-20 text-center">불러오는 중…</p>;
  }

  /*
    실패를 빈 목록과 구분한다. 이 분기가 없으면 조회가 실패했을 때 "아직 신청한
    1:1 멘토링이 없어요" 가 떠서, 결제까지 마친 예약이 있는데도 없는 것처럼 보인다.
    스키마 파싱 실패도 같은 자리로 오므로 `isError` 하나로 함께 잡는다.
   */
  if (isError) {
    return (
      <p className="text-neutral-40 py-20 text-center">
        신청 내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  if (applications.length === 0) {
    return (
      <EmptySection
        text="아직 신청한 1:1 멘토링이 없어요"
        href="/live-mentoring"
        buttonText="1:1 멘토링 둘러보기"
      />
    );
  }

  const now = new Date();
  const grouped = PHASE_ORDER.map((phase) => ({
    phase,
    items: applications.filter(
      (application) => resolvePhase(application, now) === phase,
    ),
  })).filter((group) => group.items.length > 0);

  const openApplication =
    applications.find(
      (application) => application.applicationId === openApplicationId,
    ) ?? null;

  return (
    <>
      <div className="flex flex-col gap-16">
        {grouped.map(({ phase, items }) => (
          <section key={phase} className="flex flex-col gap-5">
            <h2 className="text-small18 text-neutral-0 font-bold">
              {SECTION_TITLE[phase]}
            </h2>
            <div className="flex flex-col gap-5">
              {items.map((application) => (
                <MentoringApplicationCard
                  key={application.applicationId}
                  application={application}
                  phase={phase}
                  onQuestionClick={setOpenApplicationId}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {openApplication && (
        <QuestionModal
          applicationId={openApplication.applicationId}
          // 시작한 뒤에는 읽기만 한다. 서버 `editable` 이 최종 판정이고 이건 화면 모드다.
          readOnly={resolvePhase(openApplication, now) !== 'upcoming'}
          onClose={() => setOpenApplicationId(null)}
        />
      )}
    </>
  );
};

export default MentoringSection;
