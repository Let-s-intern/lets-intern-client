/** 사용하지 않습니다. react-query 이슈로 사용하기 어려움 */
import { RouteObject } from 'react-router-dom';
import ChallengeLayout from './components/common/challenge/ui/layout/ChallengeLayout';
import Layout from './components/common/ui/layout/Layout';
import { CurrentChallengeProvider } from './context/CurrentChallengeProvider';
// import { adminRoute } from './NewAdminRoutes';
import About from './router-pages/common/about/About';
import FindPassword from './router-pages/common/auth/FindPassword';
import Login from './router-pages/common/auth/Login';
import SignUp from './router-pages/common/auth/SignUp';
// import BlogDetailSSRPage from './pages/common/blog/BlogDetailSSRPage';
import ChallengeDashboard from './router-pages/common/challenge/ChallengeDashboard';
import ChallengeUserInfo from './router-pages/common/challenge/ChallengeUserInfo';
import MyChallengeDashboard from './router-pages/common/challenge/MyChallengeDashboard';
import Home from './router-pages/common/home/Home';
import MentorNotificationAfter from './router-pages/common/mentor/MentorNotificationAfter';
import MentorNotificationBefore from './router-pages/common/mentor/MentorNotificationBefore';
import Application from './router-pages/common/mypage/Application';
import Credit from './router-pages/common/mypage/Credit';
import CreditDelete from './router-pages/common/mypage/CreditDelete';
import CreditDetail from './router-pages/common/mypage/CreditDetail';
import MyPage from './router-pages/common/mypage/MyPage';
import Privacy from './router-pages/common/mypage/Privacy';
import Review from './router-pages/common/mypage/Review';
import ChallengeDetailSSRPage from './router-pages/common/program/ChallengeDetailSSRPage';
import LiveDetailSSRPage from './router-pages/common/program/LiveDetailSSRPage';
import Payment from './router-pages/common/program/Payment';
import PaymentFail from './router-pages/common/program/PaymentFail';
import PaymentResult from './router-pages/common/program/PaymentResult';
import ProgramDetailLegacy from './router-pages/common/program/ProgramDetailLegacy';
import Programs from './router-pages/common/program/Programs';
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
import Maintenance from './router-pages/maintenance/Maintenance';
import NotFound from './router-pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'maintenance', element: <Maintenance /> },
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      {
        path: 'program/old/challenge/:programId',
        element: <ProgramDetailLegacy programType="challenge" />,
      },
      {
        path: 'program/old/live/:programId',
        element: <ProgramDetailLegacy programType="live" />,
      },
      {
        path: 'program/challenge/:id/:title?',
        element: <ChallengeDetailSSRPage />,
      },
      { path: 'program/live/:id/:title?', element: <LiveDetailSSRPage /> },
      { path: 'payment', element: <Payment /> },
      { path: 'order/result', element: <PaymentResult /> },
      { path: 'order/fail', element: <PaymentFail /> },
      { path: 'program', element: <Programs /> },
      {
        path: 'mypage',
        element: <MyPage />,
        children: [
          { path: 'application', element: <Application /> },
          { path: 'review', element: <Review /> },
          { path: 'credit', element: <Credit /> },
          { path: 'credit/:paymentId', element: <CreditDetail /> },
          { path: 'credit/:paymentId/delete', element: <CreditDelete /> },
          { path: 'privacy', element: <Privacy /> },
        ],
      },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'find-password', element: <FindPassword /> },
      {
        path: 'challenge/:programId',
        element: (
          <CurrentChallengeProvider>
            <ChallengeLayout />
          </CurrentChallengeProvider>
        ),
        children: [
          { path: 'user/info', element: <ChallengeUserInfo /> },
          { index: true, element: <ChallengeDashboard /> },
          { path: 'me', element: <MyChallengeDashboard /> },
        ],
      },

      { path: 'report/landing', element: <ReportPage /> },
      { path: 'report/landing/resume', element: <ReportResumePage /> },
      {
        path: 'report/landing/personal-statement',
        element: <ReportPersonalStatementPage />,
      },
      { path: 'report/landing/portfolio', element: <ReportPortfolioPage /> },
      // {/* :reportType은 RESUME, PERSONAL_STATEMENT, PORTFOLIO (대문자) TODO: 소문자로 옮기기 */}
      {
        path: 'report/apply/:reportType/:reportId',
        element: <ReportApplyPage />,
      },
      // {/* 모바일 전용 서류진단 결제 페이지. 화면 구성이 많이 달라 모바일만 한 단계 추가함 */}
      // {/* :reportType은 RESUME, PERSONAL_STATEMENT, PORTFOLIO (대문자) TODO: 소문자로 옮기기 */}
      {
        path: 'report/payment/:reportType/:reportId',
        element: <ReportPaymentPage />,
      },
      { path: 'report/toss/payment', element: <ReportTossPage /> },
      { path: 'report/order/result', element: <ReportPaymentResult /> },
      { path: 'report/order/fail', element: <ReportPaymentFail /> },
      { path: 'report/management', element: <ReportManagementPage /> },
      {
        path: 'live/:id/mentor/notification/before',
        element: <MentorNotificationBefore />,
      },
      {
        path: 'live/:id/mentor/notification/after',
        element: <MentorNotificationAfter />,
      },

      { path: '*', element: <NotFound /> },
    ],
  },
  // adminRoute,
];
