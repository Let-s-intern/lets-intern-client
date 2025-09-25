import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import useAuthStore from '../../../../store/useAuthStore';
import axios from '../../../../utils/axios';
import AlertModal from '../../../ui/alert/AlertModal';
import Input from '../../../ui/input/Input';
import GradeDropdown from '../../mypage/privacy/form-control/GradeDropdown';
import Button from '../../ui/button/Button';

const InfoContainer = ({
  isSocial,
  email,
}: {
  isSocial: boolean;
  email: string;
}) => {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [value, setValue] = useState<{
    inflow: string;
    university: string;
    grade: string;
    major: string;
    wishJob: string;
    wishCompany: string;
  }>({
    inflow: '',
    university: '',
    grade: '',
    major: '',
    wishJob: '',
    wishCompany: '',
  });
  const [error, setError] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { logout } = useAuthStore();
  let accessToken = '';
  try {
    accessToken = JSON.parse(String(searchParams.get('result'))).accessToken;
  } catch {
    // empty
  }

  const patchEmailUserInfo = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/user/additional-info`, {
        email,
        university: value.university,
        major: value.major,
        grade: value.grade,
        wishJob: value.wishJob,
        wishCompany: value.wishCompany,
      });
      return res.data;
    },
    onSuccess: () => {
      setSuccessModalOpen(true);
      localStorage.removeItem('email');
    },
    onError: (error) => {
      // const axiosError = error as AxiosError;
      setError(error);
      setErrorMessage('추가 정보 입력에 실패했습니다.');
    },
  });

  const patchSocialUserInfo = useMutation({
    mutationFn: async () => {
      const res = await axios({
        method: 'patch',
        url: '/user',
        data: {
          inflowPath: value.inflow,
          university: value.university,
          grade: value.grade,
          major: value.major,
          wishJob: value.wishJob,
          wishCompany: value.wishCompany,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      logout();
      setSuccessModalOpen(true);
    },
    onError: (error) => {
      setError(error);
      setErrorMessage('추가 정보 입력에 실패했습니다.');
    },
  });

  const handleGradeChange = (grade: string) => {
    setValue({ ...value, grade });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !value.university ||
      !value.major ||
      !value.grade ||
      !value.wishJob ||
      !value.wishCompany
    ) {
      setError(true);
      setErrorMessage('모든 항목을 입력해주세요.');
      return;
    }
    if (!value.grade) {
      setError(true);
      setErrorMessage('학년을 선택해주세요.');
      return;
    }

    if (isSocial) {
      patchSocialUserInfo.mutate();
    } else {
      patchEmailUserInfo.mutate();
    }
  };

  useEffect(() => {
    if (
      (isSocial && value.inflow === '') ||
      value.university === '' ||
      value.major === '' ||
      value.grade === null ||
      value.wishJob === '' ||
      value.wishCompany === ''
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [value, isSocial]);

  return (
    <div className="container mx-auto mt-8 p-5">
      <div className="mx-auto mb-16 w-full sm:max-w-md">
        <span className="mb-2 block font-bold">정보입력</span>
        <h1 className="mb-10 pt-4 text-2xl">
          빠르고 편리한 이용을 위해
          <br />
          상세 정보를 입력해주세요
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <div>
            <Input
              label="학교"
              value={value.university}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, university: e.target.value })
              }
            />
          </div>
          <div>
            <GradeDropdown
              value={value.grade}
              setValue={handleGradeChange}
              type="SIGNUP"
            />
          </div>
          <div>
            <Input
              label="전공"
              value={value.major}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, major: e.target.value })
              }
            />
          </div>
          <div>
            <Input
              label="희망직무"
              value={value.wishJob}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setValue({ ...value, wishJob: e.target.value });
              }}
            />
          </div>
          <div>
            <Input
              label="희망기업"
              value={value.wishCompany}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, wishCompany: e.target.value })
              }
            />
          </div>
          {error ? (
            <span className="block text-center text-sm text-red-500">
              {errorMessage ? errorMessage : ''}
            </span>
          ) : null}
          <div className="flex flex-col items-center">
            <Button
              type="submit"
              className="mt-8 w-full"
              {...(buttonDisabled && { disabled: true })}
            >
              회원가입 완료
            </Button>
            <div
              className="mt-4 flex h-[50px] cursor-pointer items-center justify-center text-xs text-neutral-40"
              onClick={() => {
                setSuccessModalOpen(true);
              }}
            >
              다음에 하기
            </div>
          </div>
        </form>
      </div>
      {successModalOpen && (
        <AlertModal
          onConfirm={() => {
            router.push(redirect ? `/login?redirect=${redirect}` : '/login');
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

export default InfoContainer;
