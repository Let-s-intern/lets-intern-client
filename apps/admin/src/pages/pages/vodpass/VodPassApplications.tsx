import { useMemo, useState } from 'react';

import {
  useVodPassApplicationsQuery,
  type VodPassApplication,
  type VodPassStatus,
} from '@/api/vodPassApplications';
import Table from '@/domain/admin/ui/table/regacy/Table';
import TD from '@/domain/admin/ui/table/regacy/TD';
import TH from '@/domain/admin/ui/table/regacy/TH';
import dayjs from '@/lib/dayjs';

const STATUS_LABEL: Record<VodPassStatus, string> = {
  UNACTIVATED: '미활성',
  SCHEDULED: '이용 예정',
  ACTIVE: '이용 중',
  EXPIRED: '만료',
  CANCELED: '취소',
};

const formatDateTime = (value?: string | null) =>
  value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-';

const matchesKeyword = (pass: VodPassApplication, keyword: string) =>
  [pass.name, pass.email, pass.phoneNum, pass.orderId].some((field) =>
    (field ?? '').toLowerCase().includes(keyword),
  );

/**
 * VOD 이용권 구매자 목록 (LC-3438).
 *
 * 구매 시점의 개월 수, 이용 기간, 결제액을 신청 최신순으로 보여준다.
 * 취소 건과 결제 없이 만든 기간 레코드도 상태 열로 구분해 함께 보여준다.
 */
const VodPassApplications = () => {
  const { data, isLoading, error } = useVodPassApplicationsQuery();
  const [keyword, setKeyword] = useState('');

  const passes = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!data || !normalized) return data ?? [];
    return data.filter((pass) => matchesKeyword(pass, normalized));
  }, [data, keyword]);

  const renderBody = () => {
    if (isLoading) return <p className="text-sm">불러오는 중입니다.</p>;

    if (error) {
      return (
        <p role="alert" className="text-sm text-red-500">
          {error instanceof Error && error.message
            ? error.message
            : '구매자 목록을 불러오지 못했습니다.'}
        </p>
      );
    }

    return (
      <>
        <div className="mb-4 flex items-center gap-4">
          <input
            type="search"
            aria-label="구매자 검색"
            placeholder="이름, 이메일, 휴대폰, 주문번호 검색"
            className="rounded-xxs focus:border-primary w-80 border border-neutral-300 px-3 py-2 text-sm outline-none"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <span className="text-sm">총 {passes.length}건</span>
        </div>
        <Table minWidth={1200}>
          <thead>
            <tr>
              <TH>주문번호</TH>
              <TH>이름</TH>
              <TH>이메일</TH>
              <TH>휴대폰 번호</TH>
              <TH>구매 개월</TH>
              <TH>이용 시작</TH>
              <TH>이용 종료</TH>
              <TH>상태</TH>
              <TH>결제금액</TH>
              <TH>신청일시</TH>
            </tr>
          </thead>
          <tbody>
            {passes.map((pass) => (
              <tr key={pass.applicationId}>
                <TD>{pass.orderId ?? '-'}</TD>
                <TD>{pass.name ?? '-'}</TD>
                <TD>{pass.email ?? '-'}</TD>
                <TD>{pass.phoneNum ?? '-'}</TD>
                <TD>
                  {pass.purchasedMonths ? `${pass.purchasedMonths}개월` : '-'}
                </TD>
                <TD>{formatDateTime(pass.startsAt)}</TD>
                <TD>{formatDateTime(pass.endsAt)}</TD>
                <TD>{STATUS_LABEL[pass.status]}</TD>
                <TD>
                  {pass.paidAmount == null
                    ? '-'
                    : `${pass.paidAmount.toLocaleString()}원`}
                </TD>
                <TD>{formatDateTime(pass.createDate)}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
        {passes.length === 0 && (
          <p className="mt-4 text-sm">조건에 맞는 구매자가 없습니다.</p>
        )}
      </>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-1.5-bold mb-6">VOD 이용권 구매자</h1>
      {renderBody()}
    </div>
  );
};

export default VodPassApplications;
