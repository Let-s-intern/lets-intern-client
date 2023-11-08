import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar';
import Program from './pages/Program';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import SignUp from './pages/SignUp';
import FindPassword from './pages/FindPassword';
import Privacy from './pages/MyPage/Privacy';
import Review from './pages/MyPage/Review';
import Application from './pages/MyPage/Application';

const Router = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="mx-auto max-w-5xl">
        <Routes>
          <Route path="/" element={<Program />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />}>
            <Route path="privacy" element={<Privacy />} />
            <Route path="review" element={<Review />} />
            <Route path="application" element={<Application />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/find-password" element={<FindPassword />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Router;
