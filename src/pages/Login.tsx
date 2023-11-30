import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import Input from '../components/Input';
import axios from 'axios';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // 로그인 상태에서 로그인 페이지에 접근하면 메인 페이지로 이동
  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');
    if (accessToken && refreshToken) {
      navigate('/');
    }
  }, []);

  // 로그인 버튼 비활성화 여부
  useEffect(() => {
    if (!email || !password) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [email, password]);

  // 로그인 버튼 클릭 시 실행되는 함수
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
        navigate('/');
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.reason);
      });
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-5">
      <div className="mt-12 flex w-full flex-col sm:max-w-md">
        <h1 className="mb-12 text-center text-xl font-bold">반갑습니다!</h1>
        {/* 로그인 폼 */}
        <form onSubmit={handleLogin}>
          <div className="mt-5">
            <Input
              type="email"
              label="이메일"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <Input
              type="password"
              label="비밀번호"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && (
            <div className="mt-3 text-center text-sm font-medium text-red-600">
              {errorMessage}
            </div>
          )}
          <Button
            type="submit"
            className="mt-5 w-full"
            disabled={buttonDisabled}
          >
            로그인
          </Button>
        </form>
        {/* <span className="mt-10 block text-center text-sm text-neutral-dark-grey">
          또는
        </span>
        <span className="mt-10 block text-center font-medium text-neutral-grey">
          SNS 계정으로 로그인하기
        </span>
        <div className="mx-auto mt-5 flex gap-5">
          <button>
            <i>
              <img src="/icons/google-icon.svg" alt="구글 아이콘" />
            </i>
          </button>
          <button>
            <i>
              <img src="/icons/kakao-icon.svg" alt="카카오톡 아이콘" />
            </i>
          </button>
        </div> */}
        {/* 회원가입 및 비밀번호 찾기 */}
        <div className="mt-5 flex justify-center">
          <div className="flex gap-16">
            <TextLink to="/signup">회원가입</TextLink>
            <TextLink to="/find-password" dark>
              비밀번호 찾기
            </TextLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
