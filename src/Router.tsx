import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import Program from './pages/Program';
import Login from './pages/Login';
import MyPage from './pages/MyPage';

const Router = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="mx-auto max-w-5xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/program" element={<Program />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Router;
