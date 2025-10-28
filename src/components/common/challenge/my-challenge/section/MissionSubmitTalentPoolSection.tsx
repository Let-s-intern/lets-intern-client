import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { clsx } from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import MissionSubmitButton from '../mission/MissionSubmitButton';
import MissionToast from '../mission/MissionToast';
import TalentPoolFilters from '../talent-pool/TalentPoolFilters';

interface MissionSubmitTalentPoolSectionProps {
  className?: string;
  missionId?: number;
  attendanceInfo?: Schedule['attendanceInfo'] | null;
}

const MissionSubmitTalentPoolSection = ({
  className,
  missionId,
  attendanceInfo,
}: MissionSubmitTalentPoolSectionProps) => {
  const { currentChallenge } = useCurrentChallenge();

  // 챌린지 종료 + 2일
  const isSubmitPeriodEnded =
    dayjs(currentChallenge?.endDate).add(2, 'day').isBefore(dayjs()) ?? true;

  // 재제출 불가
  const isResubmitBlocked =
    attendanceInfo?.result === 'PASS' ||
    attendanceInfo?.result === 'FINAL_WRONG' ||
    (attendanceInfo?.result === 'WAITING' &&
      (attendanceInfo?.status === 'LATE' ||
        attendanceInfo?.status === 'UPDATED'));

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  {
    /* TODO: 서류 업로드 컴포넌트 추가 + 제출 로직 연동 필요) */
  }

  // 제출 버튼 활성화 조건: 필수 항목(이력서 + 개인정보 동의) 입력 완료 시 활성화
  const canSubmit = isAgreed;

  const handleSubmit = async () => {
    if (isSubmitted) {
      // 이미 제출된 미션 → 수정 모드로 전환
      setIsEditing(true);
      return;
    }

    if (!missionId) {
      console.error('미션 ID가 없습니다.');
      return;
    }
    console.log('제출하기');
  };

  const handleSaveEdit = async () => {
    console.log('수정하기 저장');
  };

  const handleCancelEdit = () => {
    console.log('수정하기 취소');
  };

  const initValues = useCallback(() => {
    setIsAgreed(attendanceInfo?.submitted ?? false);
    setIsSubmitted(attendanceInfo?.submitted ?? false);
  }, [attendanceInfo]);

  useEffect(() => {
    /** 상태 초기화 */
    initValues();
  }, [attendanceInfo, initValues]);

  return (
    <>
      <section className={clsx('', className)}>
        <h2 className="mb-6 text-small18 font-bold text-neutral-0">
          인재풀 등록하기
        </h2>

        {/* 희망 조건 입력 영역 */}
        <TalentPoolFilters />
        {/* 서류 업로드 영역 */}

        {/* 개인정보 수집 활용 동의서 */}

        {!isSubmitPeriodEnded && (
          <MissionSubmitButton
            isSubmitted={isSubmitted}
            hasContent={canSubmit}
            onButtonClick={handleSubmit}
            isEditing={isEditing}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            disabled={isResubmitBlocked}
          />
        )}

        <MissionToast
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      </section>
    </>
  );
};

export default MissionSubmitTalentPoolSection;
