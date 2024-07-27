import DocumentLink from './DocumentLink';
import Icon from './Icon';
import MenuLink from './MenuLink';

const CUSTOEMR_CENTER = {
  title: '고객센터',
  content:
    '홈페이지 좌측 하단의 [이메일] 이나 우측 하단 [채팅문의]를 통해 1:1 채팅상담을 이용하실 수 있습니다.',
  time: '* 채팅 상담 운영시간 : 평일, 주말 09:00-21:00',
  notice: '(전화상담을 원하시는 경우, 채팅상담을 통해 신청 부탁드립니다.)',
};

const BUSINESS_INFORMATION = {
  title: '아이엔지 사업자 정보',
  owner: '대표자: 송다예',
  registrationNumber: '사업자 등록번호: 871-11-02629',
  mailOrderSales: '통신판매업신고번호 제 2024-서울마포-2221호',
  address: '주소: 서울특별시 마포구 독막로 9길 18, 서홍빌딩 3층 A9호',
  email: '이메일: official@letscareer.co.kr',
  call: '고객센터: 0507-0178-8541',
  copyright: 'Copyright ©2024 아이엔지. All rights reserved.',
};

const Footer = () => {
  return (
    <footer className="border-t-1 w-full border-neutral-80 bg-neutral-85 px-5 pb-6 pt-10 lg:px-10 xl:px-52">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-start xl:gap-16">
        <img className="w-[7.5rem]" src="/logo/logo.svg" alt="Logo" />
        <div className="flex flex-col gap-8">
          <div className="flex w-80 items-center gap-8">
            <MenuLink to="/">홈</MenuLink>
            <MenuLink to="/program">프로그램</MenuLink>
            <MenuLink
              to="https://letscareer.oopy.io"
              target="_blank"
              rel="noopener noreferrer"
              className="notice_cta"
            >
              공지사항
            </MenuLink>
            <MenuLink
              to="https://letscareer.oopy.io"
              target="_blank"
              rel="noopener noreferrer"
              className="q&a_cta"
            >
              자주 묻는 질문
            </MenuLink>
            {/* <MenuLink to="/blog">블로그</MenuLink> */}
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center gap-10">
            <span className="text-neutral-0">{CUSTOEMR_CENTER.title}</span>
          </div>
          <p className="text-0.875 w-80 text-neutral-0/[.65]">
            {CUSTOEMR_CENTER.content}
            <br />
            {CUSTOEMR_CENTER.time}
            <br />
            <span className="text-0.75">{CUSTOEMR_CENTER.notice}</span>
          </p>
        </div>
      </div>

      <div className="text-0.75-medium my-7 flex flex-col gap-2 text-neutral-45">
        <span>{BUSINESS_INFORMATION.title}</span>
        <p className="flex flex-wrap gap-2">
          <span>{BUSINESS_INFORMATION.owner}</span>
          <span>|</span>
          <span>{BUSINESS_INFORMATION.registrationNumber}</span>
          <span>|</span>
          <span>{BUSINESS_INFORMATION.mailOrderSales}</span>
          <span className="block md:hidden">|</span>
        </p>
        <div className="flex flex-col gap-2 md:flex-row">
          <p className="flex gap-2">
            <span>{BUSINESS_INFORMATION.address}</span>
            <span>|</span>
          </p>
          <p className="flex gap-2">
            <span>{BUSINESS_INFORMATION.email}</span>
            <span>|</span>
          </p>
          <p className="flex gap-2">
            <span>{BUSINESS_INFORMATION.call}</span>
            <span className="block md:hidden">|</span>
          </p>
        </div>
        <span>{BUSINESS_INFORMATION.copyright}</span>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Icon
            src="/icons/instagram.svg"
            alt="인스타그램 아이콘"
            to="https://www.instagram.com/letscareer.official/"
            className="instagram_cta"
          />
          <Icon
            src="/icons/blog.png"
            alt="네이버 블로그 아이콘"
            to="https://blog.naver.com/PostList.naver?blogId=letsintern"
            className="blog_cta"
          />
        </div>
        <div className="flex items-center gap-6 text-neutral-0/[.65]">
          <DocumentLink to="https://letsintern.notion.site/a121a038f72f42d7bde747624ecc0943?pvs=4">
            서비스 이용약관
          </DocumentLink>
          <DocumentLink to="https://letsintern.notion.site/c3af485bfced49ab9601f2d7bf07657d?pvs=4">
            개인정보처리방침
          </DocumentLink>
        </div>
      </div>
      <hr className="mb-10 mt-8" />
    </footer>
  );
};

export default Footer;
