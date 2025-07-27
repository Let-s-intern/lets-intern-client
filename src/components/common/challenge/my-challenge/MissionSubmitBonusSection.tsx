import { clsx } from 'clsx';
import { useState } from 'react';
import AgreementCheckbox from './AgreementCheckbox';
import BankSelectDropdown from './BankSelectDropdown';
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
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setAccountNumber(e.target.value);
  };

  const handleSubmit = () => {
    if (isSubmitted) {
      setIsSubmitted(false);
    } else {
      setIsSubmitted(true);
      setShowToast(true);
    }
  };

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
  };

  return (
    <section className={clsx('', className)}>
      <h2 className="mb-6 text-small18 font-bold text-neutral-0">
        미션 제출하기
      </h2>
      <div className="mb-1.5">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xsmall16 font-semibold text-neutral-0">
            챌린지 참여 목표
          </span>
        </div>
        <div className="rounded bg-neutral-95 px-3 py-3 text-xsmall14 text-neutral-10">
          미션 제출 후, 작성한 챌린지 목표를 카카오톡 오픈채팅방에 공유해주세요.
        </div>
      </div>
      <textarea
        className={clsx(
          'w-full resize-none rounded-xxs border border-neutral-80 bg-white',
          'p-3 text-base text-neutral-0 placeholder:text-neutral-50',
          'min-h-[120px] outline-none focus:border-primary',
          'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
        )}
        placeholder={
          '챌린지를 신청한 목적과 계기,\n또는 챌린지 참여를 통해 이루고 싶은 목표를 자유롭게 작성해주세요.'
        }
        value={textareaValue}
        onChange={handleTextareaChange}
        disabled={isSubmitted}
      />

      {/* 리워드 받을 계좌번호 */}
      <div className="mt-4 flex flex-col gap-1">
        <span className="text-xsmall16 font-semibold text-neutral-0">
          리워드 받을 계좌번호
        </span>
        <div className="flex flex-row gap-1">
          <BankSelectDropdown
            selectedBank={selectedBank}
            onBankSelect={handleBankSelect}
            disabled={isSubmitted}
          />
          <textarea
            className={clsx(
              'w-full resize-none rounded-xxs border border-neutral-80 bg-white',
              'px-3 py-2 text-base text-neutral-0 placeholder:text-neutral-50',
              'h-[44px] outline-none focus:border-primary',
              'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
            )}
            placeholder={'계좌번호를 입력해주세요.'}
            value={accountNumber}
            onChange={handleAccountNumberChange}
            disabled={isSubmitted}
          />
        </div>
      </div>

      {/* 개인정보 활용 동의 */}
      <div className="mt-4 flex flex-col gap-1">
        <span className="text-xsmall16 font-semibold text-neutral-0">
          개인정보 활용 동의
        </span>
        <div className="rounded bg-neutral-95 px-3 py-3 text-xsmall14 text-neutral-10">
          [개인정보 보호법] 제15조 및 제17조에 따라 아래의 내용으로 개인정보를
          수집, 이용 및 제공하는데 동의합니다.
          <br /> □ 개인정보의 수집 및 이용에 관한 사항 <br />
          ✓ 수집하는 개인정보 항목 : 성명, 전화번호, 계좌번호 <br />
          ✓ 개인정보의 이용 목적 : 렛츠커리어 프로그램 후기 리워드 지급 <br />
        </div>
        <div className="mt-2">
          <AgreementCheckbox
            checked={isAgreed}
            onCheckedChange={setIsAgreed}
            disabled={isSubmitted}
          />
        </div>
      </div>

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
