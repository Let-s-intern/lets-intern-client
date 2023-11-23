import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Programs from './pages/Programs';
import AdminPrograms from './pages/Admin/Programs';
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
import ProgramCreate from './pages/Admin/ProgramCreate';
import ReviewEditor from './pages/ReviewEditor';
import ReviewDetail from './pages/ReviewDetail';
import ProgramEdit from './pages/Admin/ProgramEdit';

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
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="programs/create" element={<ProgramCreate />} />
          <Route path="programs/:programId/edit" element={<ProgramEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
