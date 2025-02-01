import { Route } from 'react-router-dom';

import ChallengeOperationAdminLayout from './components/admin/challenge/ui/ChallengeOperationAdminLayout';
import AdminLayout from './components/admin/ui/layout/AdminLayout';
import { CurrentAdminChallengeProvider } from './context/CurrentAdminChallengeProvider';
import AdminHome from './pages/admin/AdminHome';
import MainBannerCreate from './pages/admin/banner/main-banner/MainBannerCreate';
import MainBannerEdit from './pages/admin/banner/main-banner/MainBannerEdit';
import MainBanners from './pages/admin/banner/main-banner/MainBanners';
import PopUpBannerCreate from './pages/admin/banner/pop-up-banner/PopUpBannerCreate';
import PopUpBannerEdit from './pages/admin/banner/pop-up-banner/PopUpBannerEdit';
import PopUpBanners from './pages/admin/banner/pop-up-banner/PopUpBanners';
import ProgramBannerCreate from './pages/admin/banner/program-banner/ProgramBannerCreate';
import ProgramBannerEdit from './pages/admin/banner/program-banner/ProgramBannerEdit';
import ProgramBanners from './pages/admin/banner/program-banner/ProgramBanners';
import TopBarBannerCreate from './pages/admin/banner/top-bar-banner/TopBarBannerCreate';
import TopBarBannerEdit from './pages/admin/banner/top-bar-banner/TopBarBannerEdit';
import TopBarBanners from './pages/admin/banner/top-bar-banner/TopBarBanners';
import BlogCreatePage from './pages/admin/BlogCreatePage';
import BlogEditPage from './pages/admin/BlogEditPage';
import BlogPostListPage from './pages/admin/BlogPostListPage';
import BlogRatingListPage from './pages/admin/BlogRatingListPage';
import ChallengeContents from './pages/admin/challenge/ChallengeContents';
import ChallengeMissionManagement from './pages/admin/challenge/ChallengeMissionManagement';
import ChallengeOperationAttendances from './pages/admin/challenge/ChallengeOperationAttendances';
import ChallengeOperationHome from './pages/admin/challenge/ChallengeOperationHome';
import ChallengeOperationOnboarding from './pages/admin/challenge/ChallengeOperationOnboarding';
import ChallengeOperationParticipants from './pages/admin/challenge/ChallengeOperationParticipants';
import ChallengeOperationPayback from './pages/admin/challenge/ChallengeOperationPayback';
import ChallengeOperationRegisterMission from './pages/admin/challenge/ChallengeOperationRegisterMission';
import ChallengeCreate from './pages/admin/ChallengeCreate';
import ChallengeEdit from './pages/admin/ChallengeEdit';
import CouponCreate from './pages/admin/coupon/CouponCreate';
import CouponEdit from './pages/admin/coupon/CouponEdit';
import Coupons from './pages/admin/coupon/Coupons';
import LiveCreate from './pages/admin/LiveCreate';
import LiveEdit from './pages/admin/LiveEdit';
import ProgramCreate from './pages/admin/program/ProgramCreate';
import ProgramEdit from './pages/admin/program/ProgramEdit';
import AdminPrograms from './pages/admin/program/Programs';
import ProgramUsers from './pages/admin/program/ProgramUsers';
import AdminReportCreatePage from './pages/admin/report/AdminReportCreatePage';
import AdminReportEditPage from './pages/admin/report/AdminReportEditPage';
import AdminReportListPage from './pages/admin/report/AdminReportListPage';
import ReportApplicationsPage from './pages/admin/report/ReportApplicationsPage';
import AdminReviews from './pages/admin/review/Reviews';
import UserDetail from './pages/admin/user/UserDetail';
import UserEdit from './pages/admin/user/UserEdit';
import Users from './pages/admin/user/Users';
import VodCreate from './pages/admin/VodCreate';
import VodEdit from './pages/admin/VodEdit';

