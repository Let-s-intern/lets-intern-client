import ScrollToTop from '@components/ui/scroll-to-top/ScrollToTop';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getAdminRoutes } from './AdminRoutes';
import ChallengeLayout from './components/common/challenge/ui/layout/ChallengeLayout';
import Layout from './components/common/ui/layout/Layout';
import { CurrentChallengeProvider } from './context/CurrentChallengeProvider';
import About from './router-pages/common/about/About';
import FindPassword from './router-pages/common/auth/FindPassword';
import Login from './router-pages/common/auth/Login';
import SignUp from './router-pages/common/auth/SignUp';
import ChallengeDashboard from './router-pages/common/challenge/ChallengeDashboard';
import ChallengeUserInfo from './router-pages/common/challenge/ChallengeUserInfo';
import DashboardMyMissionPage from './router-pages/common/challenge/DashboardMyMissionPage';
import DashboardPage from './router-pages/common/challenge/DashboardPage';
import MissionFeedback from './router-pages/common/challenge/MissionFeedback';
import MyChallengeDashboard from './router-pages/common/challenge/MyChallengeDashboard';
import Home from './router-pages/common/home/Home';
import MentorNotificationAfter from './router-pages/common/mentor/MentorNotificationAfter';
import MentorNotificationBefore from './router-pages/common/mentor/MentorNotificationBefore';
import Application from './router-pages/common/mypage/Application';
import Credit from './router-pages/common/mypage/Credit';
import CreditDelete from './router-pages/common/mypage/CreditDelete';
import CreditDetail from './router-pages/common/mypage/CreditDetail';
import Feedback from './router-pages/common/mypage/Feedback';
import MyPage from './router-pages/common/mypage/MyPage';
import Privacy from './router-pages/common/mypage/Privacy';
import ReportCreditDelete from './router-pages/common/mypage/ReportCreditDelete';
import ReportCreditDetail from './router-pages/common/mypage/ReportCreditDetail';
import Review from './router-pages/common/mypage/Review';
import Payment from './router-pages/common/program/Payment';
import PaymentFail from './router-pages/common/program/PaymentFail';
import PaymentInputPage from './router-pages/common/program/PaymentInputPage';
import PaymentResult from './router-pages/common/program/PaymentResult';
import Programs from './router-pages/common/program/Programs';
import ReportApplicationPage from './router-pages/common/report/ReportApplicationPage';
import ReportApplyPage from './router-pages/common/report/ReportApplyPage';
import ReportManagementPage from './router-pages/common/report/ReportManagementPage';
import ReportPage from './router-pages/common/report/ReportPage';
import ReportPaymentFail from './router-pages/common/report/ReportPaymentFail';
import ReportPaymentPage from './router-pages/common/report/ReportPaymentPage';
import ReportPaymentResult from './router-pages/common/report/ReportPaymentResult';
import ReportPersonalStatementPage from './router-pages/common/report/ReportPersonalStatementPage';
import ReportPortfolioPage from './router-pages/common/report/ReportPortfolioPage';
import ReportResumePage from './router-pages/common/report/ReportResumePage';
import ReportTossPage from './router-pages/common/report/ReportTossPage';
import ChallengeReviewCreatePage from './router-pages/common/review/ChallengeReviewCreatePage';
import ChallengeReviewPage from './router-pages/common/review/ChallengeReviewPage';
import LiveReviewCreatePage from './router-pages/common/review/LiveReviewCreatePage';
import LiveReviewPage from './router-pages/common/review/LiveReviewPage';
import ReportReviewCreatePage from './router-pages/common/review/ReportReviewCreatePage';
import ReportReviewPage from './router-pages/common/review/ReportReviewPage';
import Maintenance from './router-pages/maintenance/Maintenance';
import NotFound from './router-pages/NotFound';

const isMaintenance = false;

