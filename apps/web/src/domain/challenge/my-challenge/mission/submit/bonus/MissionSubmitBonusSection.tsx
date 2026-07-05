import LinkInputSection from '@/domain/challenge/my-challenge/mission/submit/ui/LinkInputSection';
import MissionSubmitButton from '@/domain/challenge/my-challenge/mission/ui/MissionSubmitButton';
import MissionToast from '@/domain/challenge/my-challenge/mission/ui/MissionToast';
import BankSelectDropdown from '@/domain/challenge/my-challenge/ui/BankSelectDropdown';
import LinkChangeConfirmationModal from '@/domain/challenge/ui/LinkChangeConfirmationModal';
import { twMerge } from '@/lib/twMerge';
import { Schedule } from '@/schema';
import { clsx } from 'clsx';
import { ReactNode } from 'react';
import AgreementSection from '../agreement/AgreementSection';
import { useMissionSubmitBonus } from '../hooks/useMissionSubmitBonus';

const DescriptionBox = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={twMerge(
      'rounded-xxs bg-neutral-95 text-xsmall14 text-neutral-10 p-3',
      className,
    )}
  >
    {children}
  </p>
);

interface MissionSubmitBonusSectionProps {
  className?: string;
  selectedMissionTh: number;
  missionId?: number;
  attendanceInfo?: Schedule['attendanceInfo'] | null;
}

const MissionSubmitBonusSection = ({
  className,
  missionId,
  attendanceInfo,
}: MissionSubmitBonusSectionProps) => {
  const {
    isSubmitted,
    isEditing,
    showToast,
    selectedBank,
    accountNumber,
    isAgreed,
    isMarketingAgreed,
    linkValue,
    isLinkChangeModalOpen,
    isSubmitPeriodEnded,
    isResubmitBlocked,
    disabled,
    canSubmit,
    setShowToast,
    setIsAgreed,
    setIsMarketingAgreed,
    setIsLinkChangeModalOpen,
    handleAccountNumberChange,
    handleLinkChange,
    handleLinkVerified,
    handleSubmit,
    handleBankSelect,
    handleSaveEdit,
    handleCancelEdit,
    handleConfirmLinkChange,
  } = useMissionSubmitBonus({ missionId, attendanceInfo });

  return (
    <>
      <section className={clsx('', className)}>
        <h2 className="text-small18 text-neutral-0 mb-6 font-bold">
          미션 제출하기
        </h2>

        <div className="mt-6">
          <LinkInputSection
            initialLink={linkValue}
            disabled={disabled}
            onLinkChange={handleLinkChange}
            onLinkVerified={handleLinkVerified}
            text="링크가 잘 열리는지 확인해주세요."
          />
        </div>

        <div className="mt-7 flex flex-col">
          <span className="text-xsmall16 text-neutral-0 font-semibold">
            리워드 받을 계좌번호
          </span>
          <DescriptionBox className="mt-1">
            리워드 받을 은행과 계좌번호를 입력해주세요. 본인 명의가 아닌
            계좌이거나 올바르지 않은 계좌번호로는 리워드가 입금되지 않습니다.
          </DescriptionBox>
          <div className="mt-3 flex flex-col gap-1 md:flex-row">
            <BankSelectDropdown
              selectedBank={selectedBank}
              onBankSelect={handleBankSelect}
              disabled={disabled}
            />
            <input
              type="number"
              className={clsx(
                'rounded-xxs border-neutral-80 w-full resize-none border bg-white',
                'text-neutral-0 px-3 py-2 text-base placeholder:text-neutral-50',
                'focus:border-primary h-[44px] outline-none',
                'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
              )}
              placeholder={'계좌번호를 입력해주세요.'}
              value={accountNumber}
              onChange={handleAccountNumberChange}
              disabled={disabled}
            />
          </div>
        </div>

        <AgreementSection
          title="개인정보 활용 동의"
          description={
            <>
              [개인정보 보호법] 제15조 및 제17조에 따라 아래의 내용으로
              개인정보를 수집, 이용 및 제공하는데 동의합니다.
              <br /> □ 개인정보의 수집 및 이용에 관한 사항 <br />
              ✓ 수집 항목 : 성명, 전화번호, 계좌번호 <br />
              ✓ 수집 및 이용 목적 : 후기 이벤트 리워드 지급 및 지급 내역 확인
              <br />
              ✓ 보유 및 이용 기간 : 리워드 지급일로부터 1년
              <br />
            </>
          }
          checked={isAgreed}
          onCheckedChange={setIsAgreed}
          disabled={isSubmitted}
        />

        <AgreementSection
          title="마케팅 활용 동의"
          description={
            <>
              □ 개인정보 및 저작물 활용에 관한 사항 <br />
              ✓ 활용 개인정보 : 블로그에 공개적으로 표시된 닉네임, 프로필
              이미지, URL 주소 등 공개된 계정 정보 <br />
              ✓ 활용 저작물 : 링크 입력을 통해 제출한 블로그 후기(텍스트,
              이미지, 영상, 초상 등 일체)
              <br />
              ✓ 활용 목적 : 렛츠커리어 서비스 및 프로그램 홍보 및 광고, 마케팅
              <br />
              ✓ 활용 방법 및 범위 : <br /> - 2차 저작물 제작
              <br />- 렛츠커리어 웹사이트, 홍보물·광고, SNS 등 마케팅 채널에
              노출
              <br />
              ✓ 활용 기간 : 영구적 활용
              <br />
            </>
          }
          checked={isMarketingAgreed}
          onCheckedChange={setIsMarketingAgreed}
          disabled={isSubmitted}
          checkboxLabel="마케팅 활용에 동의합니다."
        />

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

      <LinkChangeConfirmationModal
        isOpen={isLinkChangeModalOpen}
        onClose={() => setIsLinkChangeModalOpen(false)}
        onClickCancel={() => setIsLinkChangeModalOpen(false)}
        onClickConfirm={handleConfirmLinkChange}
      />
    </>
  );
};

export default MissionSubmitBonusSection;
