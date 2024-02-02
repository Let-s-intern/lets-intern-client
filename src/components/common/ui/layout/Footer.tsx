import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Footer = () => {
  return (
    <FooterBlock>
      <hr />
      <TopArea>
        <DocumentLinkGroup>
          <DocumentLink
            to="https://ddayeah.notion.site/e3dff22b6bb6428bb841008cd1740759?pvs=4"
            target="_blank"
            rel="noopener noreferrer"
          >
            서비스 이용약관
          </DocumentLink>
          <DocumentLink
            to="https://ddayeah.notion.site/22c0a812e31c4eb5afcd64e077d447be?pvs=4"
            target="_blank"
            rel="noopener noreferrer"
          >
            개인정보처리방침
          </DocumentLink>
        </DocumentLinkGroup>
        <IconList>
          <InstagramIcon
            src="/icons/instagram.svg"
            alt="인스타그램 아이콘"
            onClick={() => {
              window.open(
                'https://www.instagram.com/letsintern.official/',
                '_blank',
              );
            }}
          />
          <BlogIcon
            src="/icons/blog.png"
            alt="네이버 블로그 아이콘"
            onClick={() => {
              window.open(
                'https://blog.naver.com/PostList.naver?blogId=letsintern',
                '_blank',
              );
            }}
          />
        </IconList>
      </TopArea>
      <InfoTextSection className="space-y-[0.5rem] text-gray-400">
        <InfoText>턴업컴퍼니 사업자 정보</InfoText>
        <InfoText>대표자: 송다예 | 사업자 등록번호: 369-16-01796</InfoText>
        <InfoText>
          주소: 서울특별시 성동구 상원길 63 | 이메일:
          letsintern.official@gmail.com
        </InfoText>
        <InfoText>Copyright ©2023 턴업컴퍼니. All rights reserved.</InfoText>
      </InfoTextSection>
    </FooterBlock>
  );
};

export default Footer;

const iconStyle = css`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
`;

const FooterBlock = styled.footer`
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 5rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;

  @media (min-width: 640px) {
    padding-bottom: 1.25rem;
  }
`;

const TopArea = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`;

const DocumentLinkGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const DocumentLink = styled(Link)`
  color: #7f7f7f;
  cursor: pointer;
  font-weight: 700;
`;

const IconList = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const BlogIcon = styled.img`
  ${iconStyle}
`;

const InstagramIcon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const InfoTextSection = styled.div`
  margin-top: 1.5rem;
  color: #7f7f7f;
`;

const InfoText = styled.p`
  & + & {
    margin-top: 0.5rem;
  }
`;
