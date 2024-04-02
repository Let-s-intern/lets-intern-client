import clsx from 'clsx';
import { Icon } from '@iconify/react';

const CouponList = () => {
  const couponCellWidth = {
    type: 'w-32',
    name: 'w-32',
    code: 'flex-1',
    createdAt: 'w-40',
    validPeriod: 'w-60',
    management: 'w-40',
  };

  return (
    <div className="px-12 pt-12">
      <header className="px-3">
        <h1 className="text-2xl font-semibold">쿠폰 관리</h1>
      </header>
      <main className="mt-4">
        <div className="flex rounded-lg bg-[#E5E5E5]">
          <div
            className={clsx(
              'py-2 text-center text-sm font-medium text-[#717179]',
              couponCellWidth.type,
            )}
          >
            유형
          </div>
          <div
            className={clsx(
              'py-2 text-center text-sm font-medium text-[#717179]',
              couponCellWidth.name,
            )}
          >
            쿠폰명
          </div>
          <div
            className={clsx(
              'py-2 text-center text-sm font-medium text-[#717179]',
              couponCellWidth.code,
            )}
          >
            쿠폰코드
          </div>
          <div
            className={clsx(
              'py-2 text-center text-sm font-medium text-[#717179]',
              couponCellWidth.createdAt,
            )}
          >
            발급날짜
          </div>
          <div
            className={clsx(
              'py-2 text-center text-sm font-medium text-[#717179]',
              couponCellWidth.validPeriod,
            )}
          >
            유효기간
          </div>
          <div
            className={clsx(
              'py-2 text-center text-sm font-medium text-[#717179]',
              couponCellWidth.management,
            )}
          >
            관리
          </div>
        </div>
        <div className="mb-16 mt-3">
          <div className="flex rounded-md border border-neutral-200">
            <div
              className={clsx(
                'py-4 text-center text-sm text-zinc-600',
                couponCellWidth.type,
              )}
            >
              제휴
            </div>
            <div
              className={clsx(
                'py-4 text-center text-sm text-zinc-600',
                couponCellWidth.name,
              )}
            >
              임팩트닷커리어
            </div>
            <div
              className={clsx(
                'py-4 text-center text-sm text-zinc-600',
                couponCellWidth.code,
              )}
            >
              rootimpact2024
            </div>
            <div
              className={clsx(
                'py-4 text-center text-sm text-zinc-600',
                couponCellWidth.createdAt,
              )}
            >
              2024년 3월 23일
            </div>
            <div
              className={clsx(
                'py-4 text-center text-sm text-zinc-600',
                couponCellWidth.validPeriod,
              )}
            >
              2024년 3월 1일 ~ 2024년 12월 31일
            </div>
            <div
              className={clsx(
                'py-4 text-center text-sm text-zinc-600',
                couponCellWidth.management,
              )}
            >
              <img src="/icons/edit-icon.svg" alt="수정 아이콘" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CouponList;
