import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
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

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (buttonDisabled) return;
    axios
      .post(`${process.env.REACT_APP_SERVER_API}/user/signin`, {
        email,
        password,
      })
      .then((res) => {
        localStorage.setItem('access-token', res.data.accessToken);
        localStorage.setItem('refresh-token', res.data.refreshToken);
        if (searchParams.get('redirect')) {
          window.location.href = searchParams.get('redirect') as string;
        } else {
          window.location.href = '/';
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.reason);
      });
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
          <button>
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
