import styled from 'styled-components';
import parsePhoneNum from '../../../libs/parsePhoneNum';

interface UserDetailProps {
  loading: boolean;
  error: unknown;
  user: any;
}

const UserDetail = ({ loading, error, user }: UserDetailProps) => {
  if (loading) {
    return <UserDetailBlock />;
  }

  if (error) {
    return <UserDetailBlock>에러 발생</UserDetailBlock>;
  }

  return (
    <UserDetailBlock>
      <Content>
        {user.name && (
          <>
            <Label>이름</Label>
            <Text>{user.name}</Text>
          </>
        )}

        {user.email && (
          <>
            <Label>이메일</Label>
            <Text>{user.email}</Text>
          </>
        )}

        {user.phoneNum && (
          <>
            <Label>휴대폰 번호</Label>
            <Text>{parsePhoneNum(user.phoneNum, true)}</Text>
          </>
        )}

        {user.university && (
          <>
            <Label>학교</Label>
            <Text>{user.university}</Text>
          </>
        )}

        {user.grade && (
          <>
            <Label>전공</Label>
            <Text>{user.grade}</Text>
          </>
        )}

        {user.major && (
          <>
            <Label>전공</Label>
            <Text>{user.major}</Text>
          </>
        )}

        {user.wishJob && (
          <>
            <Label>관심직군</Label>
            <Text>{user.wishJob}</Text>
          </>
        )}

        {user.wishCompany && (
          <>
            <Label>희망기업</Label>
            <Text>{user.wishCompany}</Text>
          </>
        )}

        {/* <Label>참여 프로그램 내역</Label>
        <Text>
          <ol>
            <li>챌린지 1기</li>
            <li>부트캠프 1기</li>
          </ol>
        </Text> */}
      </Content>
    </UserDetailBlock>
  );
};

export default UserDetail;

const UserDetailBlock = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.25rem;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 1rem;
  column-gap: 3rem;
`;
const Label = styled.span`
  font-weight: 500;
`;

const Text = styled.span``;
