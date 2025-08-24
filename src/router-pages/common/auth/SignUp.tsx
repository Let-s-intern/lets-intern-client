import MarketingModal from '@/components/common/auth/modal/MarketingModal';
import PrivacyPolicyModal from '@/components/common/auth/modal/PrivacyPolicyModal';
import InfoContainer from '@/components/common/auth/ui/InfoContainer';
import PrivacyLink from '@/components/common/auth/ui/PrivacyLink';
import SocialLogin from '@/components/common/auth/ui/SocialLogin';
import Button from '@/components/common/ui/button/Button';
import Input from '@/components/ui/input/Input';
import useAuthStore from '@/store/useAuthStore';
import { ErrorResonse } from '@/types/interface';
import axios from '@/utils/axios';
import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
} from '@/utils/valid';
import CheckBox from '@components/common/ui/CheckBox';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const { isLoggedIn, login } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [isSocial, setIsSocial] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showMarketingModal, setShowMarketingModal] = useState<boolean>(false);
  const [accessTokenForSocialSignup, setAccessTokenForSocialSignup] =
    useState('');

  useEffect(() => {
    const resultToToken = (result: string): string | undefined => {
      if (result === '') {
        return undefined;
      }
      const token = JSON.parse(result);
      if (!token.isNew) {
        login(token.accessToken, token.refreshToken);
        navigate(searchParams.get('redirect') || '/');
        return;
      }
      setIsSocial(true);

      return token.accessToken;
    };

    const error = searchParams.get('error');
    const result = searchParams.get('result');
    if (error !== null) {
      setError(true);
      setErrorMessage('이미 가입된 휴대폰 번호입니다.');
      return;
    }
    if (result) {
      const accessTokenForSocialSignup = resultToToken(result);
      if (accessTokenForSocialSignup) {
        setAccessTokenForSocialSignup(accessTokenForSocialSignup);
      }
    }
  }, [searchParams, login, navigate]);

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

  const handlePhoneNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phoneNum = e.target.value.replace(/[^0-9]/g, '');

    if (phoneNum.length > 11) {
      phoneNum = phoneNum.slice(0, 11);
    }

    if (phoneNum.length <= 6) {
      phoneNum = phoneNum.replace(/(\d{0,3})(\d{0,3})/, (match, p1, p2) => {
        return p2 ? `${p1}-${p2}` : `${p1}`;
      });
    } else if (phoneNum.length <= 10) {
      phoneNum = phoneNum.replace(
        /(\d{0,3})(\d{0,3})(\d{0,4})/,
        (match, p1, p2, p3) => {
          return p3 ? `${p1}-${p2}-${p3}` : `${p1}-${p2}`;
        },
      );
    } else {
      phoneNum = phoneNum.replace(
        /(\d{3})(\d{4})(\d+)/,
        (match, p1, p2, p3) => {
          return `${p1}-${p2}-${p3}`;
        },
      );
    }

    setValue({ ...value, phoneNum });
  };

  const postEmailUser = useMutation({
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
      setIsSignupSuccess(true);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ErrorResonse>;
      setError(error);
      if (axiosError.response?.status === 409) {
        setErrorMessage(
          axiosError.response.data?.message || '이미 가입된 사용자입니다.',
        );
      } else {
        setErrorMessage('회원가입에 실패했습니다.');
      }
    },
  });

  const patchSocialUserContactEmail = useMutation({
    mutationFn: async () => {
      const res = await axios({
        method: 'PATCH',
        url: '/user',
        data: { contactEmail: value.email, inflowPath: value.inflow },
        headers: {
          Authorization: `Bearer ${accessTokenForSocialSignup}`,
          'Content-Type': 'application/json',
        },
      });
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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
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
      patchSocialUserContactEmail.mutate();
    } else {
      postEmailUser.mutate();
    }
  };

  useEffect(() => {
    if (isSocial) {
      if (
        value.email === '' ||
        value.inflow === '' ||
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
      {isSignupSuccess ? (
        <InfoContainer isSocial={isSocial} email={value.email} />
      ) : (
        <>
          <div className="container mx-auto mt-8 p-5">
            <div className="mx-auto mb-16 w-full sm:max-w-md">
              <span className="mb-2 block font-bold">회원가입</span>
              {!isSocial && (
                <h1 className="mb-10 text-2xl">
                  기본 정보를
                  <br />
                  입력하세요
                </h1>
              )}
              <form onSubmit={onSubmit} className="flex flex-col space-y-3">
                {isSocial ? (
                  <div className="flex flex-col gap-2">
                    <div>
                      <label htmlFor="contactEmail" className="text-1-medium">
                        렛츠커리어 정보 수신용 이메일
                      </label>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-sm text-neutral-0 text-opacity-[52%]">
                          * 결제정보 및 프로그램 신청 관련 알림 수신을 위해,
                          자주 사용하는 이메일 주소를 입력해주세요!
                        </p>
                      </div>
                    </div>
                    <Input
                      name="contactEmail"
                      placeholder="example@example.com"
                      value={value.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValue({ ...value, email: e.target.value });
                      }}
                    />
                    <Input
                      label="유입경로"
                      value={value.inflow}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue({ ...value, inflow: e.target.value })
                      }
                    />
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
                          handlePhoneNumChange(e)
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
                )}
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
                          value.acceptedAge &&
                            value.agreeToTerms &&
                            value.agreeToPrivacy &&
                            value.agreeToMarketing
                            ? {
                                ...value,
                                acceptedAge: false,
                                agreeToTerms: false,
                                agreeToPrivacy: false,
                                agreeToMarketing: false,
                              }
                            : {
                                ...value,
                                acceptedAge: true,
                                agreeToTerms: true,
                                agreeToPrivacy: true,
                                agreeToMarketing: true,
                              },
                        )
                      }
                    />
                    <label
                      htmlFor="agree-to-all"
                      className="ml-2 w-full cursor-pointer text-xs font-bold"
                      onClick={() =>
                        setValue(
                          value.acceptedAge &&
                            value.agreeToTerms &&
                            value.agreeToPrivacy &&
                            value.agreeToMarketing
                            ? {
                                ...value,
                                acceptedAge: false,
                                agreeToTerms: false,
                                agreeToPrivacy: false,
                                agreeToMarketing: false,
                              }
                            : {
                                ...value,
                                acceptedAge: true,
                                agreeToTerms: true,
                                agreeToPrivacy: true,
                                agreeToMarketing: true,
                              },
                        )
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
                            'https://letsintern.notion.site/a121a038f72f42d7bde747624ecc0943?pvs=4',
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
                  {isSocial ? '다음' : '회원가입'}
                </Button>
              </form>
              {!isSocial && <SocialLogin type="SIGN_UP" />}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SignUp;
