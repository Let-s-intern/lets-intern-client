/** 사용하지 않습니다. react-query 이슈로 사용하기 어려움 */
import { RouteObject } from 'react-router-dom';
import { clientOnly } from 'vike-react/clientOnly';

const ChallengeOperationAdminLayout = clientOnly(
  () => import('./components/admin/challenge/ui/ChallengeOperationAdminLayout'),
);
const AdminLayout = clientOnly(
  () => import('./components/admin/ui/layout/AdminLayout'),
);
const CurrentAdminChallengeProvider = clientOnly(() =>
  import('./context/CurrentAdminChallengeProvider').then(
    (m) => m.CurrentAdminChallengeProvider,
  ),
);
const MainBannerCreate = clientOnly(
  () => import('./pages/admin/banner/main-banner/MainBannerCreate'),
);
const MainBannerEdit = clientOnly(
  () => import('./pages/admin/banner/main-banner/MainBannerEdit'),
);
const MainBanners = clientOnly(
  () => import('./pages/admin/banner/main-banner/MainBanners'),
);
const PopUpBannerCreate = clientOnly(
  () => import('./pages/admin/banner/pop-up-banner/PopUpBannerCreate'),
);
const PopUpBannerEdit = clientOnly(
  () => import('./pages/admin/banner/pop-up-banner/PopUpBannerEdit'),
);
const PopUpBanners = clientOnly(
  () => import('./pages/admin/banner/pop-up-banner/PopUpBanners'),
);
const ProgramBannerCreate = clientOnly(
  () => import('./pages/admin/banner/program-banner/ProgramBannerCreate'),
);
const ProgramBannerEdit = clientOnly(
  () => import('./pages/admin/banner/program-banner/ProgramBannerEdit'),
);
const ProgramBanners = clientOnly(
  () => import('./pages/admin/banner/program-banner/ProgramBanners'),
);
const TopBarBannerCreate = clientOnly(
  () => import('./pages/admin/banner/top-bar-banner/TopBarBannerCreate'),
);
const TopBarBannerEdit = clientOnly(
  () => import('./pages/admin/banner/top-bar-banner/TopBarBannerEdit'),
);
const TopBarBanners = clientOnly(
  () => import('./pages/admin/banner/top-bar-banner/TopBarBanners'),
);
const BlogCreatePage = clientOnly(() => import('./pages/admin/BlogCreatePage'));
const BlogEditPage = clientOnly(() => import('./pages/admin/BlogEditPage'));
const BlogPostListPage = clientOnly(
  () => import('./pages/admin/BlogPostListPage'),
);
const BlogRatingListPage = clientOnly(
  () => import('./pages/admin/BlogRatingListPage'),
);
const ChallengeContents = clientOnly(
  () => import('./pages/admin/challenge/ChallengeContents'),
);
const ChallengeMissionManagement = clientOnly(
  () => import('./pages/admin/challenge/ChallengeMissionManagement'),
);
const ChallengeOperationAttendances = clientOnly(
  () => import('./pages/admin/challenge/ChallengeOperationAttendances'),
);
const ChallengeOperationHome = clientOnly(
  () => import('./pages/admin/challenge/ChallengeOperationHome'),
);
const ChallengeOperationOnboarding = clientOnly(
  () => import('./pages/admin/challenge/ChallengeOperationOnboarding'),
);
const ChallengeOperationParticipants = clientOnly(
  () => import('./pages/admin/challenge/ChallengeOperationParticipants'),
);
const ChallengeOperationPayback = clientOnly(
  () => import('./pages/admin/challenge/ChallengeOperationPayback'),
);
const ChallengeOperationRegisterMission = clientOnly(
  () => import('./pages/admin/challenge/ChallengeOperationRegisterMission'),
);
const CouponCreate = clientOnly(
  () => import('./pages/admin/coupon/CouponCreate'),
);
const CouponEdit = clientOnly(() => import('./pages/admin/coupon/CouponEdit'));
const Coupons = clientOnly(() => import('./pages/admin/coupon/Coupons'));
const ProgramCreate = clientOnly(
  () => import('./pages/admin/program/ProgramCreate'),
);
const ProgramEdit = clientOnly(
  () => import('./pages/admin/program/ProgramEdit'),
);
const AdminPrograms = clientOnly(
  () => import('./pages/admin/program/Programs'),
);
const ProgramUsers = clientOnly(
  () => import('./pages/admin/program/ProgramUsers'),
);
const UserDetail = clientOnly(() => import('./pages/admin/user/UserDetail'));
const UserEdit = clientOnly(() => import('./pages/admin/user/UserEdit'));
const Users = clientOnly(() => import('./pages/admin/user/Users'));

