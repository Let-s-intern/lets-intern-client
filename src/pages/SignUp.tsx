import { useEffect, useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from '../libs/axios';
import { useNavigate } from 'react-router-dom';

interface CheckBoxProps {
  checked: boolean;
  onClick: () => void;
}

const CheckBox = ({ checked, onClick }: CheckBoxProps) => {
  return (
    <div className="flex items-center" onClick={onClick}>
      {checked ? (
        <img src="/icons/checkbox-checked.svg" alt="체크됨" />
      ) : (
        <img src="/icons/checkbox-unchecked.svg" alt="체크되지 않음" />
      )}
    </div>
  );
};

const SignUp = () => {
  const navigate = useNavigate();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [value, setValue] = useState({
    email: '',
    name: '',
    phoneNum: '',
    password: '',
    passwordConfirm: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');
    if (accessToken && refreshToken) {
      navigate('/');
    }
  }, []);

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fetchSignUp = async () => {
      const { passwordConfirm, agreeToTerms, agreeToPrivacy, ...data } = value;
      try {
        const res = await axios.post('/user/signup', data, {
          headers: { Authorization: '' },
        });
        console.log(res);
        navigate('/login');
      } catch (err) {
        console.error(err);
      }
    };
    fetchSignUp();
  };

  useEffect(() => {
    if (
      value.email === '' ||
      value.name === '' ||
      value.phoneNum === '' ||
      value.password === '' ||
      value.passwordConfirm === '' ||
      value.agreeToTerms === false ||
      value.agreeToPrivacy === false
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [value]);

  return (
    <div className="container mx-auto mt-8 p-5">
      <div className="mx-auto mb-16 w-full sm:max-w-md">
        {/* 제목 섹션 */}
        <span className="mb-2 block font-bold">회원가입</span>
        <h1 className="mb-10 text-2xl">
          기본 정보를
          <br />
          입력하세요
        </h1>
        {/* 회원가입 입력 폼 */}
        <form onSubmit={handleOnSubmit} className="flex flex-col space-y-3">
          {/* 이메일 입력 */}
          <div>
            <Input
              type="email"
              label="이메일"
              placeholder="example@example.com"
              value={value.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, email: e.target.value })
              }
            />
          </div>
          {/* 이름 입력 */}
          <div>
            <Input
              label="이름"
              value={value.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, name: e.target.value })
              }
            />
          </div>
          {/* 휴대폰 번호 입력 */}
          <div>
            <Input
              label="휴대폰 번호"
              placeholder="-를 제외한 전화번호"
              value={value.phoneNum}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, phoneNum: e.target.value })
              }
            />
          </div>
          {/* 비밀번호 입력 */}
          <div>
            <Input
              type="password"
              label="비밀번호"
              value={value.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, password: e.target.value })
              }
            />
          </div>
          {/* 비밀번호 확인 입력 */}
          <div>
            <Input
              type="password"
              label="비밀번호 확인"
              value={value.passwordConfirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, passwordConfirm: e.target.value })
              }
            />
          </div>
          <hr />
          {/* 약관 동의 체크박스 */}
          <div className="flex flex-col space-y-2">
            {/* 서비스이용약관 체크박스 */}
            <div className="flex items-center">
              <CheckBox
                checked={value.agreeToTerms}
                onClick={() =>
                  setValue({ ...value, agreeToTerms: !value.agreeToTerms })
                }
              />
              <label
                htmlFor="agree-to-terms"
                className="ml-2 cursor-pointer text-sm"
                onClick={() =>
                  setValue({ ...value, agreeToTerms: !value.agreeToTerms })
                }
              >
                <b className="font-medium">(필수)서비스이용약관</b>에
                동의합니다.
              </label>
            </div>
            {/* 개인정보처리방침 체크박스 */}
            <div className="flex items-center">
              <CheckBox
                checked={value.agreeToPrivacy}
                onClick={() =>
                  setValue({ ...value, agreeToPrivacy: !value.agreeToPrivacy })
                }
              />
              <label
                htmlFor="agree-to-privacy"
                className="ml-2 cursor-pointer text-sm"
                onClick={() =>
                  setValue({ ...value, agreeToPrivacy: !value.agreeToPrivacy })
                }
              >
                <b className="font-medium">(필수)개인정보처리방침</b>에
                동의합니다.
              </label>
            </div>
          </div>
          {/* 회원가입 버튼 */}
          <Button
            type="submit"
            className="mt-5"
            {...(buttonDisabled && { disabled: true })}
          >
            회원가입
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
