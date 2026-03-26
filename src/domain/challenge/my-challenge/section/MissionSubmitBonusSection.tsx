import { usePatchAttendance } from '@/api/attendance/attendance';
import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge/challenge';
import { useSubmitMissionBlogBonus } from '@/api/mission/mission';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { Schedule } from '@/schema';
import { clsx } from 'clsx';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import LinkChangeConfirmationModal from '../../LinkChangeConfirmationModal';
import AgreementCheckbox from '../mission/AgreementCheckbox';
import BankSelectDropdown from '../mission/BankSelectDropdown';
import MissionSubmitButton from '../mission/MissionSubmitButton';
import MissionToast from '../mission/MissionToast';
import LinkInputSection from './LinkInputSection';

const DescriptionBox = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={twMerge(
        'rounded-xxs bg-neutral-95 p-3 text-xsmall14 text-neutral-10',
        className,
      )}
    >
      {children}
    </p>
  );
};

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
  const { currentChallenge, refetchSchedules } = useCurrentChallenge();
  const { data: missionData } = useChallengeMissionAttendanceInfoQuery({
    challengeId: currentChallenge?.id,
    missionId,
    enabled: !!currentChallenge?.id && !!missionId,
  });

  //  각 미션 생성 시 설정한 개별 마감일 그대로 적용
  const isSubmitPeriodEnded = missionData?.missionInfo?.endDate
    ? missionData.missionInfo.endDate.isBefore(dayjs())
    : true; // endDate가 없으면 마감된 것으로 처리

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
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [isLinkVerified, setIsLinkVerified] = useState(false);
  // 링크 변경 확인 모달 오픈 상태
  const [isLinkChangeModalOpen, setIsLinkChangeModalOpen] = useState(false);

  // 블로그 보너스 제출 mutation
  const submitBlogBonus = useSubmitMissionBlogBonus();
  const patchAttendance = usePatchAttendance();

  const disabled = isSubmitted && !isEditing;

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputChar = (e.nativeEvent as InputEvent).data; // 연속으로 숫자가 아닌 문자를 입력하면 두 번째에 null로 뜸
    const isNotNumber = inputChar && !/^[0-9]$/.test(inputChar);
    if (isNotNumber) return;

    const value = e.target.value;
    setAccountNumber(value.replace(/[^0-9]/g, ''));
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
      return;
    }

    if (!missionId) {
      console.error('미션 ID가 없습니다.');
      return;
    }

    try {
      // 제출 시에만 숫자만 추출
      const cleanAccountNumber = accountNumber.replace(/[^0-9]/g, '');

      await submitBlogBonus.mutateAsync({
        missionId,
        url: linkValue,
        accountType: selectedBank,
        accountNum: cleanAccountNumber,
      });
      await refetchSchedules?.();
      setIsSubmitted(true);
      setShowToast(true);
    } catch (error) {
      console.error('제출 실패:', error);
    }
  };

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
  };

  const handleSaveEdit = async () => {
    if (!attendanceInfo?.id) return;

    try {
      await patchAttendance.mutateAsync({
        attendanceId: attendanceInfo.id,
        link: linkValue,
        accountNum: accountNumber,
        accountType: selectedBank,
      });
      await refetchSchedules?.();
      setIsEditing(false);
      setShowToast(true);
    } catch (error) {
      console.error('미션 수정 실패:', error);
    }
  };

  const handleCancelEdit = () => {
    const isChanged =
      attendanceInfo?.link !== linkValue ||
      attendanceInfo?.accountType !== selectedBank ||
      attendanceInfo?.accountNum !== accountNumber;
    // 입력값이 이전 링크와 다르면 모달 띄우기
    if (isChanged) {
      setIsLinkChangeModalOpen(true);
    } else {
      setIsEditing(false);
    }
  };

  const initValues = useCallback(() => {
    setLinkValue(attendanceInfo?.link ?? '');
    setSelectedBank(attendanceInfo?.accountType ?? '');
    setAccountNumber(attendanceInfo?.accountNum ?? '');
    setIsAgreed(attendanceInfo?.submitted ?? false);
    setIsMarketingAgreed(attendanceInfo?.submitted ?? false);
    setIsSubmitted(attendanceInfo?.submitted ?? false);
  }, [attendanceInfo]);

  // 제출 버튼 활성화 조건: 링크 확인 완료 + 은행 선택 + 계좌번호 입력 + 개인정보 동의
  const cleanAccountNumber = accountNumber.replace(/[^0-9]/g, '');
  const canSubmit =
    isAgreed &&
    isMarketingAgreed &&
    isLinkVerified &&
    selectedBank.trim().length > 0 &&
    cleanAccountNumber.length > 0;

  useEffect(() => {
    /** 상태 초기화 */
    initValues();
  }, [attendanceInfo, initValues]);

  return (
    <>
      <section className={clsx('', className)}>
        <h2 className="mb-6 text-small18 font-bold text-neutral-0">
          미션 제출하기
        </h2>

        {/* 블로그 링크 섹션 */}
        <div className="mt-6">
          <LinkInputSection
            initialLink={linkValue}
            disabled={disabled}
            onLinkChange={handleLinkChange}
            onLinkVerified={handleLinkVerified}
            text="링크가 잘 열리는지 확인해주세요."
          />
        </div>

        {/* 리워드 받을 계좌번호 */}
        <div className="mt-7 flex flex-col">
          <span className="text-xsmall16 font-semibold text-neutral-0">
            리워드 받을 계좌번호
          </span>
          <DescriptionBox className="mt-1">
            리워드 받을 은행과 계좌번호를 입력해주세요. 본인 명의가 아닌
            계좌로는 리워드가 입금되지 않습니다.
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
                'w-full resize-none rounded-xxs border border-neutral-80 bg-white',
                'px-3 py-2 text-base text-neutral-0 placeholder:text-neutral-50',
                'h-[44px] outline-none focus:border-primary',
                'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
              )}
              placeholder={'계좌번호를 입력해주세요.'}
              value={accountNumber}
              onChange={handleAccountNumberChange}
              disabled={disabled}
            />
          </div>
        </div>

        {/* 개인정보 활용 동의 */}
        <div className="mt-7 flex flex-col gap-1">
          <span className="text-xsmall16 font-semibold text-neutral-0">
            개인정보 활용 동의
          </span>
          <DescriptionBox>
            [개인정보 보호법] 제15조 및 제17조에 따라 아래의 내용으로 개인정보를
            수집, 이용 및 제공하는데 동의합니다.
            <br /> □ 개인정보의 수집 및 이용에 관한 사항 <br />
            ✓ 수집 항목 : 성명, 전화번호, 계좌번호 <br />
            ✓ 수집 및 이용 목적 : 후기 이벤트 리워드 지급 및 지급 내역 확인
            <br />
            ✓ 보유 및 이용 기간 : 리워드 지급일로부터 1년
            <br />
          </DescriptionBox>
          <div className="mt-2">
            <AgreementCheckbox
              checked={isAgreed}
              onCheckedChange={setIsAgreed}
              disabled={isSubmitted}
            />
          </div>
        </div>

        {/* 마케팅 활용 동의 */}
        <div className="mt-7 flex flex-col gap-1">
          <span className="text-xsmall16 font-semibold text-neutral-0">
            마케팅 활용 동의
          </span>
          <DescriptionBox>
            □ 개인정보 및 저작물 활용에 관한 사항 <br />
            ✓ 활용 개인정보 : 블로그에 공개적으로 표시된 닉네임, 프로필 이미지,
            URL 주소 등 공개된 계정 정보 <br />
            ✓ 활용 저작물 : 링크 입력을 통해 제출한 블로그 후기(텍스트, 이미지,
            영상, 초상 등 일체)
            <br />
            ✓ 활용 목적 : 렛츠커리어 서비스 및 프로그램 홍보 및 광고, 마케팅
            <br />
            ✓ 활용 방법 및 범위 : <br /> - 2차 저작물 제작
            <br />- 렛츠커리어 웹사이트, 홍보물·광고, SNS 등 마케팅 채널에 노출
            <br />
            ✓ 활용 기간 : 영구적 활용
            <br />
          </DescriptionBox>
          <div className="mt-2">
            <AgreementCheckbox
              checked={isMarketingAgreed}
              onCheckedChange={setIsMarketingAgreed}
              disabled={isSubmitted}
            >
              마케팅 활용에 동의합니다.
            </AgreementCheckbox>
          </div>
        </div>
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
        onClickConfirm={() => {
          initValues();
          setIsEditing(false);
          setIsLinkVerified(false);
          setIsLinkChangeModalOpen(false);
        }}
      />
    </>
  );
};

export default MissionSubmitBonusSection;
