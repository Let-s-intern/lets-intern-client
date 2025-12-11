import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useCallback, useMemo, useState } from 'react';

import SolidButton from '@/common/button/SolidButton';
import CareerInfoForm, {
  CareerInfoSelections,
  CareerInfoValues,
} from '@/domain/mypage/career/CareerInfoForm';
import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';
import { GRADE_KOREAN_TO_ENUM } from '@/utils/constants';
import AlertModal from '../../../common/alert/AlertModal';

const InfoContainer = ({
  isSocial,
  email,
}: {
  isSocial: boolean;
  email: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { logout } = useAuthStore();

  let accessToken = '';
  try {
    accessToken = JSON.parse(String(searchParams.get('result'))).accessToken;
  } catch {
    // empty
  }

  const [value, setValue] = useState<CareerInfoValues>({
    university: '',
    grade: '',
    major: '',
    wishCompany: '',
    wishEmploymentType: '',
  });

  const [selections, setSelections] = useState<CareerInfoSelections>({
    selectedField: null,
    selectedPositions: [],
    selectedIndustries: [],
  });

  const [error, setError] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const patchEmailUserInfo = useMutation({
    mutationFn: async () => {
      // 한글 학년을 enum 값으로 변환
      const enumGrade = value.grade
        ? (GRADE_KOREAN_TO_ENUM[value.grade] ?? null)
        : null;

      const res = await axios.patch(`/user/additional-info`, {
        email,
        university: value.university,
        major: value.major,
        grade: enumGrade,
        wishField: selections.selectedField,
        wishJob:
          selections.selectedPositions.length > 0
            ? selections.selectedPositions.join(', ')
            : null,
        wishIndustry:
          selections.selectedIndustries.length > 0
            ? selections.selectedIndustries.join(', ')
            : null,
        wishCompany: value.wishCompany,
        wishEmploymentType: value.wishEmploymentType,
      });
      return res.data;
    },
    onSuccess: () => {
      setSuccessModalOpen(true);
      localStorage.removeItem('email');
    },
    onError: (err) => {
      setError(err);
      setErrorMessage('추가 정보 입력에 실패했습니다.');
    },
  });

  const patchSocialUserInfo = useMutation({
    mutationFn: async () => {
      // 한글 학년을 enum 값으로 변환
      const enumGrade = value.grade
        ? (GRADE_KOREAN_TO_ENUM[value.grade] ?? value.grade)
        : null;

      const res = await axios({
        method: 'patch',
        url: '/user',
        data: {
          university: value.university,
          grade: enumGrade,
          major: value.major,
          wishField: selections.selectedField,
          wishJob:
            selections.selectedPositions.length > 0
              ? selections.selectedPositions.join(', ')
              : null,
          wishIndustry:
            selections.selectedIndustries.length > 0
              ? selections.selectedIndustries.join(', ')
              : null,
          wishCompany: value.wishCompany,
          wishEmploymentType: value.wishEmploymentType,
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
    onError: (err) => {
      setError(err);
      setErrorMessage('추가 정보 입력에 실패했습니다.');
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSocial) {
      patchSocialUserInfo.mutate();
    } else {
      patchEmailUserInfo.mutate();
    }
  };

  const handleSkip = () => {
    setSuccessModalOpen(true);
  };

  const handleSelectionsChange = useCallback(
    (newSelections: CareerInfoSelections) => {
      setSelections(newSelections);
    },
    [],
  );

  // 하나라도 입력했는지 확인
  const hasAnyInput = useMemo(() => {
    return (
      value.university.trim() !== '' ||
      value.grade.trim() !== '' ||
      value.major.trim() !== '' ||
      value.wishCompany.trim() !== '' ||
      value.wishEmploymentType.trim() !== '' ||
      selections.selectedField !== null ||
      selections.selectedPositions.length > 0 ||
      selections.selectedIndustries.length > 0
    );
  }, [value, selections]);

  return (
    <div className="w-full pt-9 md:mx-auto md:w-[448px] md:py-16">
      <section className="mx-5 mb-[80px] md:mx-0 md:mb-[60px]">
        <div className="mb-9">
          <span className="mb-6 block text-xsmall16 font-normal text-neutral-30">
            정보입력
          </span>
          <h1 className="text-medium22 font-semibold text-neutral-0">
            <span className="block md:inline">
              커리어 정보를 <br className="block md:hidden" />
              입력해 주세요. (선택)
            </span>
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <CareerInfoForm
            value={value}
            onChange={setValue}
            onSelectionsChange={handleSelectionsChange}
          />

          {/* 에러 메시지 */}
          {error ? (
            <p className="mt-4 text-center text-xsmall14 text-system-error">
              {errorMessage}
            </p>
          ) : null}

          {/* 입력 완료 버튼 */}
          <SolidButton
            type="submit"
            className="mt-12 w-full"
            disabled={!hasAnyInput}
          >
            입력 완료
          </SolidButton>
        </form>

        {/* 다음에 하기 */}
        <div className="flex justify-center pb-3 pt-5">
          <button
            type="button"
            className="text-xsmall16 font-normal text-neutral-40"
            onClick={handleSkip}
          >
            다음에 하기
          </button>
        </div>
      </section>

      {/* 회원가입 완료 모달 */}
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
