import ScrollToTop from '@components/ui/scroll-to-top/ScrollToTop';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import FindPassword from './router-pages/common/auth/FindPassword';
// import Login from './router-pages/common/auth/Login';
// import SignUp from './router-pages/common/auth/SignUp';
// import ChallengeDashboard from './router-pages/common/challenge/ChallengeDashboard';
// import ChallengeUserInfo from './router-pages/common/challenge/ChallengeUserInfo';
// import ExperienceSummaryLatest from './router-pages/common/challenge/ExperienceSummaryLatest';
// import MarketingLatest from './router-pages/common/challenge/MarketingLatest';
// import MissionFeedback from './router-pages/common/challenge/MissionFeedback';
// import MyChallengeDashboard from './router-pages/common/challenge/MyChallengeDashboard';
// import PersonalStatementLatest from './router-pages/common/challenge/PersonalStatementLatest';
// import PortfolioLatest from './router-pages/common/challenge/PortfolioLatest';
// import Home from './router-pages/common/home/Home';
// import MentorNotificationAfter from './router-pages/common/mentor/MentorNotificationAfter';
// import MentorNotificationBefore from './router-pages/common/mentor/MentorNotificationBefore';
// import Application from './router-pages/common/mypage/Application';
// import Credit from './router-pages/common/mypage/Credit';
// import CreditDelete from './router-pages/common/mypage/CreditDelete';
// import CreditDetail from './router-pages/common/mypage/CreditDetail';
// import Feedback from './router-pages/common/mypage/Feedback';
// import MyPage from './router-pages/common/mypage/MyPage';
// import Privacy from './router-pages/common/mypage/Privacy';
// import ReportCreditDelete from './router-pages/common/mypage/ReportCreditDelete';
// import ReportCreditDetail from './router-pages/common/mypage/ReportCreditDetail';
// import Review from './router-pages/common/mypage/Review';
// import Payment from './router-pages/common/program/Payment';
// import PaymentFail from './router-pages/common/program/PaymentFail';
// import PaymentInputPage from './router-pages/common/program/PaymentInputPage';
// import PaymentResult from './router-pages/common/program/PaymentResult';
// import Programs from './router-pages/common/program/Programs';
// import ReportApplicationPage from './router-pages/common/report/ReportApplicationPage';
// import ReportApplyPage from './router-pages/common/report/ReportApplyPage';
// import ReportManagementPage from './router-pages/common/report/ReportManagementPage';
// import ReportPage from './router-pages/common/report/ReportPage';
// import ReportPaymentFail from './router-pages/common/report/ReportPaymentFail';
// import ReportPaymentPage from './router-pages/common/report/ReportPaymentPage';
// import ReportPaymentResult from './router-pages/common/report/ReportPaymentResult';
// import ReportPersonalStatementPage from './router-pages/common/report/ReportPersonalStatementPage';
// import ReportPortfolioPage from './router-pages/common/report/ReportPortfolioPage';
// import ReportResumePage from './router-pages/common/report/ReportResumePage';
// import ReportTossPage from './router-pages/common/report/ReportTossPage';
// import ChallengeReviewCreatePage from './router-pages/common/review/ChallengeReviewCreatePage';
// import ChallengeReviewPage from './router-pages/common/review/ChallengeReviewPage';
// import LiveReviewCreatePage from './router-pages/common/review/LiveReviewCreatePage';
// import LiveReviewPage from './router-pages/common/review/LiveReviewPage';
// import ReportReviewCreatePage from './router-pages/common/review/ReportReviewCreatePage';
// import ReportReviewPage from './router-pages/common/review/ReportReviewPage';
import Maintenance from '@/components/pages/maintenance/Maintenance';
// import NotFound from './router-pages/NotFound';

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
            <Route path="/">
              {/* / */}
              <Route path="" />
              {/* /about */}
              <Route path="about" />

              {/* /program 프로그램 목록 */}
              <Route path="program" />

              {/* 프로그램 결제 페이지 */}
              <Route path="payment-input" />
              <Route path="payment" />

              {/* 프로그램 결제 결과 페이지 */}
              <Route path="order/result" />
              <Route path="order/fail" />

              {/* 챌린지별 latest 리다이렉트 라우트 */}
              <Route path="challenge/experience-summary/latest" />
              <Route path="challenge/personal-statement/latest" />
              <Route path="challenge/portfolio/latest" />
              <Route path="challenge/marketing/latest" />

              {/* 마이페이지 */}
              <Route path="mypage">
                {/* /mypage/application */}
                <Route path="application" />
                {/* /mypage/review */}
                <Route path="review" />
                {/* /mypage/review/new/challenge/:programId */}
                <Route path="review/new/challenge/:programId" />
                {/* /mypage/review/challenge */}
                <Route path="review/challenge/:programId" />
                {/* /mypage/review/new/live/:programId */}
                <Route path="review/new/live/:programId" />
                {/* /mypage/review/live */}
                <Route path="review/live/:programId" />
                {/* /mypage/review/new/report/:reportId */}
                <Route path="review/new/report/:reportId" />
                {/* /mypage/review/report */}
                <Route path="review/report/:reportId" />
                <Route path="credit" />
                <Route path="credit/:paymentId" />
                <Route path="credit/:paymentId/delete" />
                <Route path="credit/report/:paymentId" />
                <Route path="credit/report/:paymentId/delete" />
                {/* /mypage/privacy */}
                <Route path="privacy" />
                {/* /mypage/feedback */}
                <Route path="feedback" />
              </Route>

              {/* 로그인 */}
              <Route path="login" />
              {/* 회원가입 */}
              <Route path="signup" />
              {/* 비밀번호 찾기 */}
              <Route path="find-password" />

              {/* 챌린지 대시보드 */}
              <Route path="challenge/:applicationId/:programId">
                <Route path="user/info" />
                <Route path="" />
                <Route path="me" />
                {/* 미션 피드백 페이지 */}
                <Route path="challenge/:challengeId/missions/:missionId/feedback" />
              </Route>

              <Route path="report/landing" />
              <Route path="report/landing/resume" />
              <Route path="report/landing/resume/:reportId" />
              <Route path="report/landing/personal-statement" />
              <Route path="report/landing/personal-statement/:reportId" />
              <Route path="report/landing/portfolio" />
              <Route path="report/landing/portfolio/:reportId" />
              <Route path="report/apply/:reportType/:reportId" />
              <Route path="report/payment/:reportType/:reportId" />
              <Route path="report/toss/payment" />
              <Route path="report/order/result" />
              <Route path="report/order/fail" />
              <Route path="report/management" />
              {/* 서류 제출 페이지 */}
              <Route path="report/:reportType/application/:applicationId" />

              {/* LIVE 클래스 멘토 사전 전달 사항 */}
              <Route path="live/:id/mentor/notification/before" />

              {/* LIVE 클래스 멘토 전달 후기 */}
              <Route path="live/:id/mentor/notification/after" />
              
              <Route path="*" />
            </Route>
            {/* Admin routes moved to Next.js /admin */}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
