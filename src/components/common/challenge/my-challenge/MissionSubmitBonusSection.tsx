import { useSubmitMissionBlogBonus } from '@/api/mission';
import { Schedule } from '@/schema';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import AgreementCheckbox from './AgreementCheckbox';
import BankSelectDropdown from './BankSelectDropdown';
import LinkInputSection from './LinkInputSection';
import MissionSubmitButton from './MissionSubmitButton';
import MissionToast from './MissionToast';

interface MissionSubmitBonusSectionProps {
  className?: string;
  todayTh: number;
  missionId?: number;
  todayId?: number; // 선택된 미션의 ID
  attendanceInfo?: Schedule['attendanceInfo'] | null;
}

const MissionSubmitBonusSection = ({
  className,
  todayId,
  attendanceInfo,
}: MissionSubmitBonusSectionProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [isLinkVerified, setIsLinkVerified] = useState(false);

  // 블로그 보너스 제출 mutation
  const submitBlogBonus = useSubmitMissionBlogBonus();

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAccountNumber(e.target.value);
  };

  const handleLinkChange = (link: string) => {
    setLinkValue(link);
  };

  const handleLinkVerified = (isVerified: boolean) => {
    setIsLinkVerified(isVerified);
  };

  const handleSubmit = async () => {
    if (isSubmitted) {
      setIsSubmitted(false);
    } else {
      try {
        if (!todayId) {
          console.error('미션 ID가 없습니다.');
          return;
        }

        // 제출 시에만 숫자만 추출
        const cleanAccountNumber = accountNumber.replace(/[^0-9]/g, '');

        await submitBlogBonus.mutateAsync({
          missionId: todayId,
          url: linkValue,
          accountType: selectedBank,
          accountNum: cleanAccountNumber,
        });

        setIsSubmitted(true);
        setShowToast(true);
      } catch (error) {
        console.error('제출 실패:', error);
      }
    }
  };

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
  };

  // 제출 버튼 활성화 조건: 링크 확인 완료 + 은행 선택 + 계좌번호 입력 + 개인정보 동의
  const cleanAccountNumber = accountNumber.replace(/[^0-9]/g, '');
  const canSubmit =
    isAgreed &&
    isLinkVerified &&
    selectedBank.trim().length > 0 &&
    cleanAccountNumber.length > 0;

  useEffect(() => {
    /** 상태 초기화 */
    if (!attendanceInfo) return;
    setIsSubmitted(attendanceInfo.submitted ?? false);
    setLinkValue(attendanceInfo.link ?? '');
  }, [attendanceInfo]);

  return (
    <section className={clsx('', className)}>
      <h2 className="mb-6 text-small18 font-bold text-neutral-0">
        미션 제출하기
      </h2>

      {/* 블로그 링크 섹션 */}
      <div className="mt-7">
        <LinkInputSection
          initialLink={linkValue}
          disabled={isSubmitted}
          onLinkChange={handleLinkChange}
          onLinkVerified={handleLinkVerified}
          text="링크가 잘 열리는지 확인해주세요."
        />
      </div>

      {/* 리워드 받을 계좌번호 */}
      <div className="mt-4 flex flex-col gap-1">
        <span className="text-xsmall16 font-semibold text-neutral-0">
          리워드 받을 계좌번호
        </span>
        <div className="flex flex-col gap-1 md:flex-row">
          <BankSelectDropdown
            selectedBank={selectedBank}
            onBankSelect={handleBankSelect}
            disabled={isSubmitted}
          />
          <input
            type="number"
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

      {isSubmitted ? (
        <p className="mt-8 text-center text-small20 font-medium text-neutral-0">
          이미 보너스 미션에 참여했습니다.
        </p>
      ) : (
        <MissionSubmitButton
          isSubmitted={isSubmitted}
          hasContent={canSubmit}
          onButtonClick={handleSubmit}
        />
      )}

      <MissionToast isVisible={showToast} onClose={() => setShowToast(false)} />
    </section>
  );
};

export default MissionSubmitBonusSection;
