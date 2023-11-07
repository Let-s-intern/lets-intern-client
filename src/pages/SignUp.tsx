import { useState } from 'react';
import FormTitle from '../components/FormTitle';
import Input from '../components/Input';
import Label from '../components/Label';
import Button from '../components/Button';

interface FormSubTitleProps {
  textAlign?: string;
  className?: string;
  children: React.ReactNode;
}

const FormSubTitle = ({
  textAlign = 'left',
  className,
  children,
}: FormSubTitleProps) => {
  return (
    <h3
      className={`text-lg font-semibold text-${textAlign} ${
        textAlign === 'center' ? 'text-center' : 'text-left'
      }${className ? ` ${className}` : ''}`}
    >
      {children}
    </h3>
  );
};

const SignUp = () => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);

  const handleAgreeToTermsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAgreeToTerms(event.target.checked);
  };

  const handleAgreeToPrivacyChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAgreeToPrivacy(event.target.checked);
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto mt-8 p-5">
      <div className="mx-auto w-full sm:max-w-md">
        <FormTitle className="mb-3">회원가입</FormTitle>
        <FormSubTitle className="mb-3">필수 정보</FormSubTitle>
        <form onSubmit={handleOnSubmit} className="flex flex-col space-y-5">
          <div>
            <Label id="email" text="이메일" />
            <Input placeholder="example@example.com" />
          </div>
          <div>
            <Label id="name" text="이름" />
            <Input placeholder="이름" />
          </div>
          <div>
            <Label id="tel" text="휴대폰 번호" />
            <Input placeholder="-를 제외한 전화번호" />
          </div>
          <div>
            <Label id="password" text="비밀번호" />
            <Input placeholder="비밀번호" type="password" />
          </div>
          <div>
            <Label id="confirm-password" text="비밀번호 확인" />
            <Input placeholder="비밀번호 확인" type="password" />
          </div>
          <hr />
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree-to-terms"
                name="agree-to-terms"
                checked={agreeToTerms}
                onChange={handleAgreeToTermsChange}
              />
              <label
                htmlFor="agree-to-terms"
                className="ml-2 cursor-pointer text-sm"
              >
                <b className="font-semibold">(필수)서비스이용약관</b>에
                동의합니다.
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree-to-privacy"
                name="agree-to-privacy"
                checked={agreeToPrivacy}
                onChange={handleAgreeToPrivacyChange}
              />
              <label
                htmlFor="agree-to-privacy"
                className="ml-2 cursor-pointer text-sm"
              >
                <b className="font-semibold">(필수)개인정보처리방침</b>에
                동의합니다.
              </label>
            </div>
          </div>
          <Button type="submit" className="mb-10 mt-5">
            회원가입
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
