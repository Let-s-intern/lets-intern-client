'use client';

import useActiveReports from '@/hooks/useActiveReports';
import { useEffect, useMemo } from 'react';
import BottomLinkSection from './BottomLinkSection';
import BusinessInfo from './BusinessInfo';
import CustomerSupport from './CustomerSupport';
import MainLink from './MainLink';

const NextFooter = () => {
  const { hasActiveResume, hasActivePortfolio, hasActivePersonalStatement } =
    useActiveReports();

  const reportLInk = useMemo(() => {
    if (hasActiveResume) return '/report/landing/resume';
    if (hasActivePersonalStatement) return '/report/landing/personal-statement';
    if (hasActivePortfolio) return '/report/landing/portfolio';
    return null;
  }, [hasActiveResume, hasActivePortfolio, hasActivePersonalStatement]);

  useEffect(() => {
    if (!window.Kakao?.isInitialized()) {
      window.Kakao?.init('fe2307dd60e05ff8cbb06d777a13e31c');
    }
  }, []);

  return (
    <footer className="border-t-1 w-full border-neutral-80 bg-neutral-85 px-5 pb-16 pt-10 md:pb-12 lg:px-10 xl:px-52">
      <div className="flex flex-col gap-[3.25rem] lg:justify-between lg:gap-7">
        <div className="flex flex-col gap-[3.25rem] lg:flex-row-reverse lg:justify-between">
          <div className="flex flex-col gap-[3.25rem] lg:flex-row lg:items-start lg:gap-[6.25rem]">
            {/* 사이트맵 */}
            <div className="flex flex-col gap-3">
              <MainLink isNextRouter href="/about" force>
                렛츠커리어 스토리
              </MainLink>
              <MainLink isNextRouter href="/program" force>
                프로그램
              </MainLink>
              <MainLink isNextRouter href="/review">
                100% 솔직 후기
              </MainLink>
              <MainLink isNextRouter href="/blog/list">
                블로그
              </MainLink>
              {reportLInk && (
                <MainLink isNextRouter href={reportLInk}>
                  서류 진단 서비스
                </MainLink>
              )}
              <MainLink
                isNextRouter
                href="https://letscareer.liveklass.com/?utm_source=letscareer&utm_medium=website&utm_campaign=GNB"
                target="_blank"
                rel="noopenner noreferrer"
              >
                취준위키 VOD
              </MainLink>
            </div>

            {/* 기타 */}
            <div className="flex flex-col gap-3">
              <MainLink
                isNextRouter
                href="https://letscareer.oopy.io"
                target="_blank"
                rel="noopener noreferrer"
                className="notice_cta"
              >
                공지사항
              </MainLink>
              <MainLink
                isNextRouter
                href="https://docs.google.com/forms/d/e/1FAIpQLSeHM_d3yd0cOiH2aSqhprtSFmidIYFziyIxf5-9j7rgZCobvA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inquiry_cta"
              >
                광고/제휴 문의
              </MainLink>
              <MainLink
                isNextRouter
                href="https://letscareer.oopy.io"
                target="_blank"
                rel="noopener noreferrer"
                className="q&a_cta"
              >
                자주 묻는 질문
              </MainLink>
              {/* 고객센터 */}
              <CustomerSupport />
            </div>
          </div>

          <div className="text-0.75-medium flex flex-col gap-5 text-neutral-45">
            {/* 로고 */}
            <MainLink isNextRouter href="/" className="w-[7.5rem]">
              <img
                className="h-auto w-full"
                src="/logo/logo.svg"
                alt="렛츠커리어"
              />
            </MainLink>
            {/* 사업자 정보 */}
            <BusinessInfo />
          </div>
        </div>
        <BottomLinkSection isNextRouter />
      </div>
      <hr className="mb-10 mt-8" />
    </footer>
  );
};

export default NextFooter;
