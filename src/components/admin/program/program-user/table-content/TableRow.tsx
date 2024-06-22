import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Checkbox } from '@mui/material';

import axios from '../../../../../utils/axios';
import TD from '../../../ui/table/regacy/TD';
import parseGrade from '../../../../../utils/parseGrade';
import { ApplicationType } from '../../../../../pages/admin/program/ProgramUsers';
import { gradeToText } from '../../../../../utils/convert';

interface Props {
  application: ApplicationType;
  handleApplicationStatusChange: any;
  programType: string;
}

const TableRow = ({ application, programType }: Props) => {
  const queryClient = useQueryClient();

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일 ${date.getHours() >= 12 ? '오후' : '오전'} ${
      date.getHours() % 12
    }시${date.getMinutes() !== 0 && ` ${date.getMinutes()}분`}`;
  };

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
          <TD>{gradeToText[application.grade]}</TD>
          <TD>{application.major}</TD>
          <TD whiteSpace="wrap">{application.motivate}</TD>
          <TD whiteSpace="wrap">{application.question}</TD>
        </>
      )}
      <TD>{application.couponName || '없음'}</TD>
      <TD>{application.totalCost.toLocaleString()}원</TD>
      <TD whiteSpace="wrap">
        <Checkbox
          checked={application.isConfirmed}
          onChange={() => editIsFeeConfirmed.mutate()}
        />
      </TD>
      <TD>
        {application.createDate
          ? formatDateString(application.createDate)
          : formatDateString(application.created_date)}
      </TD>
    </tr>
  );
};

export default TableRow;
