import * as Sentry from '@sentry/react';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import MentorShell from '@/layout/MentorShell';
import OAuthCallbackPage from '@/pages/login/OAuthCallbackPage';
import SchedulePage from '@/pages/schedule/SchedulePage';
import ProfilePage from '@/pages/profile/ProfilePage';
import ChallengeListPage from '@/pages/challenge/ChallengeListPage';
import ChallengeDetailPage from '@/pages/challenge/ChallengeDetailPage';
import FeedbackManagementPage from '@/pages/feedback-management/FeedbackManagementPage';
import NoticeListPage from '@/pages/notice/NoticeListPage';
import NoticeDetailPage from '@/pages/notice/NoticeDetailPage';
import NotFound from '@/pages/NotFound';

const FeedbackLiveAvailabilityPage = lazy(
  () =>
    import('@/pages/feedback-live-availability/FeedbackLiveAvailabilityPage'),
);
const FeedbackLiveReservationPage = lazy(
  () => import('@/pages/feedback-live-reservation/FeedbackLiveReservationPage'),
);

const RouteFallback = () => (
  <div className="text-xsmall14 text-neutral-40 px-4 py-10">
    페이지를 불러오는 중...
  </div>
);

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<RouteFallback />}>{node}</Suspense>
);

// 라우트 전환을 트랜잭션 경계로 잡아, 에러가 어느 화면에서 났는지 자동으로 남긴다.
// (DSN 이 없으면 Sentry 가 no-op 이라 래핑해도 동작에 차이가 없다.)
const createRouter = Sentry.wrapCreateBrowserRouterV6(createBrowserRouter);

export const router = createRouter([
  {
    path: '/login',
    element: <OAuthCallbackPage />,
  },
  {
    element: <MentorShell />,
    children: [
      { path: '/', element: <SchedulePage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/challenges', element: <ChallengeListPage /> },
      { path: '/challenges/:challengeId', element: <ChallengeDetailPage /> },
      { path: '/feedback-management', element: <FeedbackManagementPage /> },
      {
        path: '/feedback/live-availability',
        element: withSuspense(<FeedbackLiveAvailabilityPage />),
      },
      {
        path: '/feedback/live-reservation',
        element: withSuspense(<FeedbackLiveReservationPage />),
      },
      { path: '/notice', element: <NoticeListPage /> },
      { path: '/notice/:noticeId', element: <NoticeDetailPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
