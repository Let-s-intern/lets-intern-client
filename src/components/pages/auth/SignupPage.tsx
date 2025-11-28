'use client';

import MarketingModal from '@/components/common/auth/modal/MarketingModal';
import PrivacyPolicyModal from '@/components/common/auth/modal/PrivacyPolicyModal';
import InfoContainer from '@/components/common/auth/ui/InfoContainer';
import PrivacyLink from '@/components/common/auth/ui/PrivacyLink';
import SocialLogin from '@/components/common/auth/ui/SocialLogin';
import CheckBox from '@/components/common/ui/CheckBox';
import LineInput from '@/components/common/ui/input/LineInput';
import SolidButton from '@/components/ui/button/SolidButton';
import useAuthStore from '@/store/useAuthStore';
import { ErrorResonse } from '@/types/interface';
import axios from '@/utils/axios';
import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
} from '@/utils/valid';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

const SignUp = () => {
  const router = useRouter();

  const { isLoggedIn, login } = useAuthStore();
  const searchParams = useSearchParams();
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
        router.push(searchParams.get('redirect') || '/');
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
  }, [searchParams, login, router]);

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
        setErrorMessage(
          axiosError.response?.data?.message || '회원가입에 실패했습니다.',
        );
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
      router.push('/');
    }
  }, [router, isLoggedIn]);

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

  const isAllAgreed =
    value.acceptedAge &&
    value.agreeToTerms &&
    value.agreeToPrivacy &&
    value.agreeToMarketing;

  const handleToggleAll = () => {
    const newValue = !isAllAgreed;
    setValue({
      ...value,
      acceptedAge: newValue,
      agreeToTerms: newValue,
      agreeToPrivacy: newValue,
      agreeToMarketing: newValue,
    });
  };

  return (
    <>
      {isSignupSuccess ? (
        <InfoContainer isSocial={isSocial} email={value.email} />
      ) : (
        <div className="w-full pt-9 md:mx-auto md:w-[448px] md:py-16">
          <section className="mx-5 mb-[80px] md:mx-0 md:mb-[60px]">
            <div className="mb-9">
              {/* 헤더 */}
              <span className="text-xsmall16 leading-[1.625rem] text-neutral-30">
                회원가입
              </span>
              {/* 타이틀 */}
              {!isSocial && (
                <h1 className="mt-6 text-medium24 font-semibold text-neutral-0">
                  기본 정보를 입력해 주세요.
                </h1>
              )}
            </div>

            <form onSubmit={onSubmit}>
              {/* 기본 정보 입력 필드 */}
              {isSocial ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xsmall14 text-neutral-0">
                      렛츠커리어 정보 수신용 이메일
                    </label>
                    <p className="mb-1 text-xsmall14 text-neutral-40">
                      * 결제정보 및 프로그램 신청 관련 알림 수신을 위해, 자주
                      사용하는 이메일 주소를 입력해주세요!
                    </p>
                    <LineInput
                      name="contactEmail"
                      placeholder="이메일을 입력해 주세요."
                      value={value.email}
                      onChange={(e) =>
                        setValue({ ...value, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">
                      유입경로
                    </label>
                    <LineInput
                      placeholder="유입경로를 입력해 주세요."
                      value={value.inflow}
                      onChange={(e) =>
                        setValue({ ...value, inflow: e.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">
                      이메일
                    </label>
                    <LineInput
                      placeholder="이메일을 입력해 주세요."
                      value={value.email}
                      onChange={(e) =>
                        setValue({ ...value, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">이름</label>
                    <LineInput
                      placeholder="이름을 입력해 주세요."
                      value={value.name}
                      onChange={(e) =>
                        setValue({ ...value, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">
                      휴대폰 번호
                    </label>
                    <LineInput
                      placeholder="휴대폰 번호를 입력해 주세요."
                      value={value.phoneNum}
                      onChange={handlePhoneNumChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">
                      비밀번호
                    </label>
                    <LineInput
                      type="password"
                      placeholder="비밀번호를 입력해 주세요."
                      value={value.password}
                      onChange={(e) =>
                        setValue({ ...value, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">
                      비밀번호 확인
                    </label>
                    <LineInput
                      type="password"
                      placeholder="비밀번호를 다시 입력해 주세요."
                      value={value.passwordConfirm}
                      onChange={(e) =>
                        setValue({ ...value, passwordConfirm: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xsmall14 text-neutral-0">
                      유입경로
                    </label>
                    <LineInput
                      placeholder="유입경로를 입력해 주세요."
                      value={value.inflow}
                      onChange={(e) =>
                        setValue({ ...value, inflow: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* 약관 동의 */}
              <div className="mt-12 flex flex-col gap-2">
                {/* 전체 동의 */}
                <button
                  type="button"
                  className="flex items-center gap-2"
                  onClick={handleToggleAll}
                >
                  <CheckBox checked={isAllAgreed} width="w-6" showCheckIcon />
                  <span className="text-xsmall14 font-semibold text-neutral-0">
                    전체 동의
                  </span>
                </button>

                <hr className="border-neutral-80" />

                {/* 필수: 만 14세 이상 */}
                <button
                  type="button"
                  className="flex items-center gap-2"
                  onClick={() =>
                    setValue({ ...value, acceptedAge: !value.acceptedAge })
                  }
                >
                  <CheckBox
                    checked={value.acceptedAge}
                    width="w-6"
                    showCheckIcon
                  />
                  <span className="text-xsmall14 text-neutral-0">
                    [필수] 만 14세 이상입니다.
                  </span>
                </button>

                {/* 필수: 서비스 이용약관 */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="flex items-center gap-2"
                    onClick={() =>
                      setValue({ ...value, agreeToTerms: !value.agreeToTerms })
                    }
                  >
                    <CheckBox
                      checked={value.agreeToTerms}
                      width="w-6"
                      showCheckIcon
                    />
                    <span className="text-xsmall14 text-neutral-0">
                      [필수]{' '}
                      <span className="text-primary">서비스 이용약관</span> 동의
                    </span>
                  </button>
                  <PrivacyLink
                    onClick={() =>
                      window.open(
                        'https://letsintern.notion.site/a121a038f72f42d7bde747624ecc0943?pvs=4',
                        '_blank',
                      )
                    }
                  >
                    보기
                  </PrivacyLink>
                </div>

                {/* 필수: 개인정보 수집 및 이용 */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="flex items-center gap-2"
                    onClick={() =>
                      setValue({
                        ...value,
                        agreeToPrivacy: !value.agreeToPrivacy,
                      })
                    }
                  >
                    <CheckBox
                      checked={value.agreeToPrivacy}
                      width="w-6"
                      showCheckIcon
                    />
                    <span className="text-xsmall14 text-neutral-0">
                      [필수]{' '}
                      <span className="text-primary">
                        개인정보 수집 및 이용
                      </span>{' '}
                      동의
                    </span>
                  </button>
                  <PrivacyLink onClick={() => setShowPrivacyModal(true)}>
                    보기
                  </PrivacyLink>
                </div>

                {/* 선택: 마케팅 수신 동의 */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="flex items-center gap-2"
                    onClick={() =>
                      setValue({
                        ...value,
                        agreeToMarketing: !value.agreeToMarketing,
                      })
                    }
                  >
                    <CheckBox
                      checked={value.agreeToMarketing}
                      width="w-6"
                      showCheckIcon
                    />
                    <span className="block break-words break-keep text-left text-xsmall14 text-neutral-0">
                      [선택] 렛츠커리어 프로그램 개설 소식을 가장 먼저
                      받아볼래요!
                    </span>
                  </button>
                  <PrivacyLink onClick={() => setShowMarketingModal(true)}>
                    보기
                  </PrivacyLink>
                </div>
              </div>

              {/* 에러 메시지 */}
              {error ? (
                <p className="mt-4 text-center text-xsmall14 text-system-error">
                  {errorMessage}
                </p>
              ) : null}

              {/* 가입하기 버튼 */}
              <SolidButton
                type="submit"
                className="mt-12 w-full"
                disabled={buttonDisabled}
              >
                {isSocial ? '다음' : '가입하기'}
              </SolidButton>
            </form>

            {/* SNS 간편 회원가입 */}
            {!isSocial && <SocialLogin type="SIGN_UP" />}
          </section>

          {/* 모달 */}
          <PrivacyPolicyModal
            showModal={showPrivacyModal}
            setShowModal={setShowPrivacyModal}
          />
          <MarketingModal
            showModal={showMarketingModal}
            setShowModal={setShowMarketingModal}
          />
        </div>
      )}
    </>
  );
};

export default SignUp;
