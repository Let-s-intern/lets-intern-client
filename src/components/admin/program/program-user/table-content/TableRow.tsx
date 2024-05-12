import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Checkbox } from '@mui/material';

import axios from '../../../../../utils/axios';
import TD from '../../../ui/table/regacy/TD';
import parseGrade from '../../../../../utils/parseGrade';
import { useState } from 'react';

interface Props {
  application: any;
  program: any;
  handleApplicationStatusChange: any;
}

const TableRow = ({ program, application }: Props) => {
  const [isFeeConfirmed, setIsFeeConfirmed] = useState(
    application.application.feeIsConfirmed,
  );

  const editIsFeeConfirmed = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(
        `/application/admin/${application.application.id}`,
        {
          feeIsConfirmed: !isFeeConfirmed,
        },
      );
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      setIsFeeConfirmed(!isFeeConfirmed);
    },
  });

  return (
    <tr>
      <TD>
        {application.optionalInfo ? (
          <Link
            to={`/admin/users/${application.optionalInfo.userId}`}
            className="text-neutral-grey cursor-pointer underline"
          >
            {application.application.name}
          </Link>
        ) : (
          <span>{application.application.name}</span>
        )}
      </TD>
      <TD>{application.application.email}</TD>
      <TD>{application.application.phoneNum}</TD>
      {program.type === 'LETS_CHAT' && (
        <>
          <TD>{application.optionalInfo?.university}</TD>
          <TD>{parseGrade(application.application.grade)}</TD>
          <TD>{application.optionalInfo?.major}</TD>
          <TD whiteSpace="wrap">{application.application.applyMotive}</TD>
          <TD whiteSpace="wrap">{application.application.preQuestions}</TD>
        </>
      )}
      <TD>{application.application.couponName}</TD>
      <TD>{application.application.totalFee?.toLocaleString()}원</TD>
      <TD whiteSpace="wrap">
        <Checkbox
          checked={isFeeConfirmed}
          onChange={() => editIsFeeConfirmed.mutate()}
        />
      </TD>
      <TD>{application.application.createdAt}</TD>
    </tr>
  );
};

export default TableRow;
