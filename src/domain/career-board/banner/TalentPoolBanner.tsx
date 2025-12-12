'use client';

import { usePatchUser, useUserQuery } from '@/api/user';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface TalentPoolBannerProps {
  hasCareerData?: boolean;
}

const TalentPoolBanner = ({ hasCareerData = false }: TalentPoolBannerProps) => {
  const { data: userData, isLoading: isUserLoading } = useUserQuery();
  const [isEnabled, setIsEnabled] = useState(false);
  const isDisabled = !hasCareerData || isUserLoading;
  // API에서 받은 isPoolUp 값으로 초기 상태 설정
  useEffect(() => {
    if (userData?.isPoolUp !== null && userData?.isPoolUp !== undefined) {
      setIsEnabled(userData.isPoolUp);
    }
  }, [userData?.isPoolUp]);

  const patchUserMutation = usePatchUser(
    () => {
      // 성공 시 상태는 invalidate로 자동 업데이트됨
    },
    (error) => {
      // 실패 시 이전 상태로 롤백
      setIsEnabled((prev) => !prev);
      // eslint-disable-next-line no-console
      console.error('인재풀 등록 상태 변경 실패:', error);
    },
  );

  const handleToggle = () => {
    if (isDisabled || !userData || patchUserMutation.isPending) return;

    const newValue = !isEnabled;
    // 낙관적 업데이트
    setIsEnabled(newValue);
    // 전체 유저 정보와 함께 isPoolUp 상태를 업데이트
    patchUserMutation.mutate({
      email: userData.email ?? undefined,
      name: userData.name ?? undefined,
      phoneNum: userData.phoneNum ?? undefined,
      university: userData.university ?? null,
      grade: userData.grade ?? null,
      major: userData.major ?? null,
      wishField: userData.wishField ?? null,
      wishJob: userData.wishJob ?? null,
      wishIndustry: userData.wishIndustry ?? null,
      wishEmploymentType: userData.wishEmploymentType ?? null,
      wishCompany: userData.wishCompany ?? null,
      marketingAgree: userData.marketingAgree ?? undefined,
      contactEmail: userData.contactEmail ?? null,
      accountType: userData.accountType ?? null,
      accountNum: userData.accountNum ?? null,
      inflowPath: userData.inflowPath ?? null,
      isPoolUp: newValue,
    });
  };

  const message = isEnabled
    ? '인재풀 등록 완료! 채용 제안 받을 준비가 끝났습니다.'
    : '인재풀 등록하고 채용 제안을 받아보세요!';

  const subMessage = isEnabled
    ? '당신의 커리어에 꼭 맞는 기업을 추천해드려요.'
    : '당신의 커리어에 꼭 맞는 기업을 추천해드려요.';

  return (
    <div className="w-full rounded-xs border border-primary-20 bg-gradient-to-b from-[#FBFCFF] via-[#FAFAFF] to-[#F7F8FF] px-4 py-3 md:px-4 md:py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xsmall14 font-medium text-[#333333]">{message}</p>
          <p className="text-xs text-[#666666] md:text-sm">{subMessage}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-medium text-[#5C5F66] md:block">
            인재풀 등록
          </span>
          <button
            type="button"
            onClick={handleToggle}
            disabled={isDisabled}
            className={clsx(
              'relative h-6 w-10 rounded-full transition-colors',
              {
                'bg-primary': isEnabled && !isDisabled,
                'bg-[#D1D1D1]': !isEnabled || isDisabled,
                'cursor-not-allowed opacity-50':
                  isDisabled || patchUserMutation.isPending,
                'cursor-pointer': !isDisabled && !patchUserMutation.isPending,
              },
            )}
            aria-label="인재풀 등록 토글"
            aria-checked={isEnabled}
            role="switch"
          >
            <span
              className={clsx(
                'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                {
                  'translate-x-4': isEnabled && !isDisabled,
                  'translate-x-0': !isEnabled || isDisabled,
                },
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TalentPoolBanner;
