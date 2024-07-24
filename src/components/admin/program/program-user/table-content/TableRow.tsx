import { ChallengeApplication, LiveApplication } from '../../../../../schema';

import { gradeToText } from '../../../../../utils/convert';
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

  return (
    <tr>
      <TD>
        {/* {application.optionalInfo ? (
          <Link
            to={`/admin/users/${application.optionalInfo.userId}`}
            className="text-neutral-grey cursor-pointer underline"
          >
            {application.name}
          </Link>
        ) : ( */}
        <span>{application.name}</span>
        {/* )} */}
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
      <TD>{application.totalCost?.toLocaleString()}원</TD>
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
