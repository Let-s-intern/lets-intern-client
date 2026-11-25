'use client';

import BottomNavBarWithPathname from '@/common/layout/BottomNavBarWithPathname';
import ChannelTalkBtn from '@/common/layout/channel/ChannelTalkBtn';
import Footer from '@/common/layout/footer/Footer';
import NavBar from '@/common/layout/header/NavBar';
import { BIGFIRM_PATH } from '@/domain/bigfirm/data/links';
// [LETSCON] 행사 종료 후 아래 조건과 함께 지운다
import { LETSCON_PATH } from '@/domain/letscon/data/links';
import MentorJoinLayout, {
  isMentorJoinPath,
} from '@/domain/mentor-join/layout/MentorJoinLayout';
import { usePathname } from 'next/navigation';
import React from 'react';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isDarkPage = pathname.startsWith('/challenge/feedback-mentoring');
  const isCurationPage = pathname.startsWith('/curation');
  // 멤버십(이벤트) 랜딩은 본 웹앱에 직접 마운트한다(MembershipLanding). 글로벌 헤더(NavBar)는
  // 그대로 쓰되, 랜딩이 자체 하단 고정 ApplyBar 를 두므로 푸터·채널톡·바텀바는 띄우지 않는다.
  const isMembershipPage = pathname.startsWith('/membership');
  // VOD 등 외부 서비스에 임베드되는 SSO 로그인 화면(LC-3208). 렛츠커리어 사이트라는 티가
  // 나면 안 되므로 NavBar·Footer·채널톡·바텀바를 전부 없앤 완전히 빈 페이지로 띄운다.
  const isSsoLoginPage = pathname === '/sso/login';
  // 올인원패스 대시보드(하위 라우트)는 모바일에서 자체 sticky 달력/목록이 화면을 채우므로
  // 하단 Footer 를 모바일(md 미만)에서만 숨긴다. 랜딩(/all-in-one-pass/{id})은 Footer 노출.
  const isAllInOnePassDashboard =
    pathname.startsWith('/all-in-one-pass') &&
    !/^\/all-in-one-pass\/[^/]+$/.test(pathname);

  // VOD 이용권 단독 구매는 링크로 바로 여는 작은 창이다. 렛츠커리어 헤더·푸터 없이 카드만 보인다.
  const isVodPassPurchasePage = pathname.startsWith('/vod-pass/purchase');

  // 가이드북 구매는 오공고 등 외부 화면이 팝업으로 여는 작은 창이다(LC-3677). VOD 구매와 같이 빈 레이아웃이다.
  const isGuidebookPurchasePage = pathname.startsWith('/guidebook/purchase/');

  // 오공고 마이페이지가 iframe 으로 넣는 구매한 가이드북 목록(LC-3677). 목록만 보이도록 빈 레이아웃이다.
  const isGuidebookListEmbedPage = pathname === '/guidebook/my';

  if (
    isSsoLoginPage ||
    isVodPassPurchasePage ||
    isGuidebookPurchasePage ||
    isGuidebookListEmbedPage
  ) {
    return <div>{children}</div>;
  }

  // 멘토 모집 랜딩·신청서·현황 조회(LC-3529)는 시안의 헤더·푸터를 쓴다. 회원에게만 렛츠커리어 헤더를 보인다.
  // 랜딩이 자체 하단 고정 바를 두므로 채널톡·바텀바는 띄우지 않는다.
  if (isMentorJoinPath(pathname)) {
    return <MentorJoinLayout>{children}</MentorJoinLayout>;
  }

  // 대기업 현직 멘토 기획전(LC-3534)은 렛츠커리어 헤더·푸터를 그대로 쓴다. 랜딩이 자체 하단 고정 바(문의하기 포함)를
  // 두므로 채널톡·바텀바는 띄우지 않고, 푸터 아래에 그 바만큼 여백을 둔다.
  // [LETSCON] 렛츠콘 랜딩도 자체 플로팅 신청 바를 두므로 같은 레이아웃을 쓴다
  if (pathname === BIGFIRM_PATH || pathname === LETSCON_PATH) {
    return (
      <div>
        <NavBar />
        <div className="min-h-[31rem] w-full">{children}</div>
        <Footer className="pb-32 md:pb-36" />
      </div>
    );
  }

  if (isMembershipPage) {
    return (
      <div>
        <NavBar />
        <div className="min-h-[31rem] w-full">{children}</div>
      </div>
    );
  }

  return (
    <div>
      <NavBar isLoginPage={isLoginPage} disableFixed={isCurationPage} />
      <div className="min-h-[31rem] w-full">{children}</div>
      {!isLoginPage &&
        !isDarkPage &&
        !isCurationPage &&
        (isAllInOnePassDashboard ? (
          <div className="hidden md:block">
            <Footer />
          </div>
        ) : (
          <Footer />
        ))}
      {!isLoginPage && !isCurationPage && <ChannelTalkBtn />}
      {!isLoginPage && !isCurationPage && <BottomNavBarWithPathname />}
    </div>
  );
};

export default ConditionalLayout;
