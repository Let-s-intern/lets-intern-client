import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { getAdminRoutes } from './AdminRoutes';
import ChallengeLayout from './components/common/challenge/ui/layout/ChallengeLayout';
import Layout from './components/common/ui/layout/Layout';
import ScrollToTop from './components/ui/scroll-to-top/ScrollToTop';
import { CurrentChallengeProvider } from './context/CurrentChallengeProvider';
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
import Credit from './pages/common/mypage/Credit';
import CreditDetail from './pages/common/mypage/CreditDetail';
import MyPage from './pages/common/mypage/MyPage';
import Privacy from './pages/common/mypage/Privacy';
import Review from './pages/common/mypage/Review';
import Payment from './pages/common/program/Payment';
import PaymentFail from './pages/common/program/PaymentFail';
import PaymentResult from './pages/common/program/PaymentResult';
import ProgramDetail from './pages/common/program/ProgramDetail';
import Programs from './pages/common/program/Programs';
import ProgramDetailRegacy from './pages/common/program/regacy/ProgramDetailRegacy';
import ReviewCreateRegacy from './pages/common/review/regacy/ReviewCreateRegacy';
import ReviewCreate from './pages/common/review/ReviewCreate';
import ReviewDetail from './pages/common/review/ReviewDetail';
import Maintenance from './pages/maintenance/Maintenance';
import NotFound from './pages/NotFound';
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

          <Route path="payment" element={<Payment />} />
          <Route path="order/:orderId/result" element={<PaymentResult />} />
          <Route path="order/:orderId/fail" element={<PaymentFail />} />

          {/* ---Regacy--- */}
          {/* /program */}
          <Route path="program" element={<Programs />} />
          {/* /program/detail/:programId */}
          <Route
            path="program/detail/:programId"
            element={<ProgramDetailRegacy />}
          />

          {/* /program/:programId/application/:applicationId/review/create */}
          <Route
            path="program/:programId/application/:applicationId/review/create"
            element={<ReviewCreateRegacy />}
          />
          {/* /program/:programId/review/new */}
          <Route
            path="program/:programId/review/new"
            element={<ReviewCreate isEdit={false} />}
          />
          {/* /program/:programId/review/:reviewId */}
          <Route
            path="program/:programId/review/:reviewId"
            element={<ReviewDetail />}
          />

          {/* 마이페이지 */}
          <Route path="mypage" element={<MyPage />}>
            {/* /mypage/application */}
            <Route path="application" element={<Application />} />

            {/* /mypage/review */}
            <Route path="review" element={<Review />} />

            {/* /mypage/review/new/program/:programId */}
            <Route
              path="review/new/program/:programType/:programId"
              element={<ReviewCreate isEdit={false} />}
            />
            {/* /mypage/review/edit/program/:programId */}
            <Route
              path="review/edit/program/:programType/:programId/:reviewId"
              element={<ReviewCreate isEdit={true} />}
            />
            <Route path="credit">
              <Route path="" element={<Credit />} />
              <Route path=":paymentId" element={<CreditDetail />} />
            </Route>
            <Route path="privacy" element={<Privacy />} />
          </Route>
          {/* /login */}
          <Route path="login" element={<Login />} />
          {/* /signup */}
          <Route path="signup" element={<SignUp />} />
          {/* /find-password */}
          <Route path="find-password" element={<FindPassword />} />

          {/* 챌린지 대시보드 */}
          <Route
            path="challenge/:programId"
            element={
              <CurrentChallengeProvider>
                <ChallengeLayout />
              </CurrentChallengeProvider>
            }
          >
            <Route path="user/info" element={<ChallengeUserInfo />} />
            <Route path="" element={<ChallengeDashboard />} />
            <Route path="me" element={<MyChallengeDashboard />} />
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
          <Route path="*" element={<NotFound />} />
        </Route>
        {getAdminRoutes()}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
