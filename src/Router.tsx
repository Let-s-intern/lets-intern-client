import ScrollToTop from '@components/ui/scroll-to-top/ScrollToTop';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getAdminRoutes } from './AdminRoutes';
import ChallengeLayout from './components/common/challenge/ui/layout/ChallengeLayout';
import Layout from './components/common/ui/layout/Layout';
import { CurrentChallengeProvider } from './context/CurrentChallengeProvider';
import About from './pages/common/about/About';
import FindPassword from './pages/common/auth/FindPassword';
import Login from './pages/common/auth/Login';
import SignUp from './pages/common/auth/SignUp';
import BlogDetailSSRPage from './pages/common/blog/BlogDetailSSRPage';
import BlogHashtagListPage from './pages/common/blog/BlogHashtagListPage';
import BlogListPage from './pages/common/blog/BlogListPage';
import ChallengeDashboard from './pages/common/challenge/ChallengeDashboard';
import ChallengeUserInfo from './pages/common/challenge/ChallengeUserInfo';
import MyChallengeDashboard from './pages/common/challenge/MyChallengeDashboard';
import Home from './pages/common/home/Home';
import MentorNotificationAfter from './pages/common/mentor/MentorNotificationAfter';
import MentorNotificationBefore from './pages/common/mentor/MentorNotificationBefore';
import Application from './pages/common/mypage/Application';
import Credit from './pages/common/mypage/Credit';
import CreditDelete from './pages/common/mypage/CreditDelete';
import CreditDetail from './pages/common/mypage/CreditDetail';
import MyPage from './pages/common/mypage/MyPage';
import Privacy from './pages/common/mypage/Privacy';
import ReportCreditDelete from './pages/common/mypage/ReportCreditDelete';
import ReportCreditDetail from './pages/common/mypage/ReportCreditDetail';
import Review from './pages/common/mypage/Review';
import Payment from './pages/common/program/Payment';
import PaymentFail from './pages/common/program/PaymentFail';
import PaymentResult from './pages/common/program/PaymentResult';
import ProgramDetail from './pages/common/program/ProgramDetail';
import Programs from './pages/common/program/Programs';
import ReportApplyPage from './pages/common/report/ReportApplyPage';
import ReportManagementPage from './pages/common/report/ReportManagementPage';
import ReportPage from './pages/common/report/ReportPage';
import ReportPaymentFail from './pages/common/report/ReportPaymentFail';
import ReportPaymentPage from './pages/common/report/ReportPaymentPage';
import ReportPaymentResult from './pages/common/report/ReportPaymentResult';
import ReportPersonalStatementPage from './pages/common/report/ReportPersonalStatementPage';
import ReportPortfolioPage from './pages/common/report/ReportPortfolioPage';
import ReportResumePage from './pages/common/report/ReportResumePage';
import ReportTossPage from './pages/common/report/ReportTossPage';
import ReviewCreate from './pages/common/review/ReviewCreate';
import ReviewDetail from './pages/common/review/ReviewDetail';
import Maintenance from './pages/maintenance/Maintenance';
import NotFound from './pages/NotFound';
import WriteReviewChallenge from './pages/WriteReviewChallenge';
import WriteReviewLive from './pages/WriteReviewLive';

const Router = () => {
  useEffect(() => {
    console.log('routerman');
  }, []);

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
          {/* /payment */}
          <Route path="payment" element={<Payment />} />
          {/* /order */}
          <Route path="order/result" element={<PaymentResult />} />
          <Route path="order/fail" element={<PaymentFail />} />

          {/* /program */}
          <Route path="program" element={<Programs />} />
          {/* /program/detail/:programId */}
          {/* <Route
            path="program/detail/:programId"
            element={<ProgramDetailRegacy />}
          /> */}
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

          {/* 블로그 */}
          {/* /blog?category=:category */}
          <Route path="blog/list" element={<BlogListPage />} />
          {/* blog/hashtag?tag=:tag */}
          <Route path="blog/hashtag" element={<BlogHashtagListPage />} />
          {/* blog/:id */}
          {/* <Route path="blog/:id" element={<BlogDetailPage />} /> */}
          <Route path="blog/:id/:title?" element={<BlogDetailSSRPage />} />

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
            <Route path="credit" element={<Credit />} />
            <Route path="credit/:paymentId" element={<CreditDetail />} />
            <Route path="credit/:paymentId/delete" element={<CreditDelete />} />
            <Route
              path="credit/report/:paymentId"
              element={<ReportCreditDetail />}
            />
            <Route
              path="credit/report/:paymentId/delete"
              element={<ReportCreditDelete />}
            />
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

          {/* 서류진단 */}

          <Route path="report/landing" element={<ReportPage />} />
          <Route path="report/landing/resume" element={<ReportResumePage />} />
          <Route
            path="report/landing/personal-statement"
            element={<ReportPersonalStatementPage />}
          />
          <Route
            path="report/landing/portfolio"
            element={<ReportPortfolioPage />}
          />

          {/* :reportType은 RESUME, PERSONAL_STATEMENT, PORTFOLIO (대문자) TODO: 소문자로 옮기기 */}
          <Route
            path="report/apply/:reportType/:reportId"
            element={<ReportApplyPage />}
          />

          {/* 모바일 전용 서류진단 결제 페이지. 화면 구성이 많이 달라 모바일만 한 단계 추가함 */}
          {/* :reportType은 RESUME, PERSONAL_STATEMENT, PORTFOLIO (대문자) TODO: 소문자로 옮기기 */}
          <Route
            path="report/payment/:reportType/:reportId"
            element={<ReportPaymentPage />}
          />
          <Route path="report/toss/payment" element={<ReportTossPage />} />
          <Route path="report/order/result" element={<ReportPaymentResult />} />
          <Route path="report/order/fail" element={<ReportPaymentFail />} />

          <Route path="report/management" element={<ReportManagementPage />} />

          {/* 비로그인 리뷰 작성 페이지 */}
          <Route
            path="write-review/challenge/:id"
            element={<WriteReviewChallenge />}
          />
          <Route path="write-review/live/:id" element={<WriteReviewLive />} />

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
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
