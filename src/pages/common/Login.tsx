import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import Button from '../Button';
import Input from '../Input';
import SocialLogin from '../SocialLogin';

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

  useEffect(() => {
    if (searchParams.get('result')) {
      const parsedToken = JSON.parse(searchParams.get('result') || '');
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('result');
      setSearchParams(newSearchParams);
      handleLoginSuccess(parsedToken);
    } else if (searchParams.get('error')) {
      const errorParam = JSON.parse(searchParams.get('error') || '');
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('error');
      setSearchParams(newSearchParams);
      if (errorParam.status === 400 && errorParam.code === 'USER_400_4') {
        setErrorMessage('이미 존재하는 이메일입니다.');
      }
    }
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

  return (
    <main className="mx-auto px-4 sm:max-w-md">
      <header>
        <h1 className="mb-8 mt-12 text-center text-xl font-semibold">
          반갑습니다!
        </h1>
      </header>
      <form className="flex flex-col gap-2" onSubmit={handleLogin}>
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
        {errorMessage && (
          <span className="text-center text-sm font-medium text-red-600">
            {errorMessage}
          </span>
        )}
        <Button type="submit" disabled={buttonDisabled}>
          로그인
        </Button>
      </form>
      <SocialLogin type="LOGIN" />
      <div className="mt-8 flex justify-center gap-8">
        <TextLink to="/signup">회원가입</TextLink>
        <TextLink to="/find-password" dark>
          비밀번호 찾기
        </TextLink>
      </div>
    </main>
  );
};

export default Login;
