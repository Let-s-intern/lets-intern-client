import { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import styled from 'styled-components';

import axios from '../../../../../utils/axios';
import TD from '../../../ui/table/regacy/TD';
import ActionButton from '../../../ui/button/ActionButton';
import { convertTypeToBank } from '../../../../../utils/convertTypeToBank';
import dayjs from 'dayjs';

export interface UserTableBodyProps {
  userList: {
    id: number;
    name: string;
    email: string;
    phoneNum: string;
    createdDate: string;
    accountType: string;
    accountNum: string;
    accountOwner: string;
  }[];
}

const TableBody = ({ userList }: UserTableBodyProps) => {
  return (
    <tbody>
      {userList.map((user) => (
        <tr key={user.id}>
          <TD>{user.name}</TD>
          <TD>{user.email}</TD>
          <TD>{user.phoneNum}</TD>
          {/* <TD>참여 프로그램 없음</TD> */}
          <TD>{dayjs(user.createdDate).format('YYYY-MM-DD (dd)')}</TD>
          <TD>{convertTypeToBank(user.accountType) || '없음'}</TD>
          <TD>{user.accountNum || '없음'}</TD>
          <TD>
            <div className="flex justify-center gap-2">
              <ActionButton to={`/admin/users/${user.id}`} bgColor="lightBlue">
                상세
              </ActionButton>
              <ActionButton to={`/admin/users/${user.id}/edit`} bgColor="green">
                수정
              </ActionButton>
              <ActionButton bgColor="red">삭제</ActionButton>
            </div>
          </TD>
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
