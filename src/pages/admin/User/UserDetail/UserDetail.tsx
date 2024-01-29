import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import axios from '../../../../utils/axios';
import ActionButton from '../../ActionButton';
import { convertTypeToBank } from '../../../../utils/convertTypeToBank';

const UserDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/user/admin/${params.userId}`);
        setUser(res.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <UserDetailBlock />;
  }

  if (error) {
    return <UserDetailBlock>에러 발생</UserDetailBlock>;
  }

  return (
    <UserDetailBlock>
      <div className="grid grid-cols-2 gap-4">
        {user.name && (
          <>
            <Label>이름</Label>
            <span>{user.name}</span>
          </>
        )}
        {user.email && (
          <>
            <Label>이메일</Label>
            <span>{user.email}</span>
          </>
        )}
        {user.phoneNum && (
          <>
            <Label>휴대폰 번호</Label>
            <span>{user.phoneNum}</span>
          </>
        )}

        {user.university && (
          <>
            <Label>학교</Label>
            <span>{user.university}</span>
          </>
        )}

        {user.grade && (
          <>
            <Label>전공</Label>
            <span>{user.grade}</span>
          </>
        )}
        {user.major && (
          <>
            <Label>전공</Label>
            <span>{user.major}</span>
          </>
        )}
        {user.wishJob && (
          <>
            <Label>관심직군</Label>
            <span>{user.wishJob}</span>
          </>
        )}
        {user.wishCompany && (
          <>
            <Label>희망기업</Label>
            <span>{user.wishCompany}</span>
          </>
        )}
        {user.accountType && (
          <>
            <Label>거래은행</Label>
            <span>{convertTypeToBank(user.accountType)}</span>
          </>
        )}
        {user.accountNumber && (
          <>
            <Label>계좌번호</Label>
            <span>{user.accountNumber}</span>
          </>
        )}
        {/* <Label>참여 프로그램 내역</Label>
        <Text>
          <ol>
            <li>챌린지 1기</li>
            <li>부트캠프 1기</li>
          </ol>
        </Text> */}
      </div>
      <div className="mt-10 flex gap-3">
        <ActionButton bgColor="gray" onClick={() => navigate(-1)}>
          이전
        </ActionButton>
        <ActionButton to={`/admin/users/${user.id}/edit`} bgColor="green">
          수정
        </ActionButton>
      </div>
    </UserDetailBlock>
  );
};

export default UserDetail;

const UserDetailBlock = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const Label = styled.span`
  font-weight: 500;
`;
