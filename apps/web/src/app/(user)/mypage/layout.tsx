'use client';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { useIsMentorQuery } from '@/api/user/user';
import CategoryTabs from '@/common/ui/CategoryTabs';
import { Profile } from '@/domain/mypage/mypage/profile/Profile';
import MyPageBanner from '@/domain/mypage/MyPageBanner';
import useAuthStore from '@/store/useAuthStore';

interface MyPageLayoutProps {
  children: React.ReactNode;
}

const MyPageLayout = ({ children }: MyPageLayoutProps) => {
  const { isLoggedIn, isInitialized } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const { data: isMentor } = useIsMentorQuery();
  const isReviewCreatePage = pathname.startsWith('/mypage/review/new');
  const isReviewPage =
    pathname.startsWith('/mypage/review/challenge') ||
    pathname.startsWith('/mypage/review/live') ||
    pathname.startsWith('/mypage/review/report') ||
    pathname.startsWith('/mypage/review/challenge');

  // 서브 탭 정의 (커리어 관리 탭에서만 표시)
  const careerSubTabs = useMemo(() => {
    return [
      {
        id: 'board',
        label: '커리어 보드',
        path: '/mypage/career/board',
        active: pathname === '/mypage/career/board',
      },
      {
        id: 'plan',
        label: '커리어 계획',
        path: '/mypage/career/plan',
        active: pathname === '/mypage/career/plan',
      },
      {
        id: 'experience',
        label: '경험 정리',
        path: '/mypage/career/experience',
        active: pathname === '/mypage/career/experience',
      },
      {
        id: 'record',
        label: '커리어 기록',
        path: '/mypage/career/record',
        active: pathname === '/mypage/career/record',
      },
      {
        id: 'resume',
        label: '서류 정리',
        path: '/mypage/career/resume',
        active: pathname === '/mypage/career/resume',
      },
    ];
  }, [pathname]);

  const careerSubTabsProps = {
    options: careerSubTabs.map((tab) => ({ value: tab.id, label: tab.label })),
    selected:
      careerSubTabs.find((tab) => tab.active)?.id ?? careerSubTabs[0].id,
    onChange: (id: string) => {
      const tab = careerSubTabs.find((t) => t.id === id);
      if (tab) router.push(tab.path);
    },
  };

  // 사이드바 메뉴 아이템
  const sidebarItems = useMemo(() => {
    const baseItems = [
      {
        id: 'career',
        label: '커리어 관리',
        path: '/mypage/career',
        active: pathname.startsWith('/mypage/career'),
      },
      {
        id: 'application',
        label: '신청 현황',
        path: '/mypage/application',
        active: pathname === '/mypage/application',
      },
      {
        id: 'review',
        label: '후기 작성',
        path: '/mypage/review',
        active: pathname.startsWith('/mypage/review'),
      },
      {
        id: 'credit',
        label: '결제 내역',
        path: '/mypage/credit',
        active: pathname.startsWith('/mypage/credit'),
      },
      {
        id: 'privacy',
        label: '개인 정보',
        path: '/mypage/privacy',
        active: pathname === '/mypage/privacy',
      },
    ];

    if (isMentor) {
      baseItems.push({
        id: 'feedback',
        label: '챌린지 피드백',
        path: '/mypage/feedback',
        active: pathname === '/mypage/feedback',
      });
    }

    return baseItems;
  }, [pathname, isMentor]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isLoggedIn && pathname.startsWith('/mypage')) {
      const newUrl = new URL(window.location.href);
      const searchParams = new URLSearchParams();
      searchParams.set('redirect', `${newUrl.pathname}?${newUrl.search}`);
      router.push(`/login?${searchParams.toString()}`);
    }
  }, [isLoggedIn, router, pathname, isInitialized]);

  const showCareerSubTabs = pathname.startsWith('/mypage/career');

  return (
    <div className="m-auto flex w-full max-w-[1180px] flex-col md:py-12">
      {/* 배너 (모바일) */}
      <MyPageBanner className="overflow-hidden md:hidden" />

      {/* 메인 탭 네비게이션 (모바일) */}
      <nav className="border-neutral-85 scrollbar-hide flex w-full gap-6 overflow-x-auto border-b px-5 pt-3 md:hidden">
        {sidebarItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(tab.path)}
            className={clsx(
              'text-xsmall16 flex-shrink-0 whitespace-nowrap pb-3',
              tab.active
                ? 'text-primary font-semibold'
                : 'text-neutral-45 font-medium',
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 서브 탭 네비게이션 (모바일, 커리어 관리에서만 표시) */}
      {showCareerSubTabs && (
        <CategoryTabs
          {...careerSubTabsProps}
          className="pt-[14px] md:hidden md:pt-0"
        />
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex w-full flex-1 flex-col pb-14 pt-8 md:flex-row md:gap-x-[60px] md:pb-[60px] md:pt-0">
        {/* 데스크톱 사이드바 */}
        <aside
          className={clsx(
            'hidden w-full flex-shrink-0 bg-white md:block md:w-[254px]',
            {
              hidden: isReviewCreatePage || isReviewPage,
            },
          )}
        >
          <div className="flex flex-col gap-7">
            <h1 className="text-medium24 text-neutral-0 hidden font-semibold md:block">
              마이페이지
            </h1>

            {/* 프로필 섹션 */}
            <Profile />

            {/* 메뉴 아이템 */}
            <nav className="flex flex-col">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(item.path)}
                  className={clsx(
                    'rounded-xs text-xsmall16 flex items-center px-3 py-2.5 text-left font-medium',
                    item.active
                      ? 'bg-primary-5 text-primary font-semibold'
                      : 'text-neutral-40',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* 배너 (데스크탑) */}
            <MyPageBanner className="rounded-xs hidden overflow-hidden md:block" />
          </div>
        </aside>

        {/* 컨텐츠 영역 */}
        <main className="min-w-0 flex-1">
          <div>
            {/* 서브 탭 네비게이션 (데스크톱) */}
            {showCareerSubTabs && (
              <CategoryTabs
                {...careerSubTabsProps}
                className="mb-10 hidden px-0 md:flex"
              />
            )}

            {/* 페이지 컨텐츠 */}
            <div className="mx-5 md:mx-0">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPageLayout;
