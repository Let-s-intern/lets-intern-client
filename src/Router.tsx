import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Programs from './pages/Programs';
import AdminPrograms from './pages/Admin/Program/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import SignUp from './pages/SignUp';
import FindPassword from './pages/FindPassword';
import Privacy from './pages/MyPage/Privacy';
import Review from './pages/MyPage/Review';
import Application from './pages/MyPage/Application';
import ProgramApply from './pages/ProgamApply';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Admin from './pages/Admin';
import AdminProgramCreate from './pages/Admin/Program/ProgramCreate';
import ReviewEditor from './pages/ReviewEditor';
import ReviewDetail from './pages/ReviewDetail';
import AdminProgramEdit from './pages/Admin/Program/ProgramEdit';
import AdminReviews from './pages/Admin/Review/Reviews';
import AdminReviewsDetail from './pages/Admin/Review/ReviewsDetail';
import AdminUsers from './pages/Admin/User/Users';
import AdminUserDetail from './pages/Admin/User/UserDetail';
import AdminUserMemo from './pages/Admin/User/UserMemo';
import AdminProgramUsers from './pages/Admin/Program/ProgramUsers';
import AttendCheck from './components/Admin/Program/AttendCheck';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Programs />} />
          <Route path="program/:programId">
            <Route path="" element={<ProgramDetail />} />
            <Route path="review/create" element={<ReviewEditor />} />
            <Route path="review/:reviewId" element={<ReviewDetail />} />
          </Route>
          <Route path="program/:id" element={<ProgramDetail />}>
            <Route path="apply" element={<ProgramApply />} />
          </Route>
          <Route path="mypage" element={<MyPage />}>
            <Route path="privacy" element={<Privacy />} />
            <Route path="review" element={<Review />} />
            <Route path="application" element={<Application />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="find-password" element={<FindPassword />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Admin />} />
          <Route path="programs">
            <Route path="" element={<AdminPrograms />} />
            <Route path="create" element={<AdminProgramCreate />} />
            <Route path=":programId">
              <Route path="edit" element={<AdminProgramEdit />} />
              <Route path="users" element={<AdminProgramUsers />} />
              <Route path="check-attendance" element={<AttendCheck />} />
            </Route>
          </Route>
          <Route path="reviews">
            <Route path="" element={<AdminReviews />} />
            <Route path=":programId" element={<AdminReviewsDetail />} />
          </Route>
          <Route path="users">
            <Route path="" element={<AdminUsers />} />
            <Route path=":userId">
              <Route path="" element={<AdminUserDetail />} />
              <Route path="memo" element={<AdminUserMemo />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
