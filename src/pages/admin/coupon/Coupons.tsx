import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { CiTrash } from 'react-icons/ci';

import axios from '../../../utils/axios';

const Coupons = () => {
  useQuery({
    queryKey: ['coupon'],
    queryFn: async () => {
      const res = await axios.get('/coupon');
      const data = res.data;
      console.log(data);
      return data;
    },
  });

  const couponCellWidth = {
    type: 'w-32',
    name: 'w-32',
    code: 'flex-1',
    createdAt: 'w-40',
    validPeriod: 'w-60',
    management: 'w-40',
  };

  const couponList = [
    {
      id: 1,
      type: '제휴',
      name: '임팩트닷커리어',
      code: 'rootimpact2024',
      createdAt: '2024년 3월 23일',
      validPeriod: '2024년 3월 1일 ~ 2024년 12월 31일',
    },
    {
      id: 2,
      type: '제휴',
      name: '임팩트닷커리어1',
      code: 'rootimpact20241',
      createdAt: '2024년 3월 22일',
      validPeriod: '2024년 3월 2일 ~ 2024년 12월 30일',
    },
  ];

  return (
    <div className="px-12 pt-12">
      <header className="px-3">
        <h1 className="text-2xl font-semibold">쿠폰 관리</h1>
      </header>
      <main className="mt-3">
        <div className="flex rounded-lg bg-[#E5E5E5]">
          <div
            className={clsx(
              'flex justify-center py-2 text-sm font-medium text-[#717179]',
              couponCellWidth.type,
            )}
          >
            유형
          </div>
          <div
            className={clsx(
              'flex justify-center py-2 text-sm font-medium text-[#717179]',
              couponCellWidth.name,
            )}
          >
            쿠폰명
          </div>
          <div
            className={clsx(
              'flex justify-center py-2 text-sm font-medium text-[#717179]',
              couponCellWidth.code,
            )}
          >
            쿠폰코드
          </div>
          <div
            className={clsx(
              'flex justify-center py-2 text-sm font-medium text-[#717179]',
              couponCellWidth.createdAt,
            )}
          >
            발급날짜
          </div>
          <div
            className={clsx(
              'flex justify-center py-2 text-sm font-medium text-[#717179]',
              couponCellWidth.validPeriod,
            )}
          >
            유효기간
          </div>
          <div
            className={clsx(
              'flex justify-center py-2 text-sm font-medium text-[#717179]',
              couponCellWidth.management,
            )}
          >
            관리
          </div>
        </div>
        <div className="mb-16 mt-3 flex flex-col gap-2">
          {couponList.map((coupon) => (
            <div
              key={coupon.id}
              className="flex rounded-md border border-neutral-200"
            >
              <div
                className={clsx(
                  'flex items-center justify-center py-4 text-sm text-zinc-600',
                  couponCellWidth.type,
                )}
              >
                {coupon.type}
              </div>
              <div
                className={clsx(
                  'flex items-center justify-center py-4 text-sm text-zinc-600',
                  couponCellWidth.name,
                )}
              >
                {coupon.name}
              </div>
              <div
                className={clsx(
                  'flex items-center justify-center py-4 text-sm text-zinc-600',
                  couponCellWidth.code,
                )}
              >
                {coupon.code}
              </div>
              <div
                className={clsx(
                  'flex items-center justify-center py-4 text-sm text-zinc-600',
                  couponCellWidth.createdAt,
                )}
              >
                {coupon.createdAt}
              </div>
              <div
                className={clsx(
                  'flex items-center justify-center py-4 text-sm text-zinc-600',
                  couponCellWidth.validPeriod,
                )}
              >
                {coupon.validPeriod}
              </div>
              <div
                className={clsx(
                  'flex items-center justify-center py-4 text-sm text-zinc-600',
                  couponCellWidth.management,
                )}
              >
                <div className="flex items-center gap-4">
                  <i>
                    <img src="/icons/edit-icon.svg" alt="수정 아이콘" />
                  </i>
                  <i className="text-[1.75rem]">
                    <CiTrash />
                  </i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Coupons;
