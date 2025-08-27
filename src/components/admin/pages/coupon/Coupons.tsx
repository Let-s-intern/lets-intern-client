'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { CiTrash } from 'react-icons/ci';
import Link from 'next/link';

import dayjs from '@/lib/dayjs';
import AlertModal from '@/components/ui/alert/AlertModal';
import axios from '@/utils/axios';
import { couponTypeToText } from '@/utils/convert';

interface Coupon {
  id: number;
  code: string;
  couponType: string;
  createDate: string;
  startDate: string;
  endDate: string;
  name: string;
}

const Coupons = () => {
  const queryClient = useQueryClient();

  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [couponIdForDelete, setCouponIdForDelete] = useState<number | null>(
    null,
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['coupon', 'admin'],
    queryFn: async () => {
      const res = await axios.get('/coupon/admin');
      return res.data;
    },
  });

  const couponList: Coupon[] = data?.data.couponList;

  const deleteCoupon = useMutation({
    mutationFn: async (couponId: number) => {
      const res = await axios.delete(`/coupon/${couponId}`);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['coupon'] });
      setCouponIdForDelete(null);
      setIsDeleteModalShown(false);
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

  const handleDeleteButtonClicked = (couponId: number) => {
    setCouponIdForDelete(couponId);
    setIsDeleteModalShown(true);
  };

  return (
    <>
      <main className="px-12 pt-12">
        <header className="flex items-center justify-between px-3">
          <h1 className="text-2xl font-semibold">쿠폰 관리</h1>
          <Link
            to="/admin/coupons/new"
            className="rounded-xxs border border-zinc-600 bg-white px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
          >
            등록
          </Link>
        </header>
        <div className="mt-3 min-w-[60rem]">
          <div className="flex rounded-sm bg-[#E5E5E5]">
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
          {isLoading ? (
            <div className="py-6 text-center">로딩 중...</div>
          ) : error ? (
            <div className="py-6 text-center">에러 발생</div>
          ) : couponList.length === 0 ? (
            <div className="py-6 text-center">쿠폰이 없습니다.</div>
          ) : (
            <div className="mb-16 mt-3 flex flex-col gap-2">
              {couponList.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex rounded-md border border-neutral-200"
                >
                  <div
                    className={clsx(
                      'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
                      couponCellWidth.couponType,
                    )}
                  >
                    {couponTypeToText[coupon.couponType]}
                  </div>
                  <div
                    className={clsx(
                      'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
                      couponCellWidth.name,
                    )}
                  >
                    {coupon.name}
                  </div>
                  <div
                    className={clsx(
                      'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
                      couponCellWidth.code,
                    )}
                  >
                    {coupon.code}
                  </div>
                  <div
                    className={clsx(
                      'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
                      couponCellWidth.validPeriod,
                    )}
                  >
                    {dayjs(coupon.startDate).format('YYYY년 MM월 DD일')} ~{' '}
                    {dayjs(coupon.endDate).format('YYYY년 MM월 DD일')}
                  </div>
                  <div
                    className={clsx(
                      'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
                      couponCellWidth.management,
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Link to={`/admin/coupons/${coupon.id}/edit`}>
                        <i>
                          <img src="/icons/edit-icon.svg" alt="수정 아이콘" />
                        </i>
                      </Link>
                      <button
                        onClick={() => handleDeleteButtonClicked(coupon.id)}
                      >
                        <i className="text-[1.75rem]">
                          <CiTrash />
                        </i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {isDeleteModalShown && (
        <AlertModal
          title="쿠폰 삭제"
          onConfirm={() =>
            couponIdForDelete && deleteCoupon.mutate(couponIdForDelete)
          }
          onCancel={() => setIsDeleteModalShown(false)}
        >
          정말로 쿠폰을 삭제하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default Coupons;