// TODO: 평탄화(flatten) 작업 하기
export const getAdminRoutes = () => {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      {/* /admin */}
      <Route path="" element={<AdminHome />} />

      <Route path="reviews">
        {/* /admin/reviews */}
        <Route path="" element={<AdminReviews />} />
      </Route>
      <Route path="users">
        {/* /admin/users */}
        <Route path="" element={<Users />} />
        <Route path=":userId">
          {/* /admin/users/1 */}
          <Route path="" element={<UserDetail />} />
          {/* /admin/users/1/edit */}
          <Route path="edit" element={<UserEdit />} />
        </Route>
      </Route>
      {/* /admin/coupons */}
      <Route path="coupons">
        {/* /admin/coupons */}
        <Route path="" element={<Coupons />} />
        {/* /admin/coupons/new */}
        <Route path="new" element={<CouponCreate />} />
        {/* /admin/coupons/1/edit */}
        <Route path=":couponId/edit" element={<CouponEdit />} />
      </Route>
      <Route path="banner">
        <Route path="main-banners">
          <Route path="" element={<MainBanners />} />
          <Route path="new" element={<MainBannerCreate />} />
          <Route path=":bannerId/edit" element={<MainBannerEdit />} />
        </Route>
        <Route path="top-bar-banners">
          <Route path="" element={<TopBarBanners />} />
          <Route path="new" element={<TopBarBannerCreate />} />
          <Route path=":bannerId/edit" element={<TopBarBannerEdit />} />
        </Route>
        <Route path="pop-up">
          <Route path="" element={<PopUpBanners />} />
          <Route path="new" element={<PopUpBannerCreate />} />
          <Route path=":bannerId/edit" element={<PopUpBannerEdit />} />
        </Route>
        <Route path="program-banners">
          <Route path="" element={<ProgramBanners />} />
          <Route path="new" element={<ProgramBannerCreate />} />
          <Route path=":bannerId/edit" element={<ProgramBannerEdit />} />
        </Route>
      </Route>
      {/* /admin/challenge/operation */}
      <Route
        path="challenge/operation"
        element={<ChallengeOperationOnboarding />}
      />
      {/* /admin/challenge/operation/1 */}
      <Route
        path="challenge/operation/:programId"
        element={
          <CurrentAdminChallengeProvider>
            <ChallengeOperationAdminLayout />
          </CurrentAdminChallengeProvider>
        }
      >
        {/* /admin/challenge/operation/1/home */}
        <Route path="home" element={<ChallengeOperationHome />} />

        {/* /admin/challenge/operation/1/register-mission */}
        <Route
          path="register-mission"
          element={<ChallengeOperationRegisterMission />}
        />

        {/* /admin/challenge/operation/1/attendances */}
        <Route path="attendances" element={<ChallengeOperationAttendances />} />

        {/* /admin/challenge/operation/1/participants */}
        <Route
          path="participants"
          element={<ChallengeOperationParticipants />}
        />

        {/* /admin/challenge/operation/1/payback */}
        <Route path="payback" element={<ChallengeOperationPayback />} />
      </Route>
      {/* /admin/challenge/contents */}
      <Route path="/admin/challenge/contents" element={<ChallengeContents />} />
      {/* /admin/challenge/missions */}
      <Route
        path="/admin/challenge/missions"
        element={<ChallengeMissionManagement />}
      />

      {/* 블로그 */}
      <Route path="blog/list" element={<BlogPostListPage />} />
      <Route path="blog/create" element={<BlogCreatePage />} />
      <Route path="blog/edit/:id" element={<BlogEditPage />} />
      <Route path="blog/reviews" element={<BlogRatingListPage />} />

      {/* 서류진단 */}
      <Route path="report/list" element={<AdminReportListPage />} />
      <Route path="report/create" element={<AdminReportCreatePage />} />
      <Route path="report/edit/:id" element={<AdminReportEditPage />} />
      <Route path="report/applications" element={<ReportApplicationsPage />} />

      {/* 프로그램 */}
      <Route path="programs" element={<AdminPrograms />} />

      {/* 프로그램 생성/편집 옛날 버전 */}
      <Route path="programs/create" element={<ProgramCreate />} />
      <Route path="programs/:programId/edit" element={<ProgramEdit />} />

      {/* 프로그램 생성/편집 NEW버전 */}
      <Route path="challenge/create" element={<ChallengeCreate />} />
      <Route path="challenge/:challengeId/edit" element={<ChallengeEdit />} />
      <Route path="live/create" element={<LiveCreate />} />
      <Route path="live/:liveId/edit" element={<LiveEdit />} />
      <Route path="vod/create" element={<VodCreate />} />
      <Route path="vod/:vodId/edit" element={<VodEdit />} />

      {/* 프로그램 참여자 */}
      <Route path="programs/:programId/users" element={<ProgramUsers />} />
    </Route>
  );
};
