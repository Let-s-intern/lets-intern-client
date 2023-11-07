import { Link } from 'react-router-dom';

import Label from '../components/Label';
import Input from '../components/Input';
import FormTitle from '../components/FormTitle';
import Button from '../components/Button';

interface ButtonLinkProps {
  to: string;
  children: React.ReactNode;
}

const ButtonLink = ({ to, children }: ButtonLinkProps) => {
  return (
    <Link
      to={to}
      className="w-full rounded-full border border-gray-300 bg-white py-2 text-center font-semibold text-black"
    >
      {children}
    </Link>
  );
};

const Login = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-5">
      <div className="mt-8 flex w-full flex-col space-y-5 sm:mt-32 sm:max-w-md">
        <FormTitle textAlign="center">로그인</FormTitle>
        <div>
          <Label id="이메일" text="이메일" />
          <Input placeholder="이메일" />
        </div>
        <div>
          <Label id="비밀번호" text="비밀번호" />
          <Input placeholder="비밀번호" type="password" />
        </div>
        <div>
          <Button type="submit">로그인</Button>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <ButtonLink to="/signup">회원가입</ButtonLink>
            <ButtonLink to="/find-password">비밀번호 찾기</ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
