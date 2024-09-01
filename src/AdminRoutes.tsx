import { Route } from 'react-router-dom';

import ChallengeOperationAdminLayout from './components/admin/challenge/ui/ChallengeOperationAdminLayout';
import AdminLayout from './components/admin/ui/layout/AdminLayout';
import { CurrentAdminChallengeProvider } from './context/CurrentAdminChallengeProvider';
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
import CouponCreate from './pages/admin/coupon/CouponCreate';
import CouponEdit from './pages/admin/coupon/CouponEdit';
import Coupons from './pages/admin/coupon/Coupons';
import OnlineContents from './pages/admin/online-contents/OnlineContents';
import OnlineContentsCreate from './pages/admin/online-contents/OnlineContentsCreate';
import OnlineContentsEdit from './pages/admin/online-contents/OnlineContentsEdit';
import AttendCheck from './pages/admin/program/AttendCheck';
import ProgramCreate from './pages/admin/program/ProgramCreate';
import ProgramEdit from './pages/admin/program/ProgramEdit';
import AdminPrograms from './pages/admin/program/Programs';
import ProgramUsers from './pages/admin/program/ProgramUsers';
import Reminders from './pages/admin/reminder/Reminders';
import RemindersBootcamp from './pages/admin/reminder/RemindersBootcamp';
import RemindersChallenge from './pages/admin/reminder/RemindersChallenge';
import RemindersLetsChat from './pages/admin/reminder/RemindersLetsChat';
import AdminReportCreatePage from './pages/admin/report/AdminReportCreatePage';
import AdminReportEditPage from './pages/admin/report/AdminReportEditPage';
import AdminReportListPage from './pages/admin/report/AdminReportListPage';
import ReportApplicationsPage from './pages/admin/report/ReportApplicationsPage';
import ReportFeedbackApplicationsPage from './pages/admin/report/ReportFeedbackApplicationsPage';
import AdminReviews from './pages/admin/review/Reviews';
import AdminReviewsDetail from './pages/admin/review/ReviewsDetail';
import UserCreate from './pages/admin/user/UserCreate';
import UserDetail from './pages/admin/user/UserDetail';
import UserEdit from './pages/admin/user/UserEdit';
import UserMemo from './pages/admin/user/UserMemo';
import Users from './pages/admin/user/Users';

// TODO: 평탄화(flatten) 작업 하기
export const getAdminRoutes = () => {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      {/* /admin */}
      <Route path="" element={<AdminPrograms />} />
      <Route path="programs">
        {/* /admin/programs */}
        <Route path="" element={<AdminPrograms />} />
        {/* /admin/programs/create */}
        <Route path="create" element={<ProgramCreate />} />
        <Route path=":programId">
          {/* /admin/programs/1/edit */}
          <Route path="edit" element={<ProgramEdit />} />
          {/* /admin/programs/1/users */}
          <Route path="users" element={<ProgramUsers />} />
          {/* /admin/programs/1/check-attendance */}
          <Route path="check-attendance" element={<AttendCheck />} />
        </Route>
      </Route>
      <Route path="reviews">
        {/* /admin/reviews */}
        <Route path="" element={<AdminReviews />} />
        {/* /admin/reviews/1 */}
        <Route path=":programId" element={<AdminReviewsDetail />} />
      </Route>
      <Route path="users">
        {/* /admin/users */}
        <Route path="" element={<Users />} />
        {/* /admin/users/create */}
        <Route path="create" element={<UserCreate />} />
        <Route path=":userId">
          {/* /admin/users/1 */}
          <Route path="" element={<UserDetail />} />
          {/* /admin/users/1/memo */}
          <Route path="memo" element={<UserMemo />} />
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
      <Route path="online-contents">
        <Route path="" element={<OnlineContents />} />
        <Route path="new" element={<OnlineContentsCreate />} />
        <Route path=":bannerId/edit" element={<OnlineContentsEdit />} />
      </Route>
      <Route path="reminders">
        <Route path="" element={<Reminders />} />
        <Route path="challenge" element={<RemindersChallenge />} />
        <Route path="bootcamp" element={<RemindersBootcamp />} />
        <Route path="lets-chat" element={<RemindersLetsChat />} />
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
      <Route
        path="report/applications/feedback"
        element={<ReportFeedbackApplicationsPage />}
      />
    </Route>
  );
};
