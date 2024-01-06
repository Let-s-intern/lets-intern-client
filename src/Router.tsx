import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './components/Home/Home';
import About from './components/About/About';
import Programs from './components/Programs/Programs';
import ProgramDetail from './components/ProgramDetail/ProgramDetail';
import Login from './components/Login/Login';
import MyPage from './components/MyPage/MyPage';
import SignUp from './pages/SignUp';
import FindPassword from './pages/FindPassword';
import Privacy from './components/MyPage/Privacy/Privacy';
import Review from './components/MyPage/Review/Review';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProgramCreate from './pages/Admin/Program/ProgramCreate';
import ReviewDetail from './components/Review/ReviewDetail';
import ProgramEdit from './pages/Admin/Program/ProgramEdit';
import AdminReviews from './components/Admin/Review/Reviews';
import AdminReviewsDetail from './components/Admin/Review/ReviewsDetail';
import Users from './components/Admin/User/Users';
import UserDetail from './components/Admin/User/UserDetail/UserDetail';
import UserMemo from './components/Admin/User/UserMemo';
import UserCreate from './components/Admin/User/UserCreate/UserCreate';
import UserEdit from './components/Admin/User/UserEdit/UserEdit';
import Application from './components/MyPage/Application/Application';
import ReviewCreate from './components/Review/ReviewCreate';
import AttendCheck from './components/Admin/Program/AttendCheck';
import ScrollToTop from './components/ScrollToTop';
import AdminPrograms from './components/Admin/Program/Programs';
import ProgramUsers from './components/Admin/Program/ProgramUsers';

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
