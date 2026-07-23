'use client';

import useActiveReports from '@/hooks/useActiveReports';
import { twMerge } from '@/lib/twMerge';
import { useEffect, useMemo, useState } from 'react';
import BottomLinkSection from './BottomLinkSection';
import BusinessInfo from './BusinessInfo';
import CustomerSupport from './CustomerSupport';
import MainLink from './MainLink';
// [TEMP·UI테스트] 멘티 Jitsi 모달을 게이팅 없이 바로 여는 임시 버튼용. 커밋/배포 전 제거.
import JitsiEmbedModal from '@/common/modal/JitsiEmbedModal';

// [TEMP·UI테스트] 고정 방 URL — 두 창(멘토/멘티)이 같은 방에 모이도록 동일 값 사용.
const UI_TEST_MEETING_URL = `${(
  process.env.NEXT_PUBLIC_JITSI_BASE_URL ?? 'https://meet.jit.si/'
).replace(/\/?$/, '/')}letscareer-uitest-room`;

type FooterProps = React.ComponentProps<'footer'>;

const Footer = (props: FooterProps) => {
  // [TEMP·UI테스트] 멘티 Jitsi 모달 열림 상태.
  const [isUiTestJitsiOpen, setIsUiTestJitsiOpen] = useState(false);

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
    <footer
      className={twMerge(
        'border-t-1 border-neutral-80 bg-neutral-85 w-full px-5 pb-16 pt-10 md:pb-12 lg:px-10 xl:px-52',
        props.className,
      )}
    >
      <div className="flex flex-col gap-[3.25rem] lg:justify-between lg:gap-7">
        <div className="flex flex-col gap-[3.25rem] lg:flex-row-reverse lg:justify-between">
          <div className="flex flex-col gap-[3.25rem] lg:flex-row lg:items-start lg:gap-[6.25rem]">
            {/* 사이트맵 */}
            <div className="flex flex-col gap-3">
              <MainLink href="/about">렛츠커리어 스토리</MainLink>
              <MainLink href="/program">프로그램</MainLink>
              <MainLink href="/review">100% 솔직 후기</MainLink>
              <MainLink href="/blog/list">블로그</MainLink>
              {reportLInk && (
                <MainLink href={reportLInk}>서류 진단 서비스</MainLink>
              )}
              <MainLink href="/program?type=VOD">취준위키 VOD</MainLink>
            </div>

            {/* 기타 */}
            <div className="flex flex-col gap-3">
              <MainLink
                href="https://letscareer.oopy.io"
                target="_blank"
                rel="noopener noreferrer"
                className="notice_cta"
              >
                공지사항
              </MainLink>
              <MainLink
                href="https://docs.google.com/forms/d/e/1FAIpQLSeHM_d3yd0cOiH2aSqhprtSFmidIYFziyIxf5-9j7rgZCobvA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inquiry_cta"
              >
                광고/제휴 문의
              </MainLink>
              <MainLink
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

          <div className="text-0.75-medium text-neutral-45 flex flex-col gap-5">
            {/* 로고 */}
            <MainLink href="/" className="w-[7.5rem]">
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
        <BottomLinkSection />
      </div>
      <hr className="mb-10 mt-8" />

      {/* [TEMP·UI테스트] 멘티 Jitsi 모달을 게이팅(예약/시간창/reserved) 없이 바로 여는 버튼.
          창을 두 개 띄우고 각각 이 버튼을 누르면 같은 방(UI_TEST_MEETING_URL)에서 2인 모달 UI 확인 가능.
          커밋/배포 전 반드시 제거. */}
      <div className="flex justify-center pb-8">
        <button
          type="button"
          onClick={() => setIsUiTestJitsiOpen(true)}
          className="rounded-sm border border-dashed border-red-400 px-4 py-2 text-xs font-semibold text-red-500"
        >
          [TEMP] 멘티 Jitsi 모달 열기 (UI 테스트)
        </button>
      </div>
      <JitsiEmbedModal
        isOpen={isUiTestJitsiOpen}
        onClose={() => setIsUiTestJitsiOpen(false)}
        meetingUrl={UI_TEST_MEETING_URL}
        spaceName="UI 테스트"
      />
    </footer>
  );
};

export default Footer;
