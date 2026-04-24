import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AdminShell } from './layout/AdminShell';
import NotFound from './pages/NotFound';

// 무거운 페이지는 lazy로 분리하여 초기 번들 최소화
const AdminHome = lazy(() => import('./pages/pages/AdminHome'));
const Programs = lazy(() => import('./pages/pages/program/Programs'));
const ChallengeCreate = lazy(() => import('./pages/pages/ChallengeCreate'));
const ChallengeEdit = lazy(() => import('./pages/pages/ChallengeEdit'));
const LiveCreate = lazy(() => import('./pages/pages/LiveCreate'));
const LiveEdit = lazy(() => import('./pages/pages/LiveEdit'));
const VodCreate = lazy(() => import('./pages/pages/VodCreate'));
const VodEdit = lazy(() => import('./pages/pages/VodEdit'));
const GuidebookCreate = lazy(() => import('./pages/pages/GuidebookCreate'));
const GuidebookEdit = lazy(() => import('./pages/pages/GuidebookEdit'));
const ProgramUsers = lazy(() => import('./pages/pages/program/ProgramUsers'));

const ChallengeContents = lazy(
  () => import('./pages/pages/challenge/ChallengeContents'),
);
const ChallengeMissionManagement = lazy(
  () => import('./pages/pages/challenge/ChallengeMissionManagement'),
);
const ChallengeOperationOnboarding = lazy(
  () => import('./pages/pages/challenge/ChallengeOperationOnboarding'),
);
const ChallengeOperationHome = lazy(
  () => import('./pages/pages/challenge/ChallengeOperationHome'),
);
const ChallengeOperationAttendances = lazy(
  () => import('./pages/pages/challenge/ChallengeOperationAttendances'),
);
const ChallengeOperationParticipants = lazy(
  () => import('./pages/pages/challenge/ChallengeOperationParticipants'),
);
const ChallengeOperationPayback = lazy(
  () => import('./pages/pages/challenge/ChallengeOperationPayback'),
);
const ChallengeOperationRegisterMission = lazy(
  () => import('./pages/pages/challenge/ChallengeOperationRegisterMission'),
);
const ChallengeOperationFeedbackPage = lazy(
  () =>
    import(
      './pages/pages/challenge/feedback-operation/ChallengeOperationFeedbackPage'
    ),
);
const ChallengeFeedbackPage = lazy(
  () => import('./pages/pages/challenge/feedback/ChallengeFeedbackPage'),
);
const FeedbackParticipantPage = lazy(
  () => import('./pages/pages/challenge/feedback/FeedbackParticipantPage'),
);
const MentorMenteeAssignment = lazy(
  () => import('./pages/pages/challenge/mentor-assignment/MentorMenteeAssignment'),
);

const AdminReportListPage = lazy(
  () => import('./pages/pages/report/AdminReportListPage'),
);
const AdminReportCreatePage = lazy(
  () => import('./pages/pages/report/AdminReportCreatePage'),
);
const AdminReportEditPage = lazy(
  () => import('./pages/pages/report/AdminReportEditPage'),
);
const ReportApplicationsPage = lazy(
  () => import('./pages/pages/report/ReportApplicationsPage'),
);

const UserDetail = lazy(() => import('./pages/pages/user/UserDetail'));
const UserEdit = lazy(() => import('./pages/pages/user/UserEdit'));
const AdminMentorPage = lazy(
  () => import('./pages/pages/user/AdminMentorPage'),
);
const AdminMentorDetailPage = lazy(
  () => import('./pages/pages/user/AdminMentorDetailPage'),
);
const AdminMentorRegisterPage = lazy(
  () => import('./pages/pages/user/AdminMentorRegisterPage'),
);

const Coupons = lazy(() => import('./pages/pages/coupon/Coupons'));
const CouponEditor = lazy(() => import('./pages/coupon/CouponEditor'));

const BlogPostListPage = lazy(() => import('./pages/blog/BlogPostListPage'));
const BlogCreatePage = lazy(() => import('./pages/blog/BlogCreatePage'));
const BlogEditPage = lazy(() => import('./pages/blog/BlogEditPage'));
const BlogRatingTable = lazy(() => import('./pages/blog/BlogRatingTable'));
const BlogBannerListPage = lazy(
  () => import('./pages/blog/BlogBannerListPage'),
);
const BlogBannerCreatePage = lazy(
  () => import('./pages/blog/BlogBannerCreatePage'),
);
const BlogBannerEditPage = lazy(
  () => import('./pages/blog/BlogBannerEditPage'),
);

