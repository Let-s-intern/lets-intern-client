'use client';

import { useMyCoupons } from '@/api/coupon/coupon';
import PlusIcon from '@/assets/icons/plus.svg?react';
import { CategoryTabs } from '@letscareer/ui';
import { useState } from 'react';
import MoreButton from '../ui/button/MoreButton';
import CouponCard from './ui/CouponCard';
import CouponRegisterModal from './ui/CouponRegisterModal';

type CouponTab = 'AVAILABLE';

const COUPON_TAB_OPTIONS: { value: CouponTab; label: string }[] = [
  { value: 'AVAILABLE', label: '보유 쿠폰' },
];

const INITIAL_VISIBLE_COUNT = 4;

const CouponSection = () => {
  const [tab, setTab] = useState<CouponTab>('AVAILABLE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const { data: coupons = [] } = useMyCoupons();

  const viewList = showMore ? coupons : coupons.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <main className="flex w-full flex-col gap-6">
      <div className="-mx-5 -mt-[18px] flex items-center justify-between gap-2 md:mx-0 md:mt-0 md:gap-3">
        <CategoryTabs
          options={COUPON_TAB_OPTIONS}
          selected={tab}
          onChange={setTab}
        />
        <button
          className="text-xsmall14 border-primary-80 rounded-xxs hover:border-primary hover:text-primary text-primary-80 mr-5 flex flex-shrink-0 items-center gap-1 rounded border px-3 py-1.5 font-medium transition-colors md:mr-0"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
          쿠폰 등록
        </button>
      </div>
      <CouponRegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {coupons.length === 0 ? (
        <div className="flex min-h-[60vh] w-full flex-col items-center justify-center md:min-h-[50vh]">
          <p className="text-xsmall14 text-neutral-40 font-normal">
            보유하신 쿠폰이 없습니다
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 md:gap-5">
            {viewList.map((coupon) => (
              <CouponCard key={coupon.couponId} coupon={coupon} />
            ))}
          </div>
          {coupons.length > INITIAL_VISIBLE_COUNT && !showMore && (
            <MoreButton onClick={() => setShowMore(true)}>더보기</MoreButton>
          )}
        </>
      )}
    </main>
  );
};

export default CouponSection;
