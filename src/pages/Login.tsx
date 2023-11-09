import { Link } from 'react-router-dom';

import Button from '../components/Button';
import Input from '../components/Input';

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
  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-5">
      <div className="mt-12 flex w-full flex-col sm:max-w-md">
        <h1 className="mb-12 text-center text-xl font-bold">반갑습니다!</h1>
        <div>
          <Input label="이메일" autoComplete="off" fullWidth className="mt-5" />
        </div>
        <div className="mt-5">
          <Input
            type="password"
            label="비밀번호"
            autoComplete="off"
            fullWidth
          />
        </div>
        <Button type="submit" className="mt-5 w-full">
          로그인
        </Button>
        <span className="text-neutral-dark-grey mt-10 block text-center text-sm">
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
        </div>
        <div className="mb-20 mt-10 flex justify-center">
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
