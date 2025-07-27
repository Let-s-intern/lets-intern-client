import { clsx } from 'clsx';
import { useState } from 'react';
import MissionSubmitButton from './MissionSubmitButton';
import MissionToast from './MissionToast';

interface MissionSubmitBonusSectionProps {
  className?: string;
  todayTh: number;
}

const MissionSubmitBonusSection = ({
  className,
  todayTh,
}: MissionSubmitBonusSectionProps) => {
  const [textareaValue, setTextareaValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handleSubmit = () => {
    if (isSubmitted) {
      setIsSubmitted(false);
    } else {
      setIsSubmitted(true);
      setShowToast(true);
    }
  };

  return (
    <section className={clsx('', className)}>
      <h2 className="mb-6 text-small18 font-bold text-neutral-0">
        미션 제출하기
      </h2>

      {/* 블로그 링크 */}
      <section>
        <div className="mb-1.5">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xsmall16 font-semibold text-neutral-0">
              블로그 링크
            </span>
          </div>
          <div className="rounded bg-neutral-95 px-3 py-3 text-xsmall14 text-neutral-10">
            링크가 잘 열리는지 확인해주세요.
          </div>
        </div>
        <textarea
          className={clsx(
            'w-full resize-none rounded-xxs border border-neutral-80 bg-white',
            'px-3 py-2 text-base text-neutral-0 placeholder:text-neutral-50',
            'h-[44px] outline-none focus:border-primary',
            'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
          )}
          placeholder={'링크를 입력해주세요.'}
          value={textareaValue}
          onChange={handleTextareaChange}
          disabled={isSubmitted}
        />
      </section>

      {/* 리워드 받을 계좌번호 */}
      <section>
        <div className="mb-1.5">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xsmall16 font-semibold text-neutral-0">
              리워드 받을 계좌번호
            </span>
          </div>
          <div className="rounded bg-neutral-95 px-3 py-3 text-xsmall14 text-neutral-10">
            리워드 받을 은행과 계좌번호를 입력해주세요. 본인 명의가 아닌
            계좌로는 리워드가 입금되지 않습니다.
          </div>
        </div>
        {/* 은행 선택 드롭박스 들어가야함 */}
        <textarea
          className={clsx(
            'w-full resize-none rounded-xxs border border-neutral-80 bg-white',
            'px-3 py-2 text-base text-neutral-0 placeholder:text-neutral-50',
            'h-[44px] outline-none focus:border-primary',
            'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
          )}
          placeholder={'계좌번호를 입력해주세요.'}
          value={textareaValue}
          onChange={handleTextareaChange}
          disabled={isSubmitted}
        />
      </section>

      {/* 개인정보 활용 동의 */}
      <section>
        <div className="mb-1.5">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xsmall16 font-semibold text-neutral-0">
              개인정보 활용 동의
            </span>
          </div>
          <div className="rounded bg-neutral-95 px-3 py-3 text-xsmall14 text-neutral-10">
            [개인정보 보호법] 제15조 및 제17조에 따라 아래의 내용으로 개인정보를
            수집, 이용 및 제공하는데 동의합니다.
            <br /> □ 개인정보의 수집 및 이용에 관한 사항
            <br /> ✓ 수집하는 개인정보 항목 : 성명, 전화번호, 계좌번호
            <br /> ✓ 개인정보의 이용 목적 : 렛츠커리어 프로그램 후기 리워드 지급
          </div>
        </div>
        {/* 리워드 지급을 위한 개인정보 활용에 동의합니다 */}
      </section>

      <MissionSubmitButton
        isSubmitted={isSubmitted}
        hasContent={textareaValue.trim().length > 0}
        onButtonClick={handleSubmit}
      />

      <MissionToast isVisible={showToast} onClose={() => setShowToast(false)} />
    </section>
  );
};

export default MissionSubmitBonusSection;
