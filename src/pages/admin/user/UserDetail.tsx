import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import axios from '../../../utils/axios';
import classes from './UserDetail.module.scss';
import ActionButton from '../../../components/admin/button/ActionButton';
import { convertTypeToBank } from '../../../utils/convertTypeToBank';

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
    return <div className={classes.container} />;
  }

  if (error) {
    return <div className={classes.container}>에러 발생</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        {user.name && (
          <>
            <span className={classes.label}>이름</span>
            <span>{user.name}</span>
          </>
        )}
        {user.email && (
          <>
            <span className={classes.label}>이메일</span>
            <span>{user.email}</span>
          </>
        )}
        {user.phoneNum && (
          <>
            <span className={classes.label}>휴대폰 번호</span>
            <span>{user.phoneNum}</span>
          </>
        )}

        {user.university && (
          <>
            <span className={classes.label}>학교</span>
            <span>{user.university}</span>
          </>
        )}

        {user.grade && (
          <>
            <span className={classes.label}>전공</span>
            <span>{user.grade}</span>
          </>
        )}
        {user.major && (
          <>
            <span className={classes.label}>전공</span>
            <span>{user.major}</span>
          </>
        )}
        {user.wishJob && (
          <>
            <span className={classes.label}>관심직군</span>
            <span>{user.wishJob}</span>
          </>
        )}
        {user.wishCompany && (
          <>
            <span className={classes.label}>희망기업</span>
            <span>{user.wishCompany}</span>
          </>
        )}
        {user.accountType && (
          <>
            <span className={classes.label}>거래은행</span>
            <span>{convertTypeToBank(user.accountType)}</span>
          </>
        )}
        {user.accountNumber && (
          <>
            <span className={classes.label}>계좌번호</span>
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
      <div className={classes.actionGroup}>
        <ActionButton bgColor="gray" onClick={() => navigate(-1)}>
          이전
        </ActionButton>
        <ActionButton to={`/admin/users/${user.id}/edit`} bgColor="green">
          수정
        </ActionButton>
      </div>
    </div>
  );
};

export default UserDetail;
