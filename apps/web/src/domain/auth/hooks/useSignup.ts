'use client';

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

export interface SignupValue {
  email: string;
  name: string;
  phoneNum: string;
  password: string;
  passwordConfirm: string;
  inflow: string;
  acceptedAge: boolean;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToMarketing: boolean;
}

const INITIAL_VALUE: SignupValue = {
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
};

const formatPhoneNumber = (raw: string): string => {
  let digits = raw.replace(/[^0-9]/g, '');
  if (digits.length > 11) digits = digits.slice(0, 11);

  if (digits.length <= 6) {
    return digits.replace(/(\d{0,3})(\d{0,3})/, (_, p1, p2) =>
      p2 ? `${p1}-${p2}` : p1,
    );
  }
  if (digits.length <= 10) {
    return digits.replace(/(\d{0,3})(\d{0,3})(\d{0,4})/, (_, p1, p2, p3) =>
      p3 ? `${p1}-${p2}-${p3}` : `${p1}-${p2}`,
    );
  }
  return digits.replace(
    /(\d{3})(\d{4})(\d+)/,
    (_, p1, p2, p3) => `${p1}-${p2}-${p3}`,
  );
};

const useSignup = () => {
  const router = useRouter();
  const { isLoggedIn, login } = useAuthStore();
  const searchParams = useSearchParams();

  const [isSocial, setIsSocial] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [value, setValue] = useState<SignupValue>(INITIAL_VALUE);
  const [accessTokenForSocialSignup, setAccessTokenForSocialSignup] =
    useState('');

  // 소셜 로그인 토큰 파싱
  useEffect(() => {
    const error = searchParams.get('error');
    const result = searchParams.get('result');

    if (error !== null) {
      setError(true);
      setErrorMessage('이미 가입된 휴대폰 번호입니다.');
      return;
    }

    if (result && result !== '') {
      const token = JSON.parse(result);
      if (!token.isNew) {
        login(token.accessToken, token.refreshToken);
        router.push(searchParams.get('redirect') || '/');
        return;
      }
      setIsSocial(true);
      setAccessTokenForSocialSignup(token.accessToken);
    }
  }, [searchParams, login, router]);

  // 로그인 상태면 홈으로 리다이렉트
  useEffect(() => {
    if (isLoggedIn) router.push('/');
  }, [router, isLoggedIn]);

  // 버튼 활성화 상태 (파생)
  const requiredFields = isSocial
    ? [value.email, value.inflow]
    : [
        value.email,
        value.name,
        value.phoneNum,
        value.password,
        value.passwordConfirm,
        value.inflow,
      ];
  const hasEmptyField = requiredFields.some((field) => field === '');
  const hasUncheckedAgreement =
    !value.acceptedAge || !value.agreeToTerms || !value.agreeToPrivacy;
  const buttonDisabled = hasEmptyField || hasUncheckedAgreement;

  // 이메일 회원가입
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
    onSuccess: () => setIsSignupSuccess(true),
    onError: (error) => {
      const axiosError = error as AxiosError<ErrorResonse>;
      setError(error);
      setErrorMessage(
        axiosError.response?.status === 409
          ? axiosError.response.data?.message || '이미 가입된 사용자입니다.'
          : axiosError.response?.data?.message || '회원가입에 실패했습니다.',
      );
    },
  });

  // 소셜 회원가입
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
    onSuccess: () => setIsSignupSuccess(true),
    onError: (error) => {
      const axiosError = error as AxiosError;
      setError(error);
      setErrorMessage(
        axiosError.response?.status === 409
          ? '이미 가입된 이메일입니다.'
          : '회원가입에 실패했습니다.',
      );
    },
  });

  const handlePhoneNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, phoneNum: formatPhoneNumber(e.target.value) });
  };

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

  const isAllAgreed =
    value.acceptedAge &&
    value.agreeToTerms &&
    value.agreeToPrivacy &&
    value.agreeToMarketing;

  const handleToggleAll = () => {
    const next = !isAllAgreed;
    setValue({
      ...value,
      acceptedAge: next,
      agreeToTerms: next,
      agreeToPrivacy: next,
      agreeToMarketing: next,
    });
  };

  return {
    value,
    setValue,
    isSocial,
    error,
    errorMessage,
    isSignupSuccess,
    buttonDisabled,
    handlePhoneNumChange,
    onSubmit,
    isAllAgreed,
    handleToggleAll,
  };
};

export default useSignup;
