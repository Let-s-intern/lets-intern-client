'use client';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { useIsMentorQuery } from '@/api/user';
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
    <div className="m-auto flex w-full max-w-[1120px] flex-col md:py-12">
      {/* TODO: 배너 (모바일) */}
      <div className="h-[100px] w-full bg-neutral-80 md:hidden"></div>

      {/* 메인 탭 네비게이션 (모바일) */}
      <nav className="flex w-full gap-6 overflow-x-auto border-b border-neutral-85 px-5 pt-3 scrollbar-hide md:hidden">
        {sidebarItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(tab.path)}
            className={clsx(
              'flex-shrink-0 whitespace-nowrap pb-3 text-xsmall16',
              tab.active
                ? 'font-semibold text-primary'
                : 'font-medium text-neutral-45',
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 서브 탭 네비게이션 (모바일, 커리어 관리에서만 표시) */}
      {showCareerSubTabs && (
        <nav className="flex w-full gap-5 overflow-x-auto border-b border-neutral-85 px-5 pt-3 scrollbar-hide md:hidden">
          {careerSubTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className={clsx(
                'flex-shrink-0 whitespace-nowrap pb-3 text-xsmall14',
                tab.active
                  ? 'border-b-2 border-neutral-0 font-semibold'
                  : 'font-medium text-neutral-40',
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex w-full flex-1 flex-col pb-14 pt-8 md:flex-row md:gap-x-14 md:pb-[60px] md:pt-0">
        {/* 데스크톱 사이드바 */}
        <aside
          className={clsx('hidden w-full bg-white md:block md:w-[254px]', {
            hidden: isReviewCreatePage || isReviewPage,
          })}
        >
          <div className="sticky top-0 flex flex-col gap-7">
            <h1 className="hidden text-medium24 font-semibold text-neutral-0 md:block">
              마이페이지
            </h1>

            {/* 프로필 섹션 */}
            <div className="flex flex-col rounded-sm border border-neutral-80 p-4">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                {/* 프로필 이미지 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <rect width="48" height="48" rx="24" fill="#EDEEFE" />
                  <path
                    d="M37.5086 36.7493C35.3698 37.9877 31.4594 35.4555 27.6754 30.7697C28.8737 34.551 28.8312 37.5684 27.3065 38.4513C25.5879 39.4464 22.4691 37.45 19.4722 33.7436C19.9403 36.1015 19.5966 38.0098 18.3756 38.7168C16.3493 39.8901 12.6745 37.311 10.1677 32.9564C7.66088 28.6017 7.27129 24.1204 9.29754 22.9471C10.5185 22.2401 12.3381 22.8956 14.1401 24.4812C12.438 20.0248 12.2734 16.3176 13.992 15.3225C15.5168 14.4396 18.1436 15.9114 20.8097 18.843C18.6555 13.2135 18.4242 8.55103 20.5629 7.31262C23.4576 5.63651 29.5975 10.8674 34.2769 18.9961C38.9564 27.1248 40.4032 35.0732 37.5086 36.7493Z"
                    fill="#CACCFC"
                  />
                </svg>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="flex text-xsmall16 font-medium text-neutral-0">
                  김렛츠 님
                </p>

                <div className="flex h-5 flex-nowrap gap-1.5">
                  <span className="flex-shrink-0 text-sm text-neutral-40">
                    희망직무
                  </span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-primary-dark">
                    미설정, 미설정, 미설정, 미설정, 미설정, 미설정, 미설정
                  </span>
                </div>

                <div className="flex h-5 flex-nowrap gap-1.5">
                  <span className="flex-shrink-0 text-sm text-neutral-40">
                    희망기업
                  </span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-primary-dark">
                    미설정
                  </span>
                </div>
              </div>

              <button className="mt-5 w-full rounded-xxs border border-neutral-80 px-3 py-1.5 text-xsmall14 font-normal text-neutral-20">
                프로필 수정
              </button>
            </div>

            {/* 메뉴 아이템 */}
            <nav className="flex flex-col">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(item.path)}
                  className={clsx(
                    'flex items-center rounded-xs px-3 py-2.5 text-left text-xsmall16 font-medium',
                    item.active
                      ? 'bg-primary-5 font-semibold text-primary'
                      : 'text-neutral-40',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* TODO: 배너 (데스크탑) */}
            <div className="hidden h-[120px] w-full bg-neutral-80 md:block"></div>
          </div>
        </aside>

        {/* 컨텐츠 영역 */}
        <main className="flex-1">
          <div>
            {/* 서브 탭 네비게이션 (데스크톱) */}
            {showCareerSubTabs && (
              <nav className="mb-10 hidden border-b border-neutral-85 md:flex md:gap-6">
                {careerSubTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => router.push(tab.path)}
                    className={clsx(
                      'pb-3 text-xsmall16 font-medium',
                      tab.active
                        ? 'border-b-[1.6px] border-neutral-10 font-semibold text-neutral-10'
                        : 'text-neutral-45 hover:bg-white/50',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            )}

            {/* 페이지 컨텐츠 */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPageLayout;
