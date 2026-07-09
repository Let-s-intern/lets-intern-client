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
const LiveMentoringOpenSettingsPage = lazy(
  () => import('@/pages/live-mentoring/open-settings/OpenSettingsPage'),
);
const LiveMentoringDetailSettingsPage = lazy(
  () => import('@/pages/live-mentoring/detail-settings/DetailSettingsPage'),
);
const LiveMentoringSettlementPage = lazy(
  () => import('@/pages/live-mentoring/settlement/SettlementPage'),
);
const LiveMentoringOpenStatusPage = lazy(
  () => import('@/pages/live-mentoring/open-status/OpenStatusPage'),
);

const RouteFallback = () => (
  <div className="text-xsmall14 text-neutral-40 px-4 py-10">
    페이지를 불러오는 중...
  </div>
);

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<RouteFallback />}>{node}</Suspense>
);

export const router = createBrowserRouter([
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
      {
        path: '/live-mentoring/open-settings',
        element: withSuspense(<LiveMentoringOpenSettingsPage />),
      },
      {
        path: '/live-mentoring/detail-settings',
        element: withSuspense(<LiveMentoringDetailSettingsPage />),
      },
      {
        path: '/live-mentoring/settlement',
        element: withSuspense(<LiveMentoringSettlementPage />),
      },
      {
        path: '/live-mentoring/open-status',
        element: withSuspense(<LiveMentoringOpenStatusPage />),
      },
      { path: '/notice', element: <NoticeListPage /> },
      { path: '/notice/:noticeId', element: <NoticeDetailPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
