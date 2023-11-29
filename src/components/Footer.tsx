import styled, { css } from 'styled-components';

const Footer = () => {
  return (
    <FooterBlock>
      <CopyRight>©Let’s Intern. All rights reserved.</CopyRight>
      <IconList>
        <MailIcon src="/icons/mail.svg" alt="메일 아이콘" />
        <InstagramIcon src="/icons/instagram.svg" alt="인스타그램 아이콘" />
        <BlogIcon src="/icons/blog.png" alt="네이버 블로그 아이콘" />
      </IconList>
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
  /* position: absolute; */
  /* bottom: 0; */
  width: 100%;
  margin-top: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
`;

const CopyRight = styled.span`
  color: #7f7f7f;
`;

const IconList = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const MailIcon = styled.img`
  ${iconStyle}
`;

const BlogIcon = styled.img`
  ${iconStyle}
`;

const InstagramIcon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
`;
