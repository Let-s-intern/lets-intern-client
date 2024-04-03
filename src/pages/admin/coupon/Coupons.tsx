import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CiTrash } from 'react-icons/ci';

import axios from '../../../utils/axios';
import { couponTypeToText } from '../../../utils/convert';

interface Coupon {
  code: string;
  couponType: string;
  createDate: string;
  startDate: string;
  endDate: string;
  name: string;
}

const Coupons = () => {
  const [couponList, setCouponList] = useState<Coupon[]>([]);

  useQuery({
    queryKey: ['coupon'],
    queryFn: async () => {
      const res = await axios.get('/coupon', {
        params: {
          page: 1,
          size: 10000,
        },
      });
      const data = res.data;
      console.log(data);
      setCouponList(data.couponList);
      return data;
    },
  });

  const couponCellWidth = {
    couponType: 'w-28',
    name: 'w-40',
    code: 'flex-1',
    // createdDate: 'w-40',
    validPeriod: 'w-60',
    management: 'w-48',
  };

  const formateDateString = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  return (
    <main className="px-12 pt-12">
      <header className="flex items-center justify-between px-3">
        <h1 className="text-2xl font-semibold">쿠폰 관리</h1>
        <Link
          to="/admin/coupons/new"
          className="rounded border border-zinc-600 bg-white px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
        >
          등록
        </Link>
      </header>
      <div className="mt-3">
        <div className="flex rounded-lg bg-[#E5E5E5]">
          <div
            className={clsx(
              'flex justify-center py-2 text-sm font-medium text-[#717179]',
              couponCellWidth.couponType,
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
          {/* <div
        className={clsx(
          'flex justify-center py-2 text-sm font-medium text-[#717179]',
          couponCellWidth.createdDate,
        )}
      >
        발급날짜
      </div> */}
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
          {couponList.map((coupon, index) => (
            <div
              key={index}
              className="flex rounded-md border border-neutral-200"
            >
              <div
                className={clsx(
                  'flex items-center justify-center py-4 text-sm text-zinc-600',
                  couponCellWidth.couponType,
                )}
              >
                {couponTypeToText[coupon.couponType]}
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
              {/* <div
            className={clsx(
              'flex items-center justify-center py-4 text-sm text-zinc-600',
              couponCellWidth.createdDate,
            )}
          >
            {coupon.createDate}
          </div> */}
              <div
                className={clsx(
                  'flex items-center justify-center py-4 text-sm text-zinc-600',
                  couponCellWidth.validPeriod,
                )}
              >
                {formateDateString(coupon.startDate)} ~{' '}
                {formateDateString(coupon.endDate)}
              </div>
              <div
                className={clsx(
                  'flex items-center justify-center py-4 text-sm text-zinc-600',
                  couponCellWidth.management,
                )}
              >
                <div className="flex items-center gap-4">
                  <Link to={`/admin/coupons/${index}/edit`}>
                    <i>
                      <img src="/icons/edit-icon.svg" alt="수정 아이콘" />
                    </i>
                  </Link>
                  <i className="text-[1.75rem]">
                    <CiTrash />
                  </i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Coupons;
