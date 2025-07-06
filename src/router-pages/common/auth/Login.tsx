import SocialLogin from '@/components/common/auth/ui/SocialLogin';
import Button from '@/components/common/ui/button/Button';
import Input from '@/components/ui/input/Input';
import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

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
        dark ? 'text-neutral-grey' : 'text-primary'
      }${className ? ` ${className}` : ''}`}
    >
      {children}
    </Link>
  );
};

/**
 * Next.js 페이지로 가려면 강제 리다이렉트를 해야 하므로 window.location.href를 사용합니다.
 * TODO: 모든 페이지가 Next.js로 이동되면 window.location.href 대신 router.push 하거나 서버 단계에서 리다이렉트 하기
 */
const Login = () => {
  const { isLoggedIn, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const redirect: string = searchParams.get('redirect') || '/';
  const navigate = useNavigate();

  const fetchLogin = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/user/signin', {
        email,
        password,
      });
      return res.data;
    },
    onSuccess: (data) => {
      // 일반 이메일 로그인 성공 시 소셜 로그인 최근 로그인 기록 초기화
      localStorage.removeItem('lastSocialLogin');
      login(data.data.accessToken, data.data.refreshToken);
      if (!redirect) {
        return;
      }

      window.location.href = redirect;
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      if (
        axiosError.response?.status === 400 ||
        axiosError.response?.status === 404
      ) {
        setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
      }
    },
  });

  // 비밀번호, 이메일 입력 시 버튼 활성화
  useEffect(() => {
    if (!email || !password) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [email, password]);

  useEffect(() => {
    if (searchParams.get('error')) {
      setErrorMessage('이미 가입된 휴대폰 번호입니다.');
      return;
    }

    if (searchParams.get('result')) {
      setIsLoading(true);
      const parsedToken = JSON.parse(searchParams.get('result') || '');
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('result');
      newSearchParams.set('isLoading', 'true');
      setSearchParams(newSearchParams);
      handleLoginSuccess(parsedToken);
      return;
    }

    if (searchParams.get('isLoading')) {
      setIsLoading(true);
    }

    if (isLoggedIn) {
      window.location.href = redirect;
      return;
    }
  }, [searchParams, setSearchParams]);

  const handleLoginSuccess = (token: any) => {
    if (document.referrer.includes('/oauth2/authorize/kakao')) {
      localStorage.setItem('lastSocialLogin', 'KAKAO');
      console.log('카카오 로그인 성공, localStorage 저장됨');
    } else if (document.referrer.includes('/oauth2/authorize/naver')) {
      localStorage.setItem('lastSocialLogin', 'NAVER');
      console.log('네이버 로그인 성공, localStorage 저장됨');
    }

    if (token.isNew) {
      navigate(`/signup?result=${JSON.stringify(token)}&redirect=${redirect}`);
    } else {
      login(token.accessToken, token.refreshToken);
      window.location.href = redirect;
    }
    setIsLoading(false);
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (buttonDisabled) return;
    fetchLogin.mutate();
  };

  return (
    <>
      <main className="mx-auto min-h-screen px-4 sm:max-w-md">
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
        <div className="mt-9 flex justify-center gap-8">
          <TextLink to={`/signup?redirect=${redirect}`}>회원가입</TextLink>
          <TextLink to="/find-password" dark>
            비밀번호 찾기
          </TextLink>
        </div>
      </main>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <LoadingContainer />
        </div>
      )}
    </>
  );
};

export default Login;
