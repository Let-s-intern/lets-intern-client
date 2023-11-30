import styled from 'styled-components';
import PrivacyLink from './PrivacyLink';

interface PrivacyPolicyModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ModalBackgroundProps {
  $show: boolean;
}

const PrivacyPolicyModal = ({
  showModal,
  setShowModal,
}: PrivacyPolicyModalProps) => {
  return (
    <>
      <ModalBackground $show={showModal} onClick={() => setShowModal(false)}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <Title>개인정보 수집 및 이용 동의서</Title>
          <Table>
            <thead>
              <tr>
                <th>수집목적</th>
                <th>수집항목</th>
                <th>수집기간</th>
                <th>수집근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>회원가입 및 서비스 이용, 고지사항 전달</td>
                <td>이메일주소, 이름, 휴대폰 번호, 비밀번호</td>
                <td>회원 탈퇴 후 30일까지</td>
                <td>개인정보 보호법 제 15조 제1항</td>
              </tr>
            </tbody>
          </Table>
          <Paragraph>
            귀하는 렛츠인턴 서비스 이용에 필요한 개인정보 수집·이용에 동의하지
            않을 수 있으나, 동의를 거부할 경우 회원제 서비스 이용이 불가합니다.
          </Paragraph>
          <p>
            개인정보처리내용에 대해서는&nbsp;
            <PrivacyLink
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  'https://ddayeah.notion.site/22c0a812e31c4eb5afcd64e077d447be?pvs=4',
                  '_blank',
                );
              }}
            >
              개인정보처리방침
            </PrivacyLink>
            을 확인해주세요.
          </p>
          <CloseButtonWrapper>
            <CloseButton type="button" onClick={() => setShowModal(false)}>
              닫기
            </CloseButton>
          </CloseButtonWrapper>
        </ModalContainer>
      </ModalBackground>
    </>
  );
};

export default PrivacyPolicyModal;

const ModalBackground = styled.div<ModalBackgroundProps>`
  display: ${({ $show }) => ($show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 3rem 4rem;
  z-index: 1000;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
  }
`;

const Paragraph = styled.p`
  margin-top: 1rem;
`;

const CloseButtonWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 2rem;
`;

const CloseButton = styled.button`
  background-color: #6a63f6;
  padding: 0.5rem 1rem;
  color: #ffffff;
  border-radius: 4px;
`;
