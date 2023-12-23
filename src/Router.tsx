import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import SignUp from './pages/SignUp';
import FindPassword from './pages/FindPassword';
import Privacy from './pages/MyPage/Privacy';
import Review from './pages/MyPage/Review';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProgramCreate from './pages/Admin/Program/ProgramCreate';
import ReviewDetail from './pages/ReviewDetail';
import ProgramEdit from './pages/Admin/Program/ProgramEdit';
import AdminReviews from './components/Admin/Review/Reviews';
import AdminReviewsDetail from './components/Admin/Review/ReviewsDetail';
import Users from './components/Admin/User/Users';
import UserDetail from './pages/Admin/User/UserDetail';
import UserMemo from './pages/Admin/User/UserMemo';
import UserCreate from './pages/Admin/User/UserCreate';
import UserEdit from './pages/Admin/User/UserEdit';
import Application from './pages/MyPage/Appllication';
import ReviewCreate from './pages/ReviewCreate';
import AttendCheck from './pages/Admin/Program/AttendCheck';
import ScrollToTop from './components/ScrollToTop';
import AdminPrograms from './components/Admin/Program/Programs';
import ProgramUsers from './components/Admin/Program/ProgramUsers';

const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* / */}
          <Route path="" element={<Programs />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
