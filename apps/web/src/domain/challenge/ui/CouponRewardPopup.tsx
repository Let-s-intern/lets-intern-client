'use client';

import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';
import BaseModal from '@/common/modal/BaseModal';
import { Dayjs } from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  challengeName: string;
  amount: number;
  endDate: Dayjs | null | undefined;
}

const CouponRewardPopup = ({
  isOpen,
  onClose,
  challengeName,
  amount,
  endDate,
}: Props) => {
  const router = useRouter();

  const handleConfirm = () => {
    onClose();
    router.push('/program?type=CHALLENGE');
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="mx-4 max-w-[560px]">
      <div className="flex flex-col items-center gap-4 px-5 pb-4 pt-12 md:pt-16">
        <p className="break-keep text-center text-small20 font-bold md:text-medium24">
          <span className="text-primary">재구매 할인 쿠폰</span>
          으로
          <br />
          <span className="text-primary">{challengeName}</span>를 더 저렴하게,
          <br />
          커리어 성장을 더 탄탄하게!
        </p>
        <div className="flex flex-col items-center pt-6">
          <div className="relative">
            <img
              src="/images/coupon.svg"
              alt=""
              className="w-40 md:w-[200px]"
            />
            <p className="absolute inset-0 flex items-center justify-center text-neutral-100">
              <span className="flex items-end gap-1">
                <span className="text-xlarge28 font-semibold md:text-xxlarge36">
                  {amount.toLocaleString()}
                </span>
                <span className="mb-1 text-xxsmall12 font-bold md:text-xsmall16">
                  원
                </span>
              </span>
            </p>
          </div>
          <div className="mt-[-13px] h-[32px] w-[267px] rounded-[50%] bg-primary-15 md:h-[40px] md:w-[334px]" />
        </div>
        <div className="flex flex-col pb-1 text-center text-xxsmall12 font-normal text-neutral-40 md:text-xsmall16">
          <p>
            *{' '}
            <Link
              href="/mypage/coupon"
              onClick={onClose}
              className="underline underline-offset-2 transition-colors hover:text-primary-80"
            >
              쿠폰함
            </Link>
            을 확인해보세요.
          </p>
          {endDate && (
            <p>* 유효기간 : ~ {endDate.format('YYYY년 MM월 DD일 HH시 mm분')}</p>
          )}
        </div>
        <hr className="-mx-5 w-[calc(100%+2.5rem)] border-neutral-85" />
        <div className="flex w-full gap-2">
          <OutlinedButton
            variant="secondary"
            className="flex-1 text-neutral-50"
            onClick={onClose}
          >
            닫기
          </OutlinedButton>
          <SolidButton className="flex-1" onClick={handleConfirm}>
            <span className="md:hidden">챌린지 구경하기</span>
            <span className="hidden md:inline">다음 챌린지 구경하기</span>
          </SolidButton>
        </div>
      </div>
    </BaseModal>
  );
};

export default CouponRewardPopup;
