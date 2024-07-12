import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ChallengeOperationAdminLayout from './components/admin/challenge/ui/ChallengeOperationAdminLayout';
import AdminLayout from './components/admin/ui/layout/AdminLayout';
import ChallengeLayout from './components/common/challenge/ui/layout/ChallengeLayout';
import Layout from './components/common/ui/layout/Layout';
import ScrollToTop from './components/ui/scroll-to-top/ScrollToTop';
import { CurrentAdminChallengeProvider } from './context/CurrentAdminChallengeProvider';
import { CurrentChallengeProvider } from './context/CurrentChallengeProvider';
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
import AdminReviews from './pages/admin/review/Reviews';
import AdminReviewsDetail from './pages/admin/review/ReviewsDetail';
import UserCreate from './pages/admin/user/UserCreate';
import UserDetail from './pages/admin/user/UserDetail';
import UserEdit from './pages/admin/user/UserEdit';
import UserMemo from './pages/admin/user/UserMemo';
import Users from './pages/admin/user/Users';
import About from './pages/common/about/About';
import FindPassword from './pages/common/auth/FindPassword';
import Login from './pages/common/auth/Login';
import SignUp from './pages/common/auth/SignUp';
import ChallengeDashboard from './pages/common/challenge/ChallengeDashboard';
import ChallengeUserInfo from './pages/common/challenge/ChallengeUserInfo';
import MyChallengeDashboard from './pages/common/challenge/MyChallengeDashboard';
import Home from './pages/common/home/Home';
import MentorNotificationAfter from './pages/common/mentor/MentorNotificationAfter';
import MentorNotificationBefore from './pages/common/mentor/MentorNotificationBefore';
import Application from './pages/common/mypage/Application';
import MyPage from './pages/common/mypage/MyPage';
import Privacy from './pages/common/mypage/Privacy';
import Review from './pages/common/mypage/Review';
import PaymentFail from './pages/common/program/PaymentFail';
import PaymentSuccess from './pages/common/program/PaymentSuccess';
import ProgramDetail from './pages/common/program/ProgramDetail';
import Programs from './pages/common/program/Programs';
import ProgramDetailRegacy from './pages/common/program/regacy/ProgramDetailRegacy';
import SelectPaymentPage from './pages/common/program/SelectPaymentPage';
import ReviewCreateRegacy from './pages/common/review/regacy/ReviewCreateRegacy';
import ReviewCreate from './pages/common/review/ReviewCreate';
import ReviewDetail from './pages/common/review/ReviewDetail';
import Maintenance from './pages/maintenance/Maintenance';
import WriteReviewChallenge from './pages/WriteReviewChallenge';
import WriteReviewLive from './pages/WriteReviewLive';

const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* /maintenance */}
          <Route path="maintenance" element={<Maintenance />} />
          {/* / */}
          <Route path="" element={<Home />} />
          {/* /about */}
          <Route path="about" element={<About />} />
          {/* /program/challenge/:programId */}
          <Route
            path="program/challenge/:programId"
            element={<ProgramDetail programType="challenge" />}
          />
          {/* /program/live/:programId */}
          <Route
            path="program/live/:programId"
            element={<ProgramDetail programType="live" />}
          />
          <Route
            path="program/challenge/:programId/payment"
            element={<SelectPaymentPage programType="challenge" />}
          />
          <Route
            path="program/live/:programId/payment"
            element={<SelectPaymentPage programType="live" />}
          />
          <Route path="program/:orderId/success" element={<PaymentSuccess />} />
          <Route path="program/:orderId/fail" element={<PaymentFail />} />
          {/* ---Regacy--- */}
          {/* /program */}
          <Route path="program" element={<Programs />} />
          {/* /program/detail/:programId */}
          <Route
            path="program/detail/:programId"
            element={<ProgramDetailRegacy />}
          />

          <Route path="program/:programId">
            {/* /program/:programId/application/:applicationId/review/create */}
            <Route
              path="application/:applicationId/review/create"
              element={<ReviewCreateRegacy />}
            />
            {/* /program/:programId/review/new */}
            <Route
              path="review/new"
              element={<ReviewCreate isEdit={false} />}
            />
            {/* /program/:programId/review/:reviewId */}
            <Route path="review/:reviewId" element={<ReviewDetail />} />
            {/* /program/:programId/mentor/notification */}
            <Route path="mentor/notification">
              {/* /program/:programId/mentor/notification/before */}
              <Route path="before" element={<MentorNotificationBefore />} />
              {/* /program/:programId/mentor/notification/after */}
              <Route path="after" element={<MentorNotificationAfter />} />
            </Route>
          </Route>

          {/* ---Regacy--- */}
          <Route path="mypage" element={<MyPage />}>
            {/* /mypage/application */}
            <Route path="application" element={<Application />} />
            <Route path="review">
              {/* /mypage/review */}
              <Route path="" element={<Review />} />
              {/* /mypage/review/new/program/:programId */}
              <Route
                path="new/program/:programType/:programId"
                element={<ReviewCreate isEdit={false} />}
              />
              {/* /mypage/review/edit/program/:programId */}
              <Route
                path="edit/program/:programType/:programId/:reviewId"
                element={<ReviewCreate isEdit={true} />}
              />
            </Route>
            {/* /mypage/privacy */}
            <Route path="privacy" element={<Privacy />} />
          </Route>
          {/* /login */}
          <Route path="login" element={<Login />} />
          {/* /signup */}
          <Route path="signup" element={<SignUp />} />
          {/* /find-password */}
          <Route path="find-password" element={<FindPassword />} />
          <Route path="challenge/:programId">
            <Route path="user/info" element={<ChallengeUserInfo />} />
            <Route
              element={
                <CurrentChallengeProvider>
                  <ChallengeLayout />
                </CurrentChallengeProvider>
              }
            >
              <Route path="" element={<ChallengeDashboard />} />
              <Route path="me" element={<MyChallengeDashboard />} />
              {/* <Route path="others" element={<OtherDashboardList />} />
            <Route
              path="others/:applicationId"
              element={<OtherDashboardDetail />}
            /> */}
            </Route>
          </Route>

          {/* 비로그인 리뷰 작성 페이지 */}
          <Route
            path="write-review/challenge/:id"
            element={<WriteReviewChallenge />}
          />
          <Route path="write-review/live/:id" element={<WriteReviewLive />} />

          {/* 라이브 클래스 멘토 사전 전달 사항 */}
          <Route
            path="live/:id/mentor/notification/before"
            element={<MentorNotificationBefore />}
          />

          {/* 라이브 클래스 멘토 전달 후기 */}
          <Route
            path="live/:id/mentor/notification/after"
            element={<MentorNotificationAfter />}
          />
        </Route>
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
            <Route
              path="attendances"
              element={<ChallengeOperationAttendances />}
            />

            {/* /admin/challenge/operation/1/participants */}
            <Route
              path="participants"
              element={<ChallengeOperationParticipants />}
            />

            {/* /admin/challenge/operation/1/payback */}
            <Route path="payback" element={<ChallengeOperationPayback />} />
          </Route>
          {/* /admin/challenge/contents */}
          <Route
            path="/admin/challenge/contents"
            element={<ChallengeContents />}
          />
          {/* /admin/challenge/missions */}
          <Route
            path="/admin/challenge/missions"
            element={<ChallengeMissionManagement />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
