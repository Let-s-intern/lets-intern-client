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
  applicationItem: ChallengeApplication | LiveApplication;
  programType: ProgramTypeUpperCase;
}

const TableRow = ({ applicationItem, programType }: Props) => {
  const challengeApp = applicationItem as ChallengeApplication;
  const liveAppItem = applicationItem as LiveApplication;
  const applicationInfo =
    programType === 'CHALLENGE' ? challengeApp.application : liveAppItem;

  const createDate = useMemo(() => {
    switch (programType) {
      case CHALLENGE:
        return challengeApp.application.createDate;
      default:
        return liveAppItem.created_date;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationItem, programType]);

  const amount = useMemo(() => {
    /** 라이브 결제금액 */
    if (programType === 'LIVE') {
      const { couponDiscount, isCanceled, finalPrice } = liveAppItem;

      if (couponDiscount === -1) return 0;

      if (isCanceled) {
        const programSellingPrice =
          (liveAppItem.programPrice ?? 0) - (liveAppItem.programDiscount ?? 0);
        const refundDeductionAmount =
          programSellingPrice + -(couponDiscount ?? 0); // 환불 차감 금액

        return refundDeductionAmount;
      }

      return finalPrice ?? 0;
    }

    /** 챌린지 결제금액 */
    const { couponDiscount, isCanceled, finalPrice } = challengeApp.application;
    if (couponDiscount === -1) return 0;

    if (isCanceled) {
      const deposit = challengeApp.application.refundPrice ?? 0; // 보증금
      const optionSellingPrice =
        (challengeApp.optionPriceSum ?? 0) -
        (challengeApp.optionDiscountPriceSum ?? 0);
      const programSellingPrice =
        (challengeApp.application.programPrice ?? 0) -
        (challengeApp.application.programDiscount ?? 0);
      const refundedAmount = challengeApp.application.finalPrice ?? 0; // 사용자에게 환불해준 금액
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
  }, [applicationItem, programType]);

  return (
    <tr>
      <TD>{applicationInfo.orderId}</TD>
      <TD>
        <span>{applicationInfo.name}</span>
      </TD>
      <TD>{applicationInfo.email}</TD>
      <TD>{applicationInfo.phoneNum}</TD>
      {(programType === 'LIVE' || programType === 'VOD') && (
        <>
          <TD>{applicationInfo.university}</TD>
          <TD>
            {applicationInfo.grade ? gradeToText[applicationInfo.grade] : ''}
          </TD>
          <TD>{applicationInfo.major}</TD>
          <TD whiteSpace="wrap">{liveAppItem.motivate ?? ''}</TD>
          <TD whiteSpace="wrap">{liveAppItem.question ?? ''}</TD>
        </>
      )}
      {/* 결제 상품 */}
      <TD>{applicationInfo.couponName ?? '없음'}</TD>
      {programType === CHALLENGE && (
        <TD>
          {challengeApp.application.challengePricePlanType ??
            ChallengePricePlanEnum.enum.BASIC}
        </TD>
      )}
      {/* 결제금액 */}
      <TD>{amount.toLocaleString()}원</TD>
      <TD whiteSpace="wrap">
        {applicationInfo.isCanceled ? (
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