const MagnetTable = lazy(() => import('./pages/magnet/MagnetTable'));
const MagnetPostPage = lazy(() => import('./pages/magnet/MagnetPostPage'));

const MainBanners = lazy(
  () => import('./pages/pages/home/main-banner/MainBanners'),
);
const MainBannerCreate = lazy(
  () => import('./pages/pages/home/main-banner/MainBannerCreate'),
);
const MainBannerEdit = lazy(
  () => import('./pages/pages/home/main-banner/MainBannerEdit'),
);
const BottomBanners = lazy(
  () => import('./pages/pages/home/bottom-banner/BottomBanners'),
);
const BottomBannerCreate = lazy(
  () => import('./pages/pages/home/bottom-banner/BottomBannerCreate'),
);
const BottomBannerEdit = lazy(
  () => import('./pages/pages/home/bottom-banner/BottomBannerEdit'),
);
const HomeCurationListPage = lazy(
  () => import('./pages/pages/home/curation/HomeCurationListPage'),
);
const HomeCurationCreatePage = lazy(
  () => import('./pages/pages/home/curation/HomeCurationCreatePage'),
);
const HomeCurationEditPage = lazy(
  () => import('./pages/pages/home/curation/HomeCurationEditPage'),
);

const PopUpBanners = lazy(
  () => import('./pages/pages/banner/pop-up-banner/PopUpBanners'),
);
const PopUpBannerCreate = lazy(
  () => import('./pages/pages/banner/pop-up-banner/PopUpBannerCreate'),
);
const PopUpBannerEdit = lazy(
  () => import('./pages/pages/banner/pop-up-banner/PopUpBannerEdit'),
);
const TopBarBanners = lazy(
  () => import('./pages/pages/banner/top-bar-banner/TopBarBanners'),
);
const TopBarBannerCreate = lazy(
  () => import('./pages/pages/banner/top-bar-banner/TopBarBannerCreate'),
);
const TopBarBannerEdit = lazy(
  () => import('./pages/pages/banner/top-bar-banner/TopBarBannerEdit'),
);
const ProgramBanners = lazy(
  () => import('./pages/pages/banner/program-banner/ProgramBanners'),
);
const ProgramBannerCreate = lazy(
  () => import('./pages/pages/banner/program-banner/ProgramBannerCreate'),
);
const ProgramBannerEdit = lazy(
  () => import('./pages/pages/banner/program-banner/ProgramBannerEdit'),
);

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={null}>{node}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: (
      <AdminShell>
        <Outlet />
      </AdminShell>
    ),
    children: [
      { path: '/', element: withSuspense(<AdminHome />) },
      { path: '/programs', element: withSuspense(<Programs />) },
      { path: '/challenge/create', element: withSuspense(<ChallengeCreate />) },
      {
        path: '/challenge/:challengeId/edit',
        element: withSuspense(<ChallengeEdit />),
      },
      { path: '/live/create', element: withSuspense(<LiveCreate />) },
      { path: '/live/:liveId/edit', element: withSuspense(<LiveEdit />) },
      { path: '/vod/create', element: withSuspense(<VodCreate />) },
      { path: '/vod/:vodId/edit', element: withSuspense(<VodEdit />) },
      { path: '/guidebook/create', element: withSuspense(<GuidebookCreate />) },
      {
        path: '/guidebook/:guidebookId/edit',
        element: withSuspense(<GuidebookEdit />),
      },
      {
        path: '/programs/:programId/users',
        element: withSuspense(<ProgramUsers />),
      },

      // 챌린지 운영
      {
        path: '/challenge/contents',
        element: withSuspense(<ChallengeContents />),
      },
      {
        path: '/challenge/missions',
        element: withSuspense(<ChallengeMissionManagement />),
      },
      {
        path: '/challenge/operation',
        element: withSuspense(<ChallengeOperationOnboarding />),
      },
      {
        path: '/challenge/operation/:programId/home',
        element: withSuspense(<ChallengeOperationHome />),
      },
      {
        path: '/challenge/operation/:programId/attendances',
        element: withSuspense(<ChallengeOperationAttendances />),
      },
      {
        path: '/challenge/operation/:programId/participants',
        element: withSuspense(<ChallengeOperationParticipants />),
      },
      {
        path: '/challenge/operation/:programId/payback',
        element: withSuspense(<ChallengeOperationPayback />),
      },
      {
        path: '/challenge/operation/:programId/register-mission',
        element: withSuspense(<ChallengeOperationRegisterMission />),
      },
      {
        path: '/challenge/feedback-operation',
        element: withSuspense(<ChallengeOperationFeedbackPage />),
      },
      {
        path: '/challenge/operation/:programId/feedback/mission/:missionId/participants',
        element: withSuspense(<FeedbackParticipantPage />),
      },
      {
        path: '/challenge/operation/:programId/mission/:missionId/participant/:userId/feedback',
        element: withSuspense(<ChallengeFeedbackPage />),
      },
      {
        path: '/challenge/mentor-assignment/:programId',
        element: withSuspense(<MentorMenteeAssignment />),
      },

      // 리포트
      { path: '/report/list', element: withSuspense(<AdminReportListPage />) },
      {
        path: '/report/create',
        element: withSuspense(<AdminReportCreatePage />),
      },
      {
        path: '/report/edit/:id',
        element: withSuspense(<AdminReportEditPage />),
      },
      {
        path: '/report/applications',
        element: withSuspense(<ReportApplicationsPage />),
      },

      // 유저/멘토
      { path: '/users/:userId', element: withSuspense(<UserDetail />) },
      { path: '/users/:userId/edit', element: withSuspense(<UserEdit />) },
      { path: '/mentors', element: withSuspense(<AdminMentorPage />) },
      {
        path: '/mentors/register',
        element: withSuspense(<AdminMentorRegisterPage />),
      },
      {
        path: '/mentors/:mentorId',
        element: withSuspense(<AdminMentorDetailPage />),
      },

      // 쿠폰
      { path: '/coupons', element: withSuspense(<Coupons />) },
      { path: '/coupons/new', element: withSuspense(<CouponEditor />) },
      {
        path: '/coupons/:couponId/edit',
        element: withSuspense(<CouponEditor />),
      },

      // 블로그
      { path: '/blog/list', element: withSuspense(<BlogPostListPage />) },
      { path: '/blog/create', element: withSuspense(<BlogCreatePage />) },
      { path: '/blog/edit/:id', element: withSuspense(<BlogEditPage />) },
      { path: '/blog/reviews', element: withSuspense(<BlogRatingTable />) },
      { path: '/blog/banner', element: withSuspense(<BlogBannerListPage />) },
      {
        path: '/blog/banner/create',
        element: withSuspense(<BlogBannerCreatePage />),
      },
      {
        path: '/blog/banner/edit/:id',
        element: withSuspense(<BlogBannerEditPage />),
      },

      // 마그넷
      { path: '/magnet/list', element: withSuspense(<MagnetTable />) },
      {
        path: '/magnet/:id/post',
        element: withSuspense(<MagnetPostPage magnetId="" />),
      },

      // 홈 배너/큐레이션
      { path: '/home/main-banners', element: withSuspense(<MainBanners />) },
      {
        path: '/home/main-banners/new',
        element: withSuspense(<MainBannerCreate />),
      },
      {
        path: '/home/main-banners/:bannerId/edit',
        element: withSuspense(<MainBannerEdit />),
      },
      {
        path: '/home/bottom-banners',
        element: withSuspense(<BottomBanners />),
      },
      {
        path: '/home/bottom-banners/new',
        element: withSuspense(<BottomBannerCreate />),
      },
      {
        path: '/home/bottom-banners/:bannerId/edit',
        element: withSuspense(<BottomBannerEdit />),
      },
      {
        path: '/home/curation',
        element: withSuspense(<HomeCurationListPage />),
      },
      {
        path: '/home/curation/create',
        element: withSuspense(<HomeCurationCreatePage />),
      },
      {
        path: '/home/curation/:id/edit',
        element: withSuspense(<HomeCurationEditPage />),
      },

      // 배너
      { path: '/banner/pop-up', element: withSuspense(<PopUpBanners />) },
      {
        path: '/banner/pop-up/new',
        element: withSuspense(<PopUpBannerCreate />),
      },
      {
        path: '/banner/pop-up/:bannerId/edit',
        element: withSuspense(<PopUpBannerEdit />),
      },
      {
        path: '/banner/top-bar-banners',
        element: withSuspense(<TopBarBanners />),
      },
      {
        path: '/banner/top-bar-banners/new',
        element: withSuspense(<TopBarBannerCreate />),
      },
      {
        path: '/banner/top-bar-banners/:bannerId/edit',
        element: withSuspense(<TopBarBannerEdit />),
      },
      {
        path: '/banner/program-banners',
        element: withSuspense(<ProgramBanners />),
      },
      {
        path: '/banner/program-banners/new',
        element: withSuspense(<ProgramBannerCreate />),
      },
      {
        path: '/banner/program-banners/:bannerId/edit',
        element: withSuspense(<ProgramBannerEdit />),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
