import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import TD from '../TD';
import ActionButton from '../ActionButton';
import parsePhoneNum from '../../../utils/parsePhoneNum';
import axios from '../../../utils/axios';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

interface TableBodyProps {
  users: any[];
  setUsers: (users: any) => void;
  onDeleteUser: (userId: number) => void;
}

const TableBody = ({ users, setUsers, onDeleteUser }: TableBodyProps) => {
  const [openedMenu, setOpenedMenu] = useState<number | null>(null);
  const [userProgramList, setUserProgramList] = useState<any[]>([]);
  const [menuLoading, setMenuLoading] = useState<boolean>(false);
  const [managers, setManagers] = useState<any[]>([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await axios.get('/user/admin/manager');
        setManagers(res.data.managerList);
      } catch (err) {
        alert('매니저 불러오기를 실패하였습니다.');
      }
    };
    fetchManagers();
  }, []);

  useEffect(() => {
    if (!openedMenu) return;
    setMenuLoading(true);
    const fetchUserProgramList = async () => {
      try {
        const res = await axios.get(`/program/admin/user/${openedMenu}`);
        setUserProgramList(res.data.userProgramList);
      } catch (err) {
        console.log(err);
      } finally {
        setMenuLoading(false);
      }
    };
    fetchUserProgramList();
  }, [openedMenu]);

  const handleManagerChange = async (e: any, userId: number) => {
    try {
      const { value } = e.target;
      const newManagerId = value === '0' ? null : Number(value);
      await axios.patch(`/user/admin/${userId}`, {
        managerId: newManagerId,
      });
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            user.managerId = newManagerId;
          }
          return user;
        }),
      );
    } catch (err) {
      alert('담당 매니저 변경에 실패하였습니다.');
    }
  };

  return (
    <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          <TD>{user.name}</TD>
          <TD>{user.email}</TD>
          <TD>{user.phoneNum}</TD>
          <TD>
            <ViewButtonGroup>
              <ViewButtonContent>
                <ViewButton
                  onClick={() => {
                    if (openedMenu === user.id) {
                      setOpenedMenu(null);
                      setUserProgramList([]);
                      setMenuLoading(true);
                    } else {
                      setMenuLoading(true);
                      setOpenedMenu(user.id);
                    }
                  }}
                >
                  보기
                </ViewButton>
                {openedMenu === user.id && !menuLoading && (
                  <Menu>
                    {userProgramList.length === 0 ? (
                      <div>없음</div>
                    ) : (
                      <ul>
                        {userProgramList.map((program: any) => (
                          <li key={program.id}>{program.title}</li>
                        ))}
                      </ul>
                    )}
                  </Menu>
                )}
              </ViewButtonContent>
            </ViewButtonGroup>
          </TD>
          <TD>{user.signedUpAt}</TD>
          <TD textAlign="left">
            <FormControl sx={{ minWidth: '8rem' }}>
              <InputLabel id="managerId">담당 매니저</InputLabel>
              <Select
                labelId="managerId"
                id="managerId"
                label="담당 매니저"
                value={user.managerId ? user.managerId : 0}
                onChange={(e) => {
                  handleManagerChange(e, user.id);
                }}
              >
                <MenuItem value={0}>미지정</MenuItem>
                {managers.map((manager) => (
                  <MenuItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </TD>
          <TD>
            <ActionButtonGroup>
              <ActionButton to={`/admin/users/${user.id}/memo`} bgColor="blue">
                메모
              </ActionButton>
              <ActionButton to={`/admin/users/${user.id}`} bgColor="lightBlue">
                상세
              </ActionButton>
              <ActionButton to={`/admin/users/${user.id}/edit`} bgColor="green">
                수정
              </ActionButton>
              <ActionButton bgColor="red" onClick={() => onDeleteUser(user.id)}>
                삭제
              </ActionButton>
            </ActionButtonGroup>
          </TD>
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

const ViewButtonGroup = styled.div`
  display: flex;
  justify-content: center;
`;

const ViewButtonContent = styled.div`
  position: relative;
`;

const ViewButton = styled.button`
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const Menu = styled.div`
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  transform: translateX(2.5rem);
  background-color: #fff;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
  z-index: 100;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  min-width: 15rem;
  text-align: left;

  ul {
    list-style: disc;

    li {
      margin-left: 1rem;
    }
  }
`;
