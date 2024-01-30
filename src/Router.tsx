import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/common/Home';
import About from './pages/common/About';
import Programs from './pages/Programs/Programs';
import ProgramDetail from './pages/ProgramDetail/ProgramDetail';
import Login from './pages/Auth/Login';
import MyPage from './pages/MyPage/MyPage';
import SignUp from './pages/Auth/SignUp';
import FindPassword from './pages/Auth/FindPassword';
import Privacy from './pages/MyPage/Privacy/Privacy';
import Review from './pages/MyPage/Review/Review';
import Layout from './pages/Layout';
import AdminLayout from './pages/AdminLayout';
import ProgramCreate from './pages/admin/program/ProgramCreate';
import ReviewDetail from './pages/Review/ReviewDetail';
import ProgramEdit from './pages/admin/program/ProgramEdit';
import AdminReviews from './pages/admin/review/Reviews';
import AdminReviewsDetail from './pages/admin/review/ReviewsDetail';
import Users from './pages/admin/user/Users';
import UserDetail from './pages/admin/user/UserDetail';
import UserMemo from './pages/admin/user/UserMemo';
import UserCreate from './pages/admin/user/UserCreate';
import UserEdit from './pages/admin/user/UserEdit';
import Application from './pages/MyPage/Application/Application';
import ReviewCreate from './pages/Review/ReviewCreate';
import AttendCheck from './pages/admin/program/AttendCheck';
import ScrollToTop from './pages/ScrollToTop';
import AdminPrograms from './pages/admin/program/Programs';
import ProgramUsers from './pages/admin/program/ProgramUsers';

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
