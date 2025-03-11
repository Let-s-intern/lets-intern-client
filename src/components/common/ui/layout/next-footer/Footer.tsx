'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import DocumentLink from './DocumentLink';
import Icon from './Icon';
import MenuLink from './MenuLink';

const CUSTOEMR_CENTER = {
  title: '고객센터',
  content: [
    '1:1 채팅 상담: 우측 하단 [문의하기] 클릭',
    '- 평일 및 주말 09:00-21:00 상담 가능',
    '전화 상담: 채팅 상담을 통해 신청 가능',
    '이메일 상담: official@letscareer.co.kr',
  ],
};

const BUSINESS_INFORMATION = {
  title: '아이엔지 사업자 정보',
  owner: '대표자: 송다예',
  registrationNumber: '사업자 등록번호: 871-11-02629',
  mailOrderSales: '통신판매업신고번호 제 2024-서울마포-2221호',
  address: '주소: 서울특별시 광나루로 190 B동 611호',
  email: '이메일: official@letscareer.co.kr',
  call: '고객센터: 0507-0178-8541',
  copyright: 'Copyright ©2024 아이엔지. All rights reserved.',
};

const Footer = () => {
  useEffect(() => {
    if (!window.Kakao?.isInitialized()) {
      window.Kakao?.init('fe2307dd60e05ff8cbb06d777a13e31c');
    }
  }, []);

  const onClickAddChannel = () => {
    window.Kakao.Channel.followChannel({
      channelPublicId: '_tCeHG',
    })
      .then((response: any) => {})
      .catch((error: any) => {
        console.log(error);
      });
  };
  return (
    <footer className="border-t-1 w-full border-neutral-80 bg-neutral-85 px-5 pb-16 pt-10 md:pb-12 lg:px-10 xl:px-52">
      <div className="flex flex-col gap-[3.25rem] lg:justify-between lg:gap-7">
        <div className="flex flex-col gap-[3.25rem] lg:flex-row-reverse lg:justify-between">
          <div className="flex flex-col gap-[3.25rem] lg:flex-row lg:items-start lg:gap-[6.25rem]">
            {/* 사이트맵 */}
            <div className="flex flex-col gap-3">
              <MenuLink to="/about" force>
                렛츠커리어 스토리
              </MenuLink>
              <MenuLink to="/program" force>
                프로그램
              </MenuLink>
              <MenuLink to="/review">100% 솔직 후기</MenuLink>
              <MenuLink to="/blog/list" force>
                블로그
              </MenuLink>
              <MenuLink to="/report/landing" force>
                서류 진단 서비스
              </MenuLink>
              <MenuLink
                to="https://letscareerinterview.imweb.me/"
                target="_blank"
                rel="noopenner noreferrer"
              >
                모의 면접 서비스
              </MenuLink>
            </div>

            {/* 기타 */}
            <div className="flex flex-col gap-3">
              <MenuLink
                to="https://letscareer.oopy.io"
                target="_blank"
                rel="noopener noreferrer"
                className="notice_cta"
              >
                공지사항
              </MenuLink>
              <MenuLink
                to="https://docs.google.com/forms/d/e/1FAIpQLSeHM_d3yd0cOiH2aSqhprtSFmidIYFziyIxf5-9j7rgZCobvA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inquiry_cta"
              >
                광고/제휴 문의
              </MenuLink>
              <MenuLink
                to="https://letscareer.oopy.io"
                target="_blank"
                rel="noopener noreferrer"
                className="q&a_cta"
              >
                자주 묻는 질문
              </MenuLink>
              {/* 고객센터 */}
              <div className="text-0.875 w-80">
                <span className="text-neutral-0">{CUSTOEMR_CENTER.title}</span>
                <p className="mt-2 flex flex-col text-neutral-0/65">
                  {CUSTOEMR_CENTER.content.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div className="text-0.75-medium flex flex-col gap-5 text-neutral-45">
            {/* 로고 */}
            <Link href="/" className="w-[7.5rem]">
              <img className="h-auto w-full" src="/logo/logo.svg" alt="Logo" />
            </Link>
            {/* 사업자 정보 */}
            <div className="text-0.75-medium flex flex-col gap-2 text-neutral-45">
              <span>{BUSINESS_INFORMATION.title}</span>
              <span>
                {BUSINESS_INFORMATION.owner} |{' '}
                {BUSINESS_INFORMATION.registrationNumber}
              </span>
              <span>{BUSINESS_INFORMATION.mailOrderSales} |</span>
              <span>{BUSINESS_INFORMATION.address} |</span>
              <span>{BUSINESS_INFORMATION.email} |</span>
              <span>{BUSINESS_INFORMATION.call} |</span>
              <span>{BUSINESS_INFORMATION.copyright}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-start lg:gap-5">
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
            <img
              src="/icons/icon-kakao.svg"
              width={20}
              height={20}
              alt="카카오톡 채널 아이콘"
              onClick={onClickAddChannel}
              className="cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-6 text-neutral-0/[.65]">
            <DocumentLink to="https://letscareer.oopy.io/a121a038-f72f-42d7-bde7-47624ecc0943">
              서비스 이용약관
            </DocumentLink>
            <DocumentLink to="https://letscareer.oopy.io/c3af485b-fced-49ab-9601-f2d7bf07657d">
              개인정보처리방침
            </DocumentLink>
          </div>
        </div>
      </div>

      <hr className="mb-10 mt-8" />
    </footer>
  );
};

export default Footer;
