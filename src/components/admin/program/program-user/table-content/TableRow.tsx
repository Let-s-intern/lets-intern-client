import { ChallengeApplication, LiveApplication } from '@/schema';
import { gradeToText } from '@/utils/convert';
import TD from '../../../ui/table/regacy/TD';

interface Props {
  application: ChallengeApplication | LiveApplication;
  programType: string;
}

const TableRow = ({ application, programType }: Props) => {
  const createDate =
    'createDate' in application
      ? application.createDate
      : application.created_date;

  const amount =
    application.couponDiscount === -1
      ? 0
      : application.isCanceled
        ? // 보증금 금액 포함해야 함
          (application.programPrice ?? 0) +
          ((application as ChallengeApplication).refundPrice ?? 0) -
          (application.programDiscount ?? 0) -
          (application.finalPrice ?? 0) -
          (application.couponDiscount ?? 0)
        : (application.finalPrice ?? 0);

  return (
    <tr>
      <TD>{application.orderId}</TD>
      <TD>
        <span>{application.name}</span>
      </TD>
      <TD>{application.email}</TD>
      <TD>{application.phoneNum}</TD>
      {(programType === 'LIVE' || programType === 'VOD') && (
        <>
          <TD>{application.university}</TD>
          <TD>{application.grade ? gradeToText[application.grade] : ''}</TD>
          <TD>{application.major}</TD>
          <TD whiteSpace="wrap">
            {'motivate' in application ? application.motivate : ''}
          </TD>
          <TD whiteSpace="wrap">
            {'question' in application ? application.question : ''}
          </TD>
        </>
      )}
      <TD>{application.couponName || '없음'}</TD>
      <TD>{amount.toLocaleString()}원</TD>
      <TD whiteSpace="wrap">
        {application.isCanceled ? (
          <span className="font-bold">Y</span>
        ) : (
          <span className="text-gray-300">N</span>
        )}
        {/* <Checkbox disabled checked={application.isCanceled ?? false} /> */}
      </TD>
      <TD>{createDate.format('YYYY-MM-DD HH:mm')}</TD>
    </tr>
  );
};

export default TableRow;
