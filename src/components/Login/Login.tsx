import { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import axios from 'axios';

import Button from '../Button';
import Input from '../Input';

import './Login.scss';

interface TextLinkProps {
  to: string;
  className?: string;
  dark?: boolean;
  children: React.ReactNode;
}

const TextLink = ({ to, dark, className, children }: TextLinkProps) => {
  return (
    <Link
      to={to}
      className={`text-sm underline${
        dark ? ' text-neutral-grey' : ' text-primary'
      }${className ? ` ${className}` : ''}`}
    >
      {children}
    </Link>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');
    if (accessToken && refreshToken) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (!email || !password) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [email, password]);

  useEffect(() => {
    if (!searchParams.get('result')) return;
    const parsedToken = JSON.parse(searchParams.get('result') || '');
    handleLoginSuccess(parsedToken);
  }, [searchParams]);

  const handleLoginSuccess = (token: any) => {
    localStorage.setItem('access-token', token.accessToken);
    localStorage.setItem('refresh-token', token.refreshToken);
    if (searchParams.get('redirect')) {
      window.location.href = searchParams.get('redirect') || '/';
    } else {
      window.location.href = '/';
    }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (buttonDisabled) return;
    axios
      .post(`${process.env.REACT_APP_SERVER_API}/user/signin`, {
        email,
        password,
      })
      .then((res) => {
        handleLoginSuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.reason);
      });
  };

  const handleKakaoLogin = (type: 'KAKAO' | 'NAVER') => {
    const redirectPath = `${window.location.protocol}//${
      window.location.hostname
    }:${window.location.port}/login${
      searchParams.get('redirect')
        ? `?redirect=${searchParams.get('redirect')}`
        : ''
    }`;
    window.location.href = `https://letsintern.kr/oauth2/authorize/${
      type === 'KAKAO' ? 'kakao' : type === 'NAVER' && 'naver'
    }?redirect_uri=${redirectPath}`;
  };

  return (
    <main className="login-page">
      <header>
        <h1>반갑습니다!</h1>
      </header>
      <form onSubmit={handleLogin}>
        <Input
          type="email"
          label="이메일"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          label="비밀번호"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />
        {errorMessage && <span className="error-alert">{errorMessage}</span>}
        <Button type="submit" disabled={buttonDisabled}>
          로그인
        </Button>
      </form>
      <span className="gray-label">또는</span>
      <div className="social-login">
        <h2>SNS 계정으로 로그인하기</h2>
        <div className="button-group">
          <button onClick={() => handleKakaoLogin('KAKAO')}>
            <i>
              <img src="/icons/kakao-icon.svg" alt="카카오톡 아이콘" />
            </i>
          </button>
        </div>
      </div>
      <div className="bottom">
        <TextLink to="/signup">회원가입</TextLink>
        <TextLink to="/find-password" dark>
          비밀번호 찾기
        </TextLink>
      </div>
    </main>
  );
};

export default Login;
