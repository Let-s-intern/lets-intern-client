import { Checkbox } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChallengeApplication, LiveApplication } from '../../../../../schema';

import axios from '../../../../../utils/axios';
import { gradeToText } from '../../../../../utils/convert';
import TD from '../../../ui/table/regacy/TD';

interface Props {
  application: ChallengeApplication | LiveApplication;
  programType: string;
}

const TableRow = ({ application, programType }: Props) => {
  const queryClient = useQueryClient();

  const editIsFeeConfirmed = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(
        `/payment/${application.paymentId}`,
        {
          isConfirmed: !application.isConfirmed,
        },
        {
          params: {
            type: programType,
          },
        },
      );
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [programType.toLowerCase()],
      });
    },
  });

  const updateIsRefunded = useMutation({
    mutationFn: async (refunded: boolean) => {
      const res = await axios.patch(
        `/payment/${application.paymentId}`,
        { isRefunded: refunded },
        { params: { type: programType } },
      );
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [programType.toLowerCase()],
      });
    },
  });

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
        <Checkbox
          checked={application.isConfirmed ?? false}
          onChange={() => editIsFeeConfirmed.mutate()}
        />
      </TD>
      <TD whiteSpace="wrap">
        <Checkbox
          checked={
            'isRefunded' in application
              ? application.isRefunded ?? false
              : false
          }
          onChange={(e) => {
            updateIsRefunded.mutate(e.target.checked);
          }}
        />
      </TD>
      <TD>{createDate.format('YYYY-MM-DD HH:mm')}</TD>
    </tr>
  );
};

export default TableRow;
