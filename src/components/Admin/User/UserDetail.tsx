import styled from 'styled-components';

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

const UserDetail = () => {
  return (
    <UserDetailBlock>
      <Content>
        <Label>이름</Label>
        <Text>홍민서</Text>

        <Label>휴대폰 번호</Label>
        <Text>010-3449-6933</Text>

        <Label>학교</Label>
        <Text>성균관대학교</Text>

        <Label>학년</Label>
        <Text>2학년</Text>

        <Label>전공</Label>
        <Text>컴퓨터교육과</Text>

        <Label>관심직군</Label>
        <Text>프론트엔드</Text>

        <Label>희망기업</Label>
        <Text>스타트업, 대기업</Text>

        <Label>참여 프로그램 내역</Label>
        <Text>
          <ol>
            <li>챌린지 1기</li>
            <li>부트캠프 1기</li>
          </ol>
        </Text>
      </Content>
    </UserDetailBlock>
  );
};

export default UserDetail;
