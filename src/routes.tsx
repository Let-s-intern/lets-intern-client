/** 사용하지 않습니다. react-query 이슈로 사용하기 어려움 */
import { RouteObject } from 'react-router-dom';
import ChallengeLayout from './components/common/challenge/ui/layout/ChallengeLayout';
import Layout from './components/common/ui/layout/Layout';
import { CurrentChallengeProvider } from './context/CurrentChallengeProvider';
import { adminRoute } from './NewAdminRoutes';
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
import Review from './pages/common/mypage/Review';
import Payment from './pages/common/program/Payment';
import PaymentFail from './pages/common/program/PaymentFail';
import PaymentResult from './pages/common/program/PaymentResult';
import ProgramDetail from './pages/common/program/ProgramDetail';
import Programs from './pages/common/program/Programs';
import ReviewCreate from './pages/common/review/ReviewCreate';
import ReviewDetail from './pages/common/review/ReviewDetail';
import Maintenance from './pages/maintenance/Maintenance';
import NotFound from './pages/NotFound';
import WriteReviewChallenge from './pages/WriteReviewChallenge';
import WriteReviewLive from './pages/WriteReviewLive';

export const createRoutes = () => {
  return [
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: 'maintenance', element: <Maintenance /> },
        { index: true, element: <Home /> },
        { path: 'about', element: <About /> },
        {
          path: 'program/challenge/:programId',
          element: <ProgramDetail programType="challenge" />,
        },
        {
          path: 'program/live/:programId',
          element: <ProgramDetail programType="live" />,
        },
        { path: 'payment', element: <Payment /> },
        { path: 'order/result', element: <PaymentResult /> },
        { path: 'order/fail', element: <PaymentFail /> },
        { path: 'program', element: <Programs /> },
        {
          path: 'program/:programId/review/new',
          element: <ReviewCreate isEdit={false} />,
        },
        {
          path: 'program/:programId/review/:reviewId',
          element: <ReviewDetail />,
        },
        { path: 'blog', element: <BlogListPage /> },
        { path: 'blog/hashtag', element: <BlogHashtagListPage /> },
        { path: 'blog/:id', element: <BlogDetailSSRPage /> },
        // { path: 'blog-test/:id', element: <BlogDetailSSRPage /> },
        {
          path: 'mypage',
          element: <MyPage />,
          children: [
            { path: 'application', element: <Application /> },
            { path: 'review', element: <Review /> },
            {
              path: 'review/new/program/:programType/:programId',
              element: <ReviewCreate isEdit={false} />,
            },
            {
              path: 'review/edit/program/:programType/:programId/:reviewId',
              element: <ReviewCreate isEdit={true} />,
            },
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
        {
          path: 'write-review/challenge/:id',
          element: <WriteReviewChallenge />,
        },
        { path: 'write-review/live/:id', element: <WriteReviewLive /> },
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
    adminRoute,
  ];
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'maintenance', element: <Maintenance /> },
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      {
        path: 'program/challenge/:programId',
        element: <ProgramDetail programType="challenge" />,
      },
      {
        path: 'program/live/:programId',
        element: <ProgramDetail programType="live" />,
      },
      { path: 'payment', element: <Payment /> },
      { path: 'order/result', element: <PaymentResult /> },
      { path: 'order/fail', element: <PaymentFail /> },
      { path: 'program', element: <Programs /> },
      {
        path: 'program/:programId/review/new',
        element: <ReviewCreate isEdit={false} />,
      },
      {
        path: 'program/:programId/review/:reviewId',
        element: <ReviewDetail />,
      },
      { path: 'blog', element: <BlogListPage /> },
      { path: 'blog/hashtag', element: <BlogHashtagListPage /> },
      { path: 'blog/:id', element: <BlogDetailSSRPage /> },
      { path: 'blog-test/:id', element: <BlogDetailSSRPage /> },
      {
        path: 'mypage',
        element: <MyPage />,
        children: [
          { path: 'application', element: <Application /> },
          { path: 'review', element: <Review /> },
          {
            path: 'review/new/program/:programType/:programId',
            element: <ReviewCreate isEdit={false} />,
          },
          {
            path: 'review/edit/program/:programType/:programId/:reviewId',
            element: <ReviewCreate isEdit={true} />,
          },
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
      { path: 'write-review/challenge/:id', element: <WriteReviewChallenge /> },
      { path: 'write-review/live/:id', element: <WriteReviewLive /> },
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
  adminRoute,
];