export const adminRoute: RouteObject = {
  path: 'admin',
  element: <AdminLayout />,
  children: [
    { index: true, element: <AdminPrograms /> },
    {
      path: 'programs',
      children: [
        { index: true, element: <AdminPrograms /> },
        { path: 'create', element: <ProgramCreate /> },
        {
          path: ':programId',
          children: [
            { path: 'edit', element: <ProgramEdit /> },
            { path: 'users', element: <ProgramUsers /> },
          ],
        },
      ],
    },
    {
      path: 'users',
      children: [
        { index: true, element: <Users /> },
        {
          path: ':userId',
          children: [
            { index: true, element: <UserDetail /> },
            { path: 'edit', element: <UserEdit /> },
          ],
        },
      ],
    },
    {
      path: 'coupons',
      children: [
        { index: true, element: <Coupons /> },
        { path: 'new', element: <CouponCreate /> },
        { path: ':couponId/edit', element: <CouponEdit /> },
      ],
    },
    {
      path: 'banner',
      children: [
        {
          path: 'main-banners',
          children: [
            { index: true, element: <MainBanners /> },
            { path: 'new', element: <MainBannerCreate /> },
            { path: ':bannerId/edit', element: <MainBannerEdit /> },
          ],
        },
        {
          path: 'top-bar-banners',
          children: [
            { index: true, element: <TopBarBanners /> },
            { path: 'new', element: <TopBarBannerCreate /> },
            { path: ':bannerId/edit', element: <TopBarBannerEdit /> },
          ],
        },
        {
          path: 'pop-up',
          children: [
            { index: true, element: <PopUpBanners /> },
            { path: 'new', element: <PopUpBannerCreate /> },
            { path: ':bannerId/edit', element: <PopUpBannerEdit /> },
          ],
        },
        {
          path: 'program-banners',
          children: [
            { index: true, element: <ProgramBanners /> },
            { path: 'new', element: <ProgramBannerCreate /> },
            { path: ':bannerId/edit', element: <ProgramBannerEdit /> },
          ],
        },
      ],
    },
    {
      path: 'challenge/operation',
      element: <ChallengeOperationOnboarding />,
    },
    {
      path: 'challenge/operation/:programId',
      element: (
        <CurrentAdminChallengeProvider>
          <ChallengeOperationAdminLayout />
        </CurrentAdminChallengeProvider>
      ),
      children: [
        { path: 'home', element: <ChallengeOperationHome /> },
        {
          path: 'register-mission',
          element: <ChallengeOperationRegisterMission />,
        },
        { path: 'attendances', element: <ChallengeOperationAttendances /> },
        { path: 'participants', element: <ChallengeOperationParticipants /> },
        { path: 'payback', element: <ChallengeOperationPayback /> },
      ],
    },
    { path: 'challenge/contents', element: <ChallengeContents /> },
    { path: 'challenge/missions', element: <ChallengeMissionManagement /> },
    { path: 'blog/list', element: <BlogPostListPage /> },
    { path: 'blog/create', element: <BlogCreatePage /> },
    { path: 'blog/edit/:id', element: <BlogEditPage /> },
    { path: 'blog/reviews', element: <BlogRatingListPage /> },
  ],
};
