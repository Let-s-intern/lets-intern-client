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
  }, [applicationItem, programType]);

  const amount = useMemo(() => {
    return applicationItem.couponDiscount === -1
      ? 0
      : applicationItem.isCanceled
        ? // 보증금 금액 포함해야 함
          (applicationItem.programPrice ?? 0) +
          (challengeAppItem.refundPrice ?? 0) -
          (applicationItem.programDiscount ?? 0) -
          (applicationItem.finalPrice ?? 0) -
          (applicationItem.couponDiscount ?? 0)
        : (applicationItem.finalPrice ?? 0);
  }, [applicationItem]);

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
      <TD>{applicationItem.couponName ?? '없음'}</TD>
      {programType === CHALLENGE && (
        <TD>
          {challengeAppItem.challengePricePlanType ??
            ChallengePricePlanEnum.enum.BASIC}
        </TD>
      )}
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
