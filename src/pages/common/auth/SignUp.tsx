import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

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
import SocialLogin from '../../../components/common/auth/ui/SocialLogin';
import { AxiosError } from 'axios';
import MarketingModal from '../../../components/common/auth/modal/MarketingModal';
import InfoContainer from '../../../components/common/auth/ui/InfoContainer';
import useAuthStore from '../../../store/useAuthStore';
import { ErrorResonse } from '../../../interfaces/interface';

const SignUp = () => {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSocial, setIsSocial] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showMarketingModal, setShowMarketingModal] = useState<boolean>(false);

  const resultToToken = (result: string) => {
    if (result === '') {
      return undefined;
    }
    const token = JSON.parse(result);
    localStorage.setItem('access-token', token.accessToken);
    localStorage.setItem('refresh-token', token.refreshToken);
    // axios.defaults.headers.common.Authorization = `Bearer ${token.accessToken}`;
    setIsSocial(true);

    return token;
  };

  useEffect(() => {
    const error = searchParams.get('error');
    const result = searchParams.get('result');
    if (error !== null) {
      setError(true);
      setErrorMessage('이미 가입된 휴대폰 번호입니다.');
      return;
    }
    if (result) {
      resultToToken(result);
    }
  }, [searchParams]);


  const [isSignupSuccess, setIsSignupSuccess] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [value, setValue] = useState({
    email: '',
    name: '',
    phoneNum: '',
    password: '',
    passwordConfirm: '',
    inflow: '',
    acceptedAge: false,
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToMarketing: false,
  });

  const postSignUp = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/user/signup', {
        email: value.email,
        name: value.name,
        phoneNum: value.phoneNum,
        password: value.password,
        inflowPath: value.inflow,
        marketingAgree: value.agreeToMarketing,
      });
      return res.data;
    },
    onSuccess: () => {
      localStorage.setItem('email', value.email);
      setIsSignupSuccess(true);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ErrorResonse>;
      console.log(axiosError);
      setError(error);
      if (axiosError.response?.status === 409) {
        setErrorMessage(axiosError.response.data?.message || '이미 가입된 사용자입니다.');
      } else {
        setErrorMessage('회원가입에 실패했습니다.');
      }
    },
  });

  const patchUserInfo = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(
        '/user',
        {
          contactEmail: value.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      setIsSignupSuccess(true);
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      setError(error);
      if (axiosError.response?.status === 409) {
        setErrorMessage('이미 가입된 이메일입니다.');
      } else {
        setErrorMessage('회원가입에 실패했습니다.');
      }
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [navigate, isLoggedIn]);

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (buttonDisabled) return;
    if (!isValidEmail(value.email)) {
      setError(true);
      setErrorMessage('이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (!isSocial && !isValidPhoneNumber(value.phoneNum)) {
      setError(true);
      setErrorMessage('휴대폰 번호 형식이 올바르지 않습니다.');
      return;
    }
    if (!isSocial && !isValidPassword(value.password)) {
      setError(true);
      setErrorMessage(
        '비밀번호 형식이 올바르지 않습니다. (영어, 숫자, 특수문자 포함 8자 이상)',
      );
      return;
    }
    if (!isSocial && value.password !== value.passwordConfirm) {
      setError(true);
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (isSocial) {
      patchUserInfo.mutate();
    } else {
      postSignUp.mutate();
    }
  };

  useEffect(() => {
    if (isSocial) {
      if (
        value.email === '' ||
        value.acceptedAge === false ||
        value.agreeToTerms === false ||
        value.agreeToPrivacy === false
      ) {
        setButtonDisabled(true);
      } else {
        setButtonDisabled(false);
      }
    } else {
      if (
        value.email === '' ||
        value.name === '' ||
        value.phoneNum === '' ||
        value.password === '' ||
        value.passwordConfirm === '' ||
        value.inflow === '' ||
        value.acceptedAge === false ||
        value.agreeToTerms === false ||
        value.agreeToPrivacy === false
      ) {
        setButtonDisabled(true);
      } else {
        setButtonDisabled(false);
      }
    }
  }, [value, isSocial]);

  return (
    <>
      {/* <InfoContainer
        marketingAgree={value.agreeToMarketing}
        accountType={0}
        accountNum=""
        accountOwner=""
      /> */}
      {isSignupSuccess ? (
        <InfoContainer isSocial={isSocial} />
      ) : (
        <>
          <div className="container mx-auto mt-8 p-5">
            <div className="mx-auto mb-16 w-full sm:max-w-md">
              <span className="mb-2 block font-bold">회원가입</span>
              {
                !isSocial && (
                  <h1 className="mb-10 text-2xl">
                    기본 정보를
                    <br />
                    입력하세요
                  </h1>
                )
              }
              <form
                onSubmit={handleOnSubmit}
                className="flex flex-col space-y-3"
              >
                {
                  isSocial ? (
                    <div className="flex flex-col gap-2">
                    <div>
                      <label htmlFor="contactEmail" className="text-1-medium">
                        렛츠커리어 정보 수신용 이메일
                      </label>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-sm text-neutral-0 text-opacity-[52%]">
                          * 결제정보 및 프로그램 신청 관련 알림 수신을 위해, 자주 사용하는
                          이메일 주소를 입력해주세요!
                        </p>
                      </div>
                    </div>
                    <Input
                      name="contactEmail"
                      placeholder="example@example.com"
                      value={value.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValue({ ...value, email: e.target.value });
                      }} />
                  </div>
                  ) : (
                    <>
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
                            setValue({
                              ...value,
                              passwordConfirm: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Input
                          label="유입경로"
                          value={value.inflow}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setValue({ ...value, inflow: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )
                }
                <hr />
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <CheckBox
                      checked={
                        value.acceptedAge &&
                        value.agreeToTerms &&
                        value.agreeToPrivacy &&
                        value.agreeToMarketing
                      }
                      onClick={() =>
                        setValue(
                          (value.acceptedAge &&
                            value.agreeToTerms &&
                            value.agreeToPrivacy &&
                            value.agreeToMarketing) ? (
                              {
                          ...value,
                            acceptedAge: false,
                            agreeToTerms: false,
                            agreeToPrivacy: false,
                            agreeToMarketing: false,}
                            ) : ({
                          ...value,
                            acceptedAge: true,
                            agreeToTerms: true,
                            agreeToPrivacy: true,
                            agreeToMarketing: true,}
                            ))
                      }
                    />
                    <label
                      htmlFor="agree-to-all"
                      className="ml-2 w-full cursor-pointer text-xs font-bold"
                      onClick={() =>
                        setValue(
                          (value.acceptedAge &&
                            value.agreeToTerms &&
                            value.agreeToPrivacy &&
                            value.agreeToMarketing) ? (
                              {
                          ...value,
                            acceptedAge: false,
                            agreeToTerms: false,
                            agreeToPrivacy: false,
                            agreeToMarketing: false,}
                            ) : ({
                          ...value,
                            acceptedAge: true,
                            agreeToTerms: true,
                            agreeToPrivacy: true,
                            agreeToMarketing: true,}
                            ))
                      }
                    >
                      전체 동의
                    </label>
                  </div>
                  <div className="flex items-center">
                    <CheckBox
                      checked={value.acceptedAge}
                      onClick={() =>
                        setValue({
                          ...value,
                          acceptedAge: !value.acceptedAge,
                        })
                      }
                    />
                    <label
                      htmlFor="accepted-age"
                      className="ml-2 w-full cursor-pointer text-xs"
                      onClick={() =>
                        setValue({
                          ...value,
                          acceptedAge: !value.acceptedAge,
                        })
                      }
                    >
                      [필수] 만 14세 이상입니다.
                    </label>
                  </div>
                  <div className="flex w-full items-center">
                    <CheckBox
                      checked={value.agreeToTerms}
                      onClick={() =>
                        setValue({
                          ...value,
                          agreeToTerms: !value.agreeToTerms,
                        })
                      }
                    />
                    <label
                      htmlFor="agree-to-terms"
                      className="ml-2 flex w-full cursor-pointer items-center justify-between text-xs"
                      onClick={() =>
                        setValue({
                          ...value,
                          agreeToTerms: !value.agreeToTerms,
                        })
                      }
                    >
                      <div>
                        [필수]{' '}
                        <span className="text-[#0500FF]">서비스 이용약관</span>{' '}
                        동의
                      </div>
                      <PrivacyLink
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            'https://letsintern.notion.site/241b2e747ddf47478012a68f7c03f9e1?pvs=25',
                            '_blank',
                          );
                        }}
                      >
                        보기
                      </PrivacyLink>
                    </label>
                  </div>
                  <div className="flex w-full items-center">
                    <CheckBox
                      checked={value.agreeToPrivacy}
                      onClick={() =>
                        setValue({
                          ...value,
                          agreeToPrivacy: !value.agreeToPrivacy,
                        })
                      }
                    />
                    <label
                      htmlFor="agree-to-privacy"
                      className="ml-2 flex w-full cursor-pointer items-center justify-between text-xs"
                      onClick={() =>
                        setValue({
                          ...value,
                          agreeToPrivacy: !value.agreeToPrivacy,
                        })
                      }
                    >
                      <div>
                        [필수]{' '}
                        <span className="text-[#0500FF]">
                          개인정보 수집 및 이용
                        </span>{' '}
                        동의
                      </div>
                      <PrivacyLink
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPrivacyModal(true);
                        }}
                      >
                        보기
                      </PrivacyLink>
                    </label>
                    <PrivacyPolicyModal
                      showModal={showPrivacyModal}
                      setShowModal={setShowPrivacyModal}
                    />
                  </div>
                  <div className="flex w-full items-center">
                    <CheckBox
                      checked={value.agreeToMarketing}
                      onClick={() =>
                        setValue({
                          ...value,
                          agreeToMarketing: !value.agreeToMarketing,
                        })
                      }
                    />
                    <label
                      htmlFor="agree-to-marketing"
                      className="ml-2 flex w-full cursor-pointer items-center justify-between gap-x-2.5 text-xs"
                      onClick={() =>
                        setValue({
                          ...value,
                          agreeToMarketing: !value.agreeToMarketing,
                        })
                      }
                    >
                      <div className="grow break-keep">
                        [선택] 렛츠커리어 프로그램 개설 소식을 가장 먼저
                        받아볼래요!
                      </div>
                      <PrivacyLink
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMarketingModal(true);
                        }}
                      >
                        보기
                      </PrivacyLink>
                    </label>
                    <MarketingModal
                      showModal={showMarketingModal}
                      setShowModal={setShowMarketingModal}
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
                  className="mt-8"
                  {...(buttonDisabled && { disabled: true })}
                >
                  {
                    isSocial ? '다음' : '회원가입'}
                </Button>
              </form>
              {
                !isSocial && <SocialLogin type="SIGN_UP" />
              }
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SignUp;
