import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { usePatchMission, useSubmitMission } from '../../../../api/attendance';
import LinkInputSection from './LinkInputSection';
import MissionSubmitButton from './MissionSubmitButton';
import MissionToast from './MissionToast';

interface MissionSubmitRegularSectionProps {
  className?: string;
  todayTh: number;
  missionId?: number;
  attendanceInfo?: {
    link: string | null;
    status: 'PRESENT' | 'UPDATED' | 'LATE' | 'ABSENT' | null;
    id: number | null;
    submitted: boolean | null;
    comments: string | null;
    result: 'WAITING' | 'PASS' | 'WRONG' | null;
    review?: string | null;
  } | null;
}

const MissionSubmitRegularSection = ({
  className,
  todayTh,
  missionId,
  attendanceInfo,
}: MissionSubmitRegularSectionProps) => {
  const [textareaValue, setTextareaValue] = useState(
    attendanceInfo?.review || '',
  );
  const [isSubmitted, setIsSubmitted] = useState(
    attendanceInfo?.submitted === true,
  );
  const [showToast, setShowToast] = useState(false);
  const [linkValue, setLinkValue] = useState(attendanceInfo?.link || '');
  const [isLinkVerified, setIsLinkVerified] = useState(!!attendanceInfo?.link);
  const [isEditing, setIsEditing] = useState(false);

  // 원본 데이터 저장 (취소 시 복구용)
  const [originalTextareaValue, setOriginalTextareaValue] = useState(
    attendanceInfo?.review || '',
  );
  const [originalLinkValue, setOriginalLinkValue] = useState(
    attendanceInfo?.link || '',
  );

  const submitMission = useSubmitMission();
  const patchMission = usePatchMission();

  // attendanceInfo가 변경될 때마다 상태 업데이트
  useEffect(() => {
    const reviewValue = attendanceInfo?.review || '';
    const linkValue = attendanceInfo?.link || '';

    setTextareaValue(reviewValue);
    setIsSubmitted(attendanceInfo?.submitted === true);
    setLinkValue(linkValue);
    setIsLinkVerified(!!linkValue);
    setIsEditing(false); // 새 미션 선택 시 수정 모드 해제

    // 원본 데이터도 업데이트
    setOriginalTextareaValue(reviewValue);
    setOriginalLinkValue(linkValue);
  }, [attendanceInfo]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handleLinkChange = (link: string) => {
    setLinkValue(link);
  };

  const handleLinkVerified = (isVerified: boolean) => {
    setIsLinkVerified(isVerified);
  };

  const handleSubmit = async () => {
    if (isSubmitted) {
      // 이미 제출된 미션 → 수정 모드로 전환
      setIsEditing(true);
    } else {
      // 새 미션 제출
      if (!missionId || missionId === 0) {
        return;
      }

      try {
        await submitMission.mutateAsync({
          missionId,
          link: linkValue,
          review: textareaValue,
        });
        setIsSubmitted(true);
        setShowToast(true);
        // 원본 데이터 업데이트
        setOriginalTextareaValue(textareaValue);
        setOriginalLinkValue(linkValue);
      } catch {
        // 에러 처리 로직 추가 가능
      }
    }
  };

  const handleCancelEdit = () => {
    // 원본 데이터로 복구
    setTextareaValue(originalTextareaValue);
    setLinkValue(originalLinkValue);
    setIsLinkVerified(!!originalLinkValue);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!missionId || missionId === 0) {
      return;
    }

    try {
      await patchMission.mutateAsync({
        missionId,
        link: linkValue,
        review: textareaValue,
      });
      setIsEditing(false);
      setShowToast(true);
      // 원본 데이터 업데이트
      setOriginalTextareaValue(textareaValue);
      setOriginalLinkValue(linkValue);
    } catch {
      // 에러 처리 로직 추가 가능
    }
  };

  // 제출 버튼 활성화 조건: 링크 확인 완료 + 미션 소감 입력
  const canSubmit = isLinkVerified && textareaValue.trim().length > 0;

  return (
    <section className={clsx('', className)}>
      <h2 className="mb-6 text-small18 font-bold text-neutral-0">
        미션 제출하기
      </h2>

      {/* 링크 섹션 */}
      <LinkInputSection
        disabled={isSubmitted && !isEditing}
        onLinkChange={handleLinkChange}
        onLinkVerified={handleLinkVerified}
        todayTh={todayTh}
        initialLink={linkValue}
        text={`미션 링크는 .notion.site 형식의 퍼블릭 링크만 입력 가능합니다.
          제출 후, 미션과 소감을 카카오톡으로 공유해야 제출이 인정됩니다.`}
      />

      {/* 미션 소감 */}
      <section>
        <div className="mb-1.5 mt-7">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xsmall16 font-semibold text-neutral-0">
              미션 소감
            </span>
          </div>
        </div>
        <textarea
          className={clsx(
            'w-full resize-none rounded-xxs border border-neutral-80 bg-white',
            'px-3 py-2 text-xsmall14 text-neutral-0 placeholder:text-neutral-50 md:text-xsmall16',
            'min-h-[144px] outline-none focus:border-primary',
            'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
          )}
          placeholder={`오늘의 미션은 어떠셨나요?
새롭게 배운 점, 어려운 부분, 궁금증 등 떠오르는 생각을 남겨 주세요.`}
          value={textareaValue}
          onChange={handleTextareaChange}
          disabled={isSubmitted && !isEditing}
        />
      </section>

      <MissionSubmitButton
        isSubmitted={isSubmitted}
        hasContent={canSubmit}
        onButtonClick={handleSubmit}
        isEditing={isEditing}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
      />

      <MissionToast isVisible={showToast} onClose={() => setShowToast(false)} />
    </section>
  );
};

export default MissionSubmitRegularSection;
