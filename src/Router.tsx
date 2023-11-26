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
import ProgramCreate from './pages/Admin/Program/ProgramCreate';
import ReviewEditor from './pages/ReviewEditor';
import ReviewDetail from './pages/ReviewDetail';
import ProgramEdit from './pages/Admin/Program/ProgramEdit';
import AdminReviews from './pages/Admin/Review/Reviews';
import AdminReviewsDetail from './pages/Admin/Review/ReviewsDetail';
import Users from './pages/Admin/User/Users';
import UserDetail from './pages/Admin/User/UserDetail';
import UserMemo from './pages/Admin/User/UserMemo';
import ProgramUsers from './pages/Admin/Program/ProgramUsers';
import AttendCheck from './components/Admin/Program/AttendCheck';
import UserCreate from './pages/Admin/User/UserCreate';
import UserEdit from './pages/Admin/User/UserEdit';

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
          <Route path="program/:programId" element={<ProgramDetail />}>
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
            <Route path="create" element={<ProgramCreate />} />
            <Route path=":programId">
              <Route path="edit" element={<ProgramEdit />} />
              <Route path="users" element={<ProgramUsers />} />
              <Route path="check-attendance" element={<AttendCheck />} />
            </Route>
          </Route>
          <Route path="reviews">
            <Route path="" element={<AdminReviews />} />
            <Route path=":programId" element={<AdminReviewsDetail />} />
          </Route>
          <Route path="users">
            <Route path="" element={<Users />} />
            <Route path="create" element={<UserCreate />} />
            <Route path=":userId">
              <Route path="" element={<UserDetail />} />
              <Route path="memo" element={<UserMemo />} />
              <Route path="edit" element={<UserEdit />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
