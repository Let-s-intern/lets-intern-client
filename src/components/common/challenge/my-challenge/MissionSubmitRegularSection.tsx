import { clsx } from 'clsx';
import { useState } from 'react';
import { useSubmitMission } from '../../../../api/attendance';
import LinkInputSection from './LinkInputSection';
import MissionSubmitButton from './MissionSubmitButton';
import MissionToast from './MissionToast';

interface MissionSubmitRegularSectionProps {
  className?: string;
  todayTh: number;
  missionId?: number;
}

const MissionSubmitRegularSection = ({
  className,
  todayTh,
  missionId,
}: MissionSubmitRegularSectionProps) => {
  const [textareaValue, setTextareaValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [isLinkVerified, setIsLinkVerified] = useState(false);

  const submitMission = useSubmitMission();

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
    console.log('handleSubmit', isSubmitted);
    if (isSubmitted) {
      setIsSubmitted(false);
    } else {
      // missionId가 없으면 제출 불가
      if (!missionId || missionId === 0) {
        console.error('missionId가 없습니다.');
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
      } catch (error) {
        console.error('미션 제출 실패:', error);
        // 에러 처리 로직 추가 가능
      }
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
        disabled={isSubmitted}
        onLinkChange={handleLinkChange}
        onLinkVerified={handleLinkVerified}
        todayTh={todayTh}
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
          disabled={isSubmitted}
        />
      </section>

      <MissionSubmitButton
        isSubmitted={isSubmitted}
        hasContent={canSubmit}
        onButtonClick={handleSubmit}
      />

      <MissionToast isVisible={showToast} onClose={() => setShowToast(false)} />
    </section>
  );
};

export default MissionSubmitRegularSection;
