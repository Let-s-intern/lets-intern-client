import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../../components/ui/input/Input';
import Button from '../../../components/common/ui/button/Button';
import axios from '../../../utils/axios';
import PrivacyPolicyModal from '../../../components/common/auth/modal/PrivacyPolicyModal';
import CheckBox from '../../../components/common/auth/ui/CheckBox';
import PrivacyLink from '../../../components/common/auth/ui/PrivacyLink';
import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
} from '../../../utils/valid';
import AlertModal from '../../../components/ui/alert/AlertModal';
import SocialLogin from '../../../components/common/auth/ui/SocialLogin';

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
  const [error, setError] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');
    if (accessToken && refreshToken) {
      navigate('/');
    }
  }, [navigate]);

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (buttonDisabled) return;
    if (!isValidEmail(value.email)) {
      setError(true);
      setErrorMessage('이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (!isValidPhoneNumber(value.phoneNum)) {
      setError(true);
      setErrorMessage('휴대폰 번호 형식이 올바르지 않습니다.');
      return;
    }
    if (!isValidPassword(value.password)) {
      setError(true);
      setErrorMessage(
        '비밀번호 형식이 올바르지 않습니다. (영어, 숫자, 특수문자 포함 8자 이상)',
      );
      return;
    }
    if (value.password !== value.passwordConfirm) {
      setError(true);
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    const fetchSignUp = async () => {
      const { passwordConfirm, agreeToTerms, agreeToPrivacy, ...data } = value;
      try {
        await axios.post('/user/signup', data, {
          headers: { Authorization: '' },
        });
        setSuccessModalOpen(true);
      } catch (err) {
        console.error(err);
        setError(err);
        setErrorMessage((err as any).response?.data.reason);
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
        <span className="mb-2 block font-bold">회원가입</span>
        <h1 className="mb-10 text-2xl">
          기본 정보를
          <br />
          입력하세요
        </h1>
        <form onSubmit={handleOnSubmit} className="flex flex-col space-y-3">
          <div>
            <Input
              label="이메일"
              placeholder="example@example.com"
              value={value.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, email: e.target.value })
              }
            />
          </div>
          <div>
            <Input
              label="이름"
              value={value.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, name: e.target.value })
              }
            />
          </div>
          <div>
            <Input
              label="휴대폰 번호"
              placeholder="010-1234-4567"
              value={value.phoneNum}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, phoneNum: e.target.value })
              }
            />
          </div>
          <div>
            <Input
              type="password"
              label="비밀번호"
              placeholder="영어, 숫자, 특수문자 포함 8자 이상"
              value={value.password}
              onChange={(e: any) => {
                setValue({ ...value, password: e.target.value });
              }}
            />
          </div>
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
          <div className="flex flex-col space-y-2">
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
                <PrivacyLink
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      'https://letsintern.notion.site/241b2e747ddf47478012a68f7c03f9e1?pvs=25',
                      '_blank',
                    );
                  }}
                >
                  (필수)서비스 이용약관
                </PrivacyLink>
                에 동의합니다.
              </label>
            </div>
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
                <PrivacyLink
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                >
                  (필수)개인정보 수집 및 이용 동의서
                </PrivacyLink>
                에 동의합니다.
              </label>
              <PrivacyPolicyModal
                showModal={showModal}
                setShowModal={setShowModal}
              />
            </div>
          </div>
          {error ? (
            <span className="block text-center text-sm text-red-500">
              {errorMessage ? errorMessage : ''}
            </span>
          ) : null}
          <Button
            type="submit"
            className="mt-5"
            {...(buttonDisabled && { disabled: true })}
          >
            회원가입
          </Button>
        </form>
        <SocialLogin type="SIGN_UP" />
      </div>
      {successModalOpen && (
        <AlertModal
          onConfirm={() => {
            navigate('/login');
          }}
          title="회원가입 완료"
          showCancel={false}
          highlight="confirm"
        >
          회원가입이 완료되었습니다.
          <br />
          로그인 페이지에서 로그인을 진행해주세요.
        </AlertModal>
      )}
    </div>
  );
};

export default SignUp;
