import {
  RefundMode,
  RefundTarget,
} from '@/domain/admin/program/program-user/ui/RefundModal';
import {
  resolveRefundableState,
  resolveRefundLabel,
} from '@/domain/admin/program/program-user/utils/refundState';
import Table from '@/domain/admin/ui/table/regacy/Table';
import TD from '@/domain/admin/ui/table/regacy/TD';
import TH, { THProps } from '@/domain/admin/ui/table/regacy/TH';
import { PassParticipant } from '@/domain/all-in-one-pass/types';
import dayjs from '@/lib/dayjs';
import { useMemo, useState } from 'react';

interface Props {
  participants: PassParticipant[];
  programTitle: string;
  onRefundClick: (target: RefundTarget, mode: RefundMode) => void;
  onUsedProgramsClick: (participant: PassParticipant) => void;
}

/**
 * 올인원패스 참여자 테이블. 기존 프로그램 참여자 테이블(Table/TH/TD)과 동일한 레이아웃 +
 * 환불 로직(refundState 재사용)에, 멤버십 전용 '이용 프로그램' 컬럼을 더한다.
 */
export default function ParticipantTable({
  participants,
  programTitle,
  onRefundClick,
  onUsedProgramsClick,
}: Props) {
  const [nameOrder, setNameOrder] = useState<THProps['inOrder']>(null);

  const handleNameHeadClick = () =>
    setNameOrder((prev) =>
      prev === 'ASCENDING'
        ? 'DESCENDING'
        : prev === 'DESCENDING'
          ? null
          : 'ASCENDING',
    );

  const rows = useMemo(() => {
    if (!nameOrder) return participants;
    const sorted = [...participants].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    return nameOrder === 'ASCENDING' ? sorted : sorted.reverse();
  }, [participants, nameOrder]);

  return (
    <Table minWidth={1180}>
      <colgroup>
        <col style={{ width: 130 }} /> {/* 주문번호 */}
        <col style={{ width: 50 }} /> {/* 이름 */}
        <col style={{ width: 150 }} /> {/* 소통용 이메일 */}
        <col style={{ width: 100 }} /> {/* 휴대폰 번호 */}
        <col style={{ width: 250 }} /> {/* 쿠폰명 */}
        <col style={{ width: 150 }} /> {/* 결제 상품 */}
        <col style={{ width: 80 }} /> {/* 결제금액 */}
        <col style={{ width: 90 }} /> {/* 환불여부 */}
        <col style={{ width: 100 }} /> {/* 신청일자 */}
        <col style={{ width: 50 }} /> {/* 이용 프로그램 */}
        <col style={{ width: 100 }} /> {/* 관리 */}
      </colgroup>
      <thead>
        <tr>
          <TH>주문번호</TH>
          <TH inOrder={nameOrder} onClick={handleNameHeadClick}>
            이름
          </TH>
          <TH>소통용 이메일</TH>
          <TH>휴대폰 번호</TH>
          <TH>쿠폰명</TH>
          <TH>결제 상품</TH>
          <TH>결제금액</TH>
          <TH>환불여부</TH>
          <TH>신청일자</TH>
          <TH>이용 프로그램</TH>
          <TH>관리</TH>
        </tr>
      </thead>
      <tbody>
        {rows.map((p) => {
          const amount = p.isCanceled
            ? (p.originalPrice ?? p.finalPrice)
            : p.finalPrice;

          const refundLabel = resolveRefundLabel({
            isCanceled: p.isCanceled,
            isAdminRefunded: p.isAdminRefunded,
            finalPrice: p.finalPrice,
            originalPrice: p.originalPrice,
          });

          const refundable = resolveRefundableState({
            isCanceled: p.isCanceled,
            hasUser: !!p.name,
            finalPrice: p.finalPrice,
          });

          const handleRefundClick = (mode: RefundMode) =>
            onRefundClick(
              {
                applicationId: p.id,
                name: p.name,
                email: p.email,
                phoneNum: p.phoneNum,
                programTitle,
                orderId: p.orderId,
                pricePlanType: null,
                couponName: p.couponName,
                couponDiscount: p.couponDiscount,
                finalPrice: p.finalPrice,
              },
              mode,
            );

          return (
            <tr key={p.id}>
              <TD>{p.orderId}</TD>
              <TD>{p.name}</TD>
              <TD>{p.email}</TD>
              <TD>{p.phoneNum}</TD>
              <TD>{p.couponName ?? '없음'}</TD>
              <TD>{p.productName}</TD>
              <TD>{amount.toLocaleString()}원</TD>
              <TD whiteSpace="wrap">
                {refundLabel.isAdmin ? (
                  <span className="font-bold text-red-600">
                    {refundLabel.text}
                  </span>
                ) : refundLabel.isRefunded ? (
                  <span className="font-medium">{refundLabel.text}</span>
                ) : (
                  <span className="text-gray-300">{refundLabel.text}</span>
                )}
              </TD>
              <TD>{dayjs(p.createDate).format('YYYY-MM-DD HH:mm')}</TD>
              <TD>
                <button
                  type="button"
                  className="border-primary text-primary hover:bg-primary-5 whitespace-nowrap rounded border px-2 py-1 text-xs"
                  onClick={() => onUsedProgramsClick(p)}
                >
                  조회
                </button>
              </TD>
              <TD textAlign="center">
                {refundable.canRefund ? (
                  <div className="flex justify-center gap-1">
                    <button
                      type="button"
                      className="whitespace-nowrap rounded border border-red-500 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      onClick={() => handleRefundClick('full')}
                    >
                      환불
                    </button>
                    <button
                      type="button"
                      className="whitespace-nowrap rounded border border-red-500 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:border-neutral-300 disabled:text-neutral-400 disabled:hover:bg-transparent"
                      onClick={() => handleRefundClick('partial')}
                      disabled={!refundable.canPartialRefund}
                      title={
                        refundable.canPartialRefund
                          ? undefined
                          : '실결제액이 0원이라 나눌 금액이 없습니다.'
                      }
                    >
                      부분환불
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">
                    {refundable.reason}
                  </span>
                )}
              </TD>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