const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {isMaintenance ? (
          <Route path="*" element={<Maintenance />} />
        ) : (
          <>
            <Route path="/" element={<Layout />}>
              {/* / */}
              <Route path="" element={<Home />} />
              {/* /about */}
              <Route path="about" element={<About />} />

              {/* /program 프로그램 목록 */}
              <Route path="program" element={<Programs />} />

              {/* 프로그램 결제 페이지 */}
              <Route path="payment-input" element={<PaymentInputPage />} />
              <Route path="payment" element={<Payment />} />

              {/* 프로그램 결제 결과 페이지 */}
              <Route path="order/result" element={<PaymentResult />} />
              <Route path="order/fail" element={<PaymentFail />} />

              {/* 마이페이지 */}
              <Route path="mypage" element={<MyPage />}>
                {/* /mypage/application */}
                <Route path="application" element={<Application />} />
                {/* /mypage/review */}
                <Route path="review" element={<Review />} />
                {/* /mypage/review/new/challenge/:programId */}
                <Route
                  path="review/new/challenge/:programId"
                  element={<ChallengeReviewCreatePage />}
                />
                {/* /mypage/review/challenge */}
                <Route
                  path="review/challenge/:programId"
                  element={<ChallengeReviewPage />}
                />
                {/* /mypage/review/new/live/:programId */}
                <Route
                  path="review/new/live/:programId"
                  element={<LiveReviewCreatePage />}
                />
                {/* /mypage/review/live */}
                <Route
                  path="review/live/:programId"
                  element={<LiveReviewPage />}
                />
                {/* /mypage/review/new/report/:reportId */}
                <Route
                  path="review/new/report/:reportId"
                  element={<ReportReviewCreatePage />}
                />
                {/* /mypage/review/report */}
                <Route
                  path="review/report/:reportId"
                  element={<ReportReviewPage />}
                />
                <Route path="credit" element={<Credit />} />
                <Route path="credit/:paymentId" element={<CreditDetail />} />
                <Route
                  path="credit/:paymentId/delete"
                  element={<CreditDelete />}
                />
                <Route
                  path="credit/report/:paymentId"
                  element={<ReportCreditDetail />}
                />
                <Route
                  path="credit/report/:paymentId/delete"
                  element={<ReportCreditDelete />}
                />
                {/* /mypage/privacy */}
                <Route path="privacy" element={<Privacy />} />
                {/* /mypage/feedback */}
                <Route path="feedback" element={<Feedback />} />
              </Route>

              {/* 로그인 */}
              <Route path="login" element={<Login />} />
              {/* 회원가입 */}
              <Route path="signup" element={<SignUp />} />
              {/* 비밀번호 찾기 */}
              <Route path="find-password" element={<FindPassword />} />

              {/* NEW 챌린지 대시보드 */}
              <Route
                path="challenge/:programId/dashboard/:applicationId"
                element={
                  <CurrentChallengeProvider>
                    <ChallengeLayout />
                  </CurrentChallengeProvider>
                }
              >
                <Route path="" element={<DashboardPage />} />
                <Route path="missions" element={<DashboardMyMissionPage />} />
              </Route>

              {/* OLD 챌린지 대시보드 */}
              <Route
                path="challenge/:applicationId/:programId"
                element={
                  <CurrentChallengeProvider>
                    <ChallengeLayout />
                  </CurrentChallengeProvider>
                }
              >
                <Route path="" element={<ChallengeDashboard />} />
                <Route path="user/info" element={<ChallengeUserInfo />} />
                <Route path="me" element={<MyChallengeDashboard />} />

                {/* 미션 피드백 페이지 */}
                <Route
                  path="challenge/:challengeId/missions/:missionId/feedback"
                  element={<MissionFeedback />}
                />
              </Route>

              {/* 서류진단 */}
              <Route path="report/landing" element={<ReportPage />} />
              <Route
                path="report/landing/resume"
                element={<ReportResumePage />}
              />
              <Route
                path="report/landing/resume/:reportId"
                element={<ReportResumePage />}
              />
              <Route
                path="report/landing/personal-statement"
                element={<ReportPersonalStatementPage />}
              />
              <Route
                path="report/landing/personal-statement/:reportId"
                element={<ReportPersonalStatementPage />}
              />
              <Route
                path="report/landing/portfolio"
                element={<ReportPortfolioPage />}
              />
              <Route
                path="report/landing/portfolio/:reportId"
                element={<ReportPortfolioPage />}
              />
              <Route
                path="report/apply/:reportType/:reportId"
                element={<ReportApplyPage />}
              />
              <Route
                path="report/payment/:reportType/:reportId"
                element={<ReportPaymentPage />}
              />
              <Route path="report/toss/payment" element={<ReportTossPage />} />
              <Route
                path="report/order/result"
                element={<ReportPaymentResult />}
              />
              <Route path="report/order/fail" element={<ReportPaymentFail />} />

              <Route
                path="report/management"
                element={<ReportManagementPage />}
              />
              {/* 서류 제출 페이지 */}
              <Route
                path="report/:reportType/application/:applicationId"
                element={<ReportApplicationPage />}
              />

              {/* LIVE 클래스 멘토 사전 전달 사항 */}
              <Route
                path="live/:id/mentor/notification/before"
                element={<MentorNotificationBefore />}
              />

              {/* LIVE 클래스 멘토 전달 후기 */}
              <Route
                path="live/:id/mentor/notification/after"
                element={<MentorNotificationAfter />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
            {getAdminRoutes()}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
