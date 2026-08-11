'use client';

import { useChallengeMissionFeedbackQuery } from '@/api/challenge/challenge';
import LexicalContent from '@/common/lexical/LexicalContent';

interface Props {
  challengeId: string | number;
  missionId: number;
}

/**
 * LIVE 피드백 회차의 멘토 서면 피드백 — "피드백 내역 보기" 아코디언 안에 표시한다.
 *
 * 멘토가 라이브 세션에서 남긴 글은 서면 피드백과 **같은 위치**(`attendance.feedback`)에
 * 저장된다. 미션 회차 상세(`#mentor-feedback`)에서도 같은 값을 보여주지만, 라이브
 * 카드에서는 그쪽으로 보내는 경로가 없어 멘티가 스크롤로 찾아야 했다. 예약 정보 아래에
 * 바로 붙여 아코디언 이름("피드백 내역")대로 동작하게 한다.
 *
 * 서버는 `attendance.status=PRESENT` · `result=PASS` · `feedbackStatus=CONFIRMED`
 * (관리자 확인 완료)를 모두 만족할 때만 본문을 내려준다. 그 전에는 값이 없으므로
 * "확인 후 공개" 안내를 띄운다.
 */
const MentorWrittenFeedbackSection = ({ challengeId, missionId }: Props) => {
  const { data } = useChallengeMissionFeedbackQuery({ challengeId, missionId });

  const raw = data?.attendanceInfo?.feedback;
  const root = (() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw)?.root ?? null;
    } catch {
      return null;
    }
  })();

  return (
    <section className="border-neutral-80 flex flex-col gap-2 border-t px-4 py-5 md:px-0">
      <h3 className="text-xsmall14 md:text-xsmall16 text-neutral-0 font-semibold">
        멘토 피드백
      </h3>
      {root ? (
        <div className="rounded-xxs border-neutral-80 border bg-white p-3">
          <div className="text-xsmall14 md:text-xsmall16 text-neutral-0 leading-relaxed">
            <LexicalContent node={root} />
          </div>
        </div>
      ) : (
        <p className="text-xsmall14 text-neutral-30">
          멘토가 작성한 피드백이 확인되면 이곳에 공개됩니다.
        </p>
      )}
    </section>
  );
};

export default MentorWrittenFeedbackSection;
