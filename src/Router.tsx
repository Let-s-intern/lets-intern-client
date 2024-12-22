import ScrollToTop from '@components/ui/scroll-to-top/ScrollToTop';
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
import ChallengeDetailSSRPage from './pages/common/program/ChallengeDetailSSRPage';
import LiveDetailSSRPage from './pages/common/program/LiveDetailSSRPage';
import Payment from './pages/common/program/Payment';
import PaymentFail from './pages/common/program/PaymentFail';
import PaymentInputPage from './pages/common/program/PaymentInputPage';
import PaymentResult from './pages/common/program/PaymentResult';
import ProgramDetailLegacy from './pages/common/program/ProgramDetailLegacy';
import Programs from './pages/common/program/Programs';
import ReportApplicationPage from './pages/common/report/ReportApplicationPage';
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

              {/* 챌린지 상세 페이지 (Deprecated) */}
              <Route
                path="program/old/challenge/:programId"
                element={<ProgramDetailLegacy programType="challenge" />}
              />

              {/* 챌린지 상세 페이지 */}
              <Route
                path="program/challenge/:id/:title?"
                element={<ChallengeDetailSSRPage />}
              />

              {/* LIVE 클래스 상세 페이지 (Deprecated) */}
              <Route
                path="program/old/live/:programId"
                element={<ProgramDetailLegacy programType="live" />}
              />

              {/* LIVE 클래스 상세 페이지 */}
              <Route
                path="program/live/:id/:title?"
                element={<LiveDetailSSRPage />}
              />

              {/* 프로그램 결제 페이지 */}
              <Route path="payment-input" element={<PaymentInputPage />} />
              <Route path="payment" element={<Payment />} />

              {/* 프로그램 결제 결과 페이지 */}
              <Route path="order/result" element={<PaymentResult />} />
              <Route path="order/fail" element={<PaymentFail />} />

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
              <Route
                path="report/landing/resume"
                element={<ReportResumePage />}
              />
              <Route
                path="report/landing/personal-statement"
                element={<ReportPersonalStatementPage />}
              />
              <Route
                path="report/landing/portfolio"
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

              {/* 비로그인 리뷰 작성 페이지 */}
              <Route
                path="write-review/challenge/:id"
                element={<WriteReviewChallenge />}
              />
              <Route
                path="write-review/live/:id"
                element={<WriteReviewLive />}
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
