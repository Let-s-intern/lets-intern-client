import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/common/home/Home';
import About from './pages/common/about/About';
import Programs from './pages/common/program/Programs';
import ProgramDetail from './pages/common/program/ProgramDetail';
import Login from './pages/common/auth/Login';
import MyPage from './pages/common/mypage/MyPage';
import SignUp from './pages/common/auth/SignUp';
import FindPassword from './pages/common/auth/FindPassword';
import Privacy from './pages/common/mypage/Privacy';
import Review from './pages/common/mypage/Review';
import Layout from './components/common/ui/layout/Layout';
import AdminLayout from './components/admin/ui/layout/AdminLayout';
import ProgramCreate from './pages/admin/program/ProgramCreate';
import ReviewDetail from './pages/common/review/ReviewDetail';
import ProgramEdit from './pages/admin/program/ProgramEdit';
import AdminReviews from './pages/admin/review/Reviews';
import AdminReviewsDetail from './pages/admin/review/ReviewsDetail';
import Users from './pages/admin/user/Users';
import UserDetail from './pages/admin/user/UserDetail';
import UserMemo from './pages/admin/user/UserMemo';
import UserCreate from './pages/admin/user/UserCreate';
import UserEdit from './pages/admin/user/UserEdit';
import Application from './pages/common/mypage/Application';
import ReviewCreate from './pages/common/review/ReviewCreate';
import AttendCheck from './pages/admin/program/AttendCheck';
import ScrollToTop from './components/ui/scroll-to-top/ScrollToTop';
import AdminPrograms from './pages/admin/program/Programs';
import ProgramUsers from './pages/admin/program/ProgramUsers';
import ChallengeAdminLayout from './components/admin/challenge/ui/layout/ChallengeAdminLayout';
import ChallengeHome from './pages/admin/challenge/ChallengeHome';
import ChallengeMission from './pages/admin/challenge/ChallengeMission';
import ChallengeContents from './pages/admin/challenge/ChallengeContents';
import ChallengeSubmitCheck from './pages/admin/challenge/ChallengeSubmitCheck';
import ChallengeUser from './pages/admin/challenge/ChallengeUser';
import ChallengeNotice from './pages/admin/challenge/ChallengeNotice';
import ChallengeDashboard from './pages/common/challenge/ChallengeDashboard';
import ChallengeLayout from './components/common/challenge/ui/layout/ChallengeLayout';
import MyChallengeDashboard from './pages/common/challenge/MyChallengeDashboard';
import OtherDashboardList from './pages/common/challenge/OtherDashboardList';
import OtherDashboardDetail from './pages/common/challenge/OtherDashboardDetail';
import MentorNotificationBefore from './pages/common/mentor/MentorNotificationBefore';
import MentorNotificationAfter from './pages/common/mentor/MentorNotificationAfter';
import ChallengeOnboarding from './pages/admin/challenge/ChallengeOnboarding';
import Coupons from './pages/admin/coupon/Coupons';
import CouponCreate from './pages/admin/coupon/CouponCreate';
import CouponEdit from './pages/admin/coupon/CouponEdit';
import MainBanners from './pages/admin/banner/MainBanners';
import TopBarBanners from './pages/admin/banner/TopBarBanners';
import PopUpBanners from './pages/admin/banner/PopUpBanners';
import ProgramBanners from './pages/admin/banner/ProgramBanners';
import OnlineContents from './pages/admin/online-contents/OnlineContents';

const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* /home */}
          <Route path="" element={<Home />} />
          {/* /about */}
          <Route path="about" element={<About />} />
          {/* / */}
          <Route path="program" element={<Programs />} />
          {/* /program/detail/:programId */}
          <Route path="program/detail/:programId" element={<ProgramDetail />} />
          <Route path="program/:programId">
            {/* /program/:programId/application/:applicationId/review/create */}
            <Route
              path="application/:applicationId/review/create"
              element={<ReviewCreate />}
            />
            {/* /program/:programId/review/create */}
            <Route path="review/create" element={<ReviewCreate />} />
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
          <Route path="mypage" element={<MyPage />}>
            {/* /mypage/application */}
            <Route path="application" element={<Application />} />
            {/* /mypage/review */}
            <Route path="review" element={<Review />} />
            {/* /mypage/privacy */}
            <Route path="privacy" element={<Privacy />} />
          </Route>
          {/* /login */}
          <Route path="login" element={<Login />} />
          {/* /signup */}
          <Route path="signup" element={<SignUp />} />
          {/* /find-password */}
          <Route path="find-password" element={<FindPassword />} />
          <Route path="challenge/:programId" element={<ChallengeLayout />}>
            <Route path="" element={<ChallengeDashboard />} />
            <Route path="me" element={<MyChallengeDashboard />} />
            <Route path="others" element={<OtherDashboardList />} />
            <Route
              path="others/:applicationId"
              element={<OtherDashboardDetail />}
            />
          </Route>
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
          <Route path="online-contents" element={<OnlineContents />} />
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
            <Route path="main-banners" element={<MainBanners />} />
            <Route path="top-bar-banners" element={<TopBarBanners />} />
            <Route path="pop-up" element={<PopUpBanners />} />
            <Route path="program-banners" element={<ProgramBanners />} />
          </Route>
          {/* /admin/challenge */}
          <Route path="challenge" element={<ChallengeOnboarding />} />
          {/* /admin/challenge/1 */}
          <Route path="challenge/:programId" element={<ChallengeAdminLayout />}>
            {/* /admin/challenge/1 */}
            <Route path="" element={<ChallengeHome />} />
            {/* /admin/challenge/1/notice */}
            <Route path="notice" element={<ChallengeNotice />} />
            {/* /admin/challenge/1/mission */}
            <Route path="mission" element={<ChallengeMission />} />
            {/* /admin/challenge/1/submit-check */}
            <Route path="submit-check" element={<ChallengeSubmitCheck />} />
            {/* /admin/challenge/1/user */}
            <Route path="user" element={<ChallengeUser />} />
          </Route>
          {/* /admin/challenge/contents */}
          <Route
            path="/admin/challenge/contents"
            element={<ChallengeContents />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
