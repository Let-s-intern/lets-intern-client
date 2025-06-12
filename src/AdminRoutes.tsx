import { Route } from 'react-router-dom';

import ChallengeOperationAdminLayout from './components/admin/challenge/ui/ChallengeOperationAdminLayout';
import AdminLayout from './components/admin/ui/layout/AdminLayout';
import { CurrentAdminChallengeProvider } from './context/CurrentAdminChallengeProvider';
import AdminHome from './router-pages/admin/AdminHome';
import PopUpBannerCreate from './router-pages/admin/banner/pop-up-banner/PopUpBannerCreate';
import PopUpBannerEdit from './router-pages/admin/banner/pop-up-banner/PopUpBannerEdit';
import PopUpBanners from './router-pages/admin/banner/pop-up-banner/PopUpBanners';
import ProgramBannerCreate from './router-pages/admin/banner/program-banner/ProgramBannerCreate';
import ProgramBannerEdit from './router-pages/admin/banner/program-banner/ProgramBannerEdit';
import ProgramBanners from './router-pages/admin/banner/program-banner/ProgramBanners';
import TopBarBannerCreate from './router-pages/admin/banner/top-bar-banner/TopBarBannerCreate';
import TopBarBannerEdit from './router-pages/admin/banner/top-bar-banner/TopBarBannerEdit';
import TopBarBanners from './router-pages/admin/banner/top-bar-banner/TopBarBanners';
import BlogBannerCreatePage from './router-pages/admin/blog/BlogBannerCreatePage';
import BlogBannerEditPage from './router-pages/admin/blog/BlogBannerEditPage';
import BlogBannerListPage from './router-pages/admin/blog/BlogBannerListPage';
import BlogCreatePage from './router-pages/admin/blog/BlogCreatePage';
import BlogEditPage from './router-pages/admin/blog/BlogEditPage';
import BlogPostListPage from './router-pages/admin/blog/BlogPostListPage';
import BlogRatingListPage from './router-pages/admin/blog/BlogRatingListPage';
import ChallengeContents from './router-pages/admin/challenge/ChallengeContents';
import ChallengeMissionManagement from './router-pages/admin/challenge/ChallengeMissionManagement';
import ChallengeOperationAttendances from './router-pages/admin/challenge/ChallengeOperationAttendances';
import ChallengeOperationFeedbackPage from './router-pages/admin/challenge/ChallengeOperationFeedbackPage';
import ChallengeOperationHome from './router-pages/admin/challenge/ChallengeOperationHome';
import ChallengeOperationOnboarding from './router-pages/admin/challenge/ChallengeOperationOnboarding';
import ChallengeOperationParticipants from './router-pages/admin/challenge/ChallengeOperationParticipants';
import ChallengeOperationPayback from './router-pages/admin/challenge/ChallengeOperationPayback';
import ChallengeOperationRegisterMission from './router-pages/admin/challenge/ChallengeOperationRegisterMission';
import FeedbackParticipantPage from './router-pages/admin/challenge/FeedbackParticipantPage';
import ChallengeCreate from './router-pages/admin/ChallengeCreate';
import ChallengeEdit from './router-pages/admin/ChallengeEdit';
import CouponCreate from './router-pages/admin/coupon/CouponCreate';
import CouponEdit from './router-pages/admin/coupon/CouponEdit';
import Coupons from './router-pages/admin/coupon/Coupons';
import BottomBannerCreate from './router-pages/admin/home/bottom-banner/BottomBannerCreate';
import BottomBannerEdit from './router-pages/admin/home/bottom-banner/BottomBannerEdit';
import BottomBanners from './router-pages/admin/home/bottom-banner/BottomBanners';
import HomeCurationCreatePage from './router-pages/admin/home/curation/HomeCurationCreatePage';
import HomeCurationEditPage from './router-pages/admin/home/curation/HomeCurationEditPage';
import HomeCurationListPage from './router-pages/admin/home/curation/HomeCurationListPage';
import MainBannerCreate from './router-pages/admin/home/main-banner/MainBannerCreate';
import MainBannerEdit from './router-pages/admin/home/main-banner/MainBannerEdit';
import MainBanners from './router-pages/admin/home/main-banner/MainBanners';
import LiveCreate from './router-pages/admin/LiveCreate';
import LiveEdit from './router-pages/admin/LiveEdit';
import ProgramCreate from './router-pages/admin/program/ProgramCreate';
import ProgramEdit from './router-pages/admin/program/ProgramEdit';
import AdminPrograms from './router-pages/admin/program/Programs';
import ProgramUsers from './router-pages/admin/program/ProgramUsers';
import AdminReportCreatePage from './router-pages/admin/report/AdminReportCreatePage';
import AdminReportEditPage from './router-pages/admin/report/AdminReportEditPage';
import AdminReportListPage from './router-pages/admin/report/AdminReportListPage';
import ReportApplicationsPage from './router-pages/admin/report/ReportApplicationsPage';
import AdminBlogReviewListPage from './router-pages/admin/review/AdminBlogReviewListPage';
import AdminChallengeReviewListPage from './router-pages/admin/review/AdminChallengeReviewListPage';
import AdminLiveReviewListPage from './router-pages/admin/review/AdminLiveReviewListPage';
import AdminMissionReviewListPage from './router-pages/admin/review/AdminMissionReviewListPage';
import AdminReportReviewListPage from './router-pages/admin/review/AdminReportReviewListPage';
import AdminUsersPage from './router-pages/admin/user/AdminUsersPage';
import UserDetail from './router-pages/admin/user/UserDetail';
import UserEdit from './router-pages/admin/user/UserEdit';
import VodCreate from './router-pages/admin/VodCreate';
import VodEdit from './router-pages/admin/VodEdit';

