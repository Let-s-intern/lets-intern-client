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
import ChallengeMissionLayout from './components/admin/challenge/mission/ui/layout/ChallengeMissionLayout';
import ChallengeSubmitCheck from './pages/admin/challenge/ChallengeSubmitCheck';
import ChallengeUser from './pages/admin/challenge/ChallengeUser';
import ChallengeNotice from './pages/admin/challenge/ChallengeNotice';
import ChallengeDashboard from './pages/common/challenge/ChallengeDashboard';
import ChallengeLayout from './components/common/challenge/ui/layout/ChallengeLayout';
import MyChallengeDashboard from './pages/common/challenge/MyChallengeDashboard';
import OtherDashboardList from './pages/common/challenge/OtherDashboardList';
import OtherDashboardDetail from './pages/common/challenge/OtherDashboardDetail';

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
          <Route path="challenge" element={<ChallengeLayout />}>
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
              {/* /admin/programs/:programId/edit */}
              <Route path="edit" element={<ProgramEdit />} />
              {/* /admin/programs/:programId/users */}
              <Route path="users" element={<ProgramUsers />} />
              {/* /admin/programs/:programId/check-attendance */}
              <Route path="check-attendance" element={<AttendCheck />} />
            </Route>
          </Route>
          <Route path="reviews">
            {/* /admin/reviews */}
            <Route path="" element={<AdminReviews />} />
            {/* /admin/reviews/:programId */}
            <Route path=":programId" element={<AdminReviewsDetail />} />
          </Route>
          <Route path="users">
            {/* /admin/users */}
            <Route path="" element={<Users />} />
            {/* /admin/users/create */}
            <Route path="create" element={<UserCreate />} />
            <Route path=":userId">
              {/* /admin/users/:userId */}
              <Route path="" element={<UserDetail />} />
              {/* /admin/users/:userId/memo */}
              <Route path="memo" element={<UserMemo />} />
              {/* /admin/users/:userId/edit */}
              <Route path="edit" element={<UserEdit />} />
            </Route>
          </Route>
          <Route path="challenge" element={<ChallengeAdminLayout />}>
            <Route path="" element={<ChallengeHome />} />
            <Route path="notice" element={<ChallengeNotice />} />
            <Route path="mission" element={<ChallengeMissionLayout />}>
              <Route path="" element={<ChallengeMission />} />
              <Route path="contents" element={<ChallengeContents />} />
            </Route>
            <Route path="submit-check" element={<ChallengeSubmitCheck />} />
            <Route path="user" element={<ChallengeUser />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
