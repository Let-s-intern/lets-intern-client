import { usePaymentDetailQuery } from '@/api/payment';
import {
  ChallengeApplication,
  ChallengePricePlanEnum,
  LiveApplication,
  ProgramTypeEnum,
  ProgramTypeUpperCase,
} from '@/schema';
import { gradeToText } from '@/utils/convert';
import { useMemo } from 'react';
import TD from '../../../ui/table/regacy/TD';

const { CHALLENGE } = ProgramTypeEnum.enum;

interface Props {
  applicationItem: ChallengeApplication['application'] | LiveApplication;
  programType: ProgramTypeUpperCase;
}

const TableRow = ({ applicationItem, programType }: Props) => {
  const challengeAppItem =
    applicationItem as ChallengeApplication['application'];
  const liveAppItem = applicationItem as LiveApplication;

  const createDate = useMemo(() => {
    switch (programType) {
      case CHALLENGE:
        return challengeAppItem.createDate;
      default:
        return liveAppItem.created_date;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationItem, programType]);

  const { data: paymentDetail } = usePaymentDetailQuery(
    challengeAppItem.paymentId,
  );

  const amount = useMemo(() => {
    const { couponDiscount, isCanceled, finalPrice } = applicationItem;

    if (couponDiscount === -1) return 0;

    if (isCanceled) {
      const priceInfo = paymentDetail?.priceInfo;
      const deposit = challengeAppItem.refundPrice ?? 0; // 보증금
      const optionSellingPrice =
        (priceInfo?.option ?? 0) - (priceInfo?.optionDiscount ?? 0);
      const programSellingPrice =
        (applicationItem.programPrice ?? 0) -
        (applicationItem.programDiscount ?? 0);
      const refundedAmount = applicationItem.finalPrice ?? 0; // 사용자에게 환불해준 금액
      const refundDeductionAmount =
        programSellingPrice +
        optionSellingPrice +
        deposit -
        refundedAmount -
        (couponDiscount ?? 0); // 환불 차감 금액

      return refundDeductionAmount;
    }

    return finalPrice ?? 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationItem, paymentDetail]);

  return (
    <tr>
      <TD>{applicationItem.orderId}</TD>
      <TD>
        <span>{applicationItem.name}</span>
      </TD>
      <TD>{applicationItem.email}</TD>
      <TD>{applicationItem.phoneNum}</TD>
      {(programType === 'LIVE' || programType === 'VOD') && (
        <>
          <TD>{applicationItem.university}</TD>
          <TD>
            {applicationItem.grade ? gradeToText[applicationItem.grade] : ''}
          </TD>
          <TD>{applicationItem.major}</TD>
          <TD whiteSpace="wrap">{liveAppItem.motivate ?? ''}</TD>
          <TD whiteSpace="wrap">{liveAppItem.question ?? ''}</TD>
        </>
      )}
      {/* 결제 상품 */}
      <TD>{applicationItem.couponName ?? '없음'}</TD>
      {programType === CHALLENGE && (
        <TD>
          {challengeAppItem.challengePricePlanType ??
            ChallengePricePlanEnum.enum.BASIC}
        </TD>
      )}
      {/* 결제금액 */}
      <TD>{amount.toLocaleString()}원</TD>
      <TD whiteSpace="wrap">
        {applicationItem.isCanceled ? (
          <span className="font-bold">Y</span>
        ) : (
          <span className="text-gray-300">N</span>
        )}
      </TD>
      <TD>{createDate.format('YYYY-MM-DD HH:mm')}</TD>
    </tr>
  );
};

export default TableRow;
