import MenuLink from './MenuLink';
import Icon from './Icon';
import DocumentLink from './DocumentLink';
import Notice from './Notice';

const Footer = () => {
  return (
    <footer className="border-t-1 w-full border-neutral-80 bg-neutral-85 px-5 pb-6 pt-10 lg:px-10 xl:px-52">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-start xl:gap-16">
        <img className="w-[7.5rem]" src="/logo/logo.svg" alt="Logo" />
        <div className="flex flex-col gap-8">
          <div className="flex w-80 items-center gap-8">
            <MenuLink to="/">홈</MenuLink>
            <MenuLink to="/program">프로그램</MenuLink>
            <MenuLink to='https://letscareer.oopy.io/4e78d954-c4ac-4c14-a122-a21fe890de5b'>공지사항</MenuLink>
            <MenuLink to="https://letscareer.oopy.io/5eb0ebdd-e10c-4aa1-b28a-8bd0964eca0b">자주묻는 질문</MenuLink>
            {/* <MenuLink to="/blog">블로그</MenuLink> */}
          </div>
          {/* <Notice className="hidden lg:flex" /> */}
        </div>
        <div>
          <div className="mb-1.5 flex items-center gap-10">
            <span className="text-neutral-0">고객센터</span>
            <Notice className="lg:hidden" />
          </div>
          <p className="text-0.875 w-80 text-neutral-0/[.65]">
            홈페이지 좌측 하단의 [이메일] 이나 우측 하단 [문의하기]를 통해 1:1
            채팅상담을 이용하실 수 있습니다.
            <br />* 채팅 상담 운영시간 : 평일, 주말 09:00-21:00
            <br />
            <span className="text-0.75">
              (전화상담을 원하시는 경우, 채팅상담을 통해 신청 부탁드립니다.)
            </span>
          </p>
        </div>
      </div>

      <p className="text-0.75-medium my-7 flex flex-col gap-2 text-neutral-45">
        <span>턴업컴퍼니 사업자 정보</span>
        <div className="flex gap-2">
          <span>대표자: 송다예</span>
          <span>|</span>
          <span>사업자 등록번호: 369-16-01796</span>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex gap-2">
            <span>주소: 서울특별시 성동구 상원길 63</span>
            <span>|</span>
          </div>
          <div className="flex gap-2">
            <span>이메일: letsintern.official@gmail.com</span>
            <span>|</span>
          </div>
          <span>Copyright ©2023 턴업컴퍼니. All rights reserved.</span>
        </div>
      </p>

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Icon
            src="/icons/instagram.svg"
            alt="인스타그램 아이콘"
            to="https://www.instagram.com/letscareer.official/"
          />
          <Icon
            src="/icons/blog.png"
            alt="네이버 블로그 아이콘"
            to="https://blog.naver.com/PostList.naver?blogId=letsintern"
          />
        </div>
        <div className="flex items-center gap-6 text-neutral-0/[.65]">
          <DocumentLink to="https://letscareer.oopy.io/241b2e74-7ddf-4747-8012-a68f7c03f9e1">
            서비스 이용약관
          </DocumentLink>
          <DocumentLink to="https://letscareer.oopy.io/4e21a3c6-f42a-409d-a877-a7b5d926f158">
            개인정보처리방침
          </DocumentLink>
        </div>
      </div>
      <hr className="mb-10 mt-8" />
    </footer>
  );
};

export default Footer;
