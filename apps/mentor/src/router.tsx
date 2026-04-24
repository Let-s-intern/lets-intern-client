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
      { path: '/notice', element: <NoticeListPage /> },
      { path: '/notice/:noticeId', element: <NoticeDetailPage /> },
    ],
  },
]);
