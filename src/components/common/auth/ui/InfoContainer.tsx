import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../ui/input/Input';
import Button from '../../ui/button/Button';
import AlertModal from '../../../ui/alert/AlertModal';
import axios from '../../../../utils/axios';

const InfoContainer = ({ isSocial }: { isSocial: boolean }) => {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [value, setValue] = useState<{
    inflow: string;
    university: string;
    grade: number | null;
    major: string;
    wishJob: string;
    wishCompany: string;
  }>({
    inflow: '',
    university: '',
    grade: null,
    major: '',
    wishJob: '',
    wishCompany: '',
  });
  const [error, setError] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const convertGradeToEng = (grade: number) => {
    switch (grade) {
      case 0:
        return 'GRADUATE';
      case 1:
        return 'FIRST';
      case 2:
        return 'SECOND';
      case 3:
        return 'THIRD';
      case 4:
        return 'FOURTH';
      case 5:
        return 'ETC';
      default:
        return 'GRADUATE';
    }
  };

  const postUserInfo = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/user/additional-info`, {
        email: email,
        university: value.university,
        major: value.major,
        grade: convertGradeToEng(value.grade as number),
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

  const patchUserInfo = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(
        '/user',
        {
          inflowPath: value.inflow,
          university: value.university,
          grade: convertGradeToEng(value.grade as number),
          major: value.major,
          wishJob: value.wishJob,
          wishCompany: value.wishCompany,
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
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('email');
      setSuccessModalOpen(true);
    },
    onError: (error) => {
      setError(error);
      setErrorMessage('추가 정보 입력에 실패했습니다.');
    },
  });

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (
      (isSocial && !value.inflow) ||
      !value.university ||
      !value.major ||
      !value.grade ||
      !value.wishJob ||
      !value.wishCompany
    ) {
      setError(true);
      setErrorMessage('모든 항목을 입력해주세요.');
      return;
    } else if (value.grade < 1 || value.grade > 4) {
      setError(true);
      setErrorMessage('학년은 1~4 사이의 숫자로 입력해주세요.');
      return;
    }

    if (isSocial) {
      patchUserInfo.mutate();
    } else {
      postUserInfo.mutate();
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
        <form onSubmit={handleOnSubmit} className="flex flex-col space-y-3">
          <div>
            <Input
              label="유입경로"
              value={value.inflow}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, inflow: e.target.value })
              }
            />
          </div>
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
            <Input
              label="학년"
              type="number"
              value={value.grade ? value.grade.toString() : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({
                  ...value,
                  grade: e.target.value ? parseInt(e.target.value) : null,
                })
              }
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
              onChange={(e: any) => {
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

export default InfoContainer;