// TODO: 평탄화(flatten) 작업 하기
export const getAdminRoutes = () => {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      {/* /admin */}
      <Route path="" element={<AdminHome />} />
      <Route path="review/mission" element={<AdminMissionReviewListPage />} />
      <Route
        path="review/challenge"
        element={<AdminChallengeReviewListPage />}
      />
      <Route path="review/live" element={<AdminLiveReviewListPage />} />
      <Route path="review/blog" element={<AdminBlogReviewListPage />} />
      <Route path="review/report" element={<AdminReportReviewListPage />} />

      <Route path="users">
        {/* /admin/users */}
        <Route path="" element={<AdminUsersPage />} />
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
      <Route path="home">
        <Route path="curation">
          <Route path="" element={<HomeCurationListPage />} />
          <Route path="create" element={<HomeCurationCreatePage />} />
          <Route path=":id/edit" element={<HomeCurationEditPage />} />
        </Route>
        <Route path="main-banners">
          <Route path="" element={<MainBanners />} />
          <Route path="new" element={<MainBannerCreate />} />
          <Route path=":bannerId/edit" element={<MainBannerEdit />} />
        </Route>
        <Route path="bottom-banners">
          <Route path="" element={<BottomBanners />} />
          <Route path="new" element={<BottomBannerCreate />} />
          <Route path=":bannerId/edit" element={<BottomBannerEdit />} />
        </Route>
      </Route>
      <Route path="banner">
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

        {/* /admin/challenge/operation/{challengeId}/participants */}
        <Route
          path="participants"
          element={<ChallengeOperationParticipants />}
        />

        {/* /admin/challenge/operation/1/payback */}
        <Route path="payback" element={<ChallengeOperationPayback />} />

        {/* 챌린지 운영 > 피드백 페이지 /admin/challenge/operation/{challengeId}/feedback */}
        <Route path="feedback" element={<ChallengeOperationFeedbackPage />} />

        {/* 챌린지 운영 > 피드백 > 참여자 페이지 /admin/challenge/operation/{challengeId}/feedback/mission/{missionId}/participants */}
        <Route
          path="feedback/mission/:missionId/participants"
          element={<FeedbackParticipantPage />}
        />
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
      <Route path="blog/banner" element={<BlogBannerListPage />} />
      <Route path="blog/banner/create" element={<BlogBannerCreatePage />} />
      <Route path="blog/banner/edit/:id" element={<BlogBannerEditPage />} />

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
