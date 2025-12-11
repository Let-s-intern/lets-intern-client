'use client';

import { usePatchUser, useUserQuery } from '@/api/user';
import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';
import LoadingContainer from '@/common/ui/loading/LoadingContainer';
import CareerInfoForm, {
  CareerInfoValues,
} from '@/domain/mypage/career/CareerInfoForm';
import CareerPlanForm from '@/domain/mypage/career/CareerPlanForm';
import { useCareerModals } from '@/hooks/useCareerModals';
import { useChangeDetection } from '@/hooks/useChangeDetectionHook';
import { GRADE_ENUM_TO_KOREAN, GRADE_KOREAN_TO_ENUM } from '@/utils/constants';
import { useEffect, useState } from 'react';

interface CareerPlanValues {
  university: string | null;
  grade: string | null;
  major: string | null;
  wishField: string | null;
  wishJob: string | null;
  wishCompany: string | null;
  wishIndustry: string | null;
  wishEmploymentType: string | null;
}

type CareerPlanStatus = 'EMPTY' | 'EDIT' | 'COMPLETE';

const CareerPlanEmptySection = ({ handleEdit }: { handleEdit: () => void }) => (
  <section className="flex h-[28rem] flex-col items-center justify-center gap-3">
    <div className="flex flex-col text-center text-sm text-neutral-20">
      <p>아직 커리어 방향을 설정하지 않았어요.</p>
      <p>목표를 세우면, 그 길에 한걸음 더 가까워질 수 있어요.</p>
    </div>
    <OutlinedButton size="xs" onClick={handleEdit} className="w-fit">
      커리어 계획하기
    </OutlinedButton>
  </section>
);

export default function Page() {
  const { data, isLoading } = useUserQuery();
  const patchUser = usePatchUser();

  const [status, setStatus] = useState<CareerPlanStatus>('EMPTY');
  const [user, setUser] = useState<CareerPlanValues>({
    university: null,
    grade: null,
    major: null,
    wishField: null,
    wishJob: null,
    wishCompany: null,
    wishIndustry: null,
    wishEmploymentType: null,
  });

  // 외부 모달 컨트롤 - CareerInfoForm에 전달
  const modalControls = useCareerModals();
  const {
    selectedField,
    setSelectedField,
    selectedPositions,
    setSelectedPositions,
    selectedIndustries,
    setSelectedIndustries,
  } = modalControls;

  const changeDetection = useChangeDetection({
    user,
    selectedField,
    selectedPositions,
    selectedIndustries,
  });

  useEffect(() => {
    if (!data) return;

    const isCareerFilled =
      data.university ||
      data.grade ||
      data.major ||
      data.wishField ||
      data.wishJob ||
      data.wishIndustry ||
      data.wishCompany ||
      data.wishEmploymentType;

    if (isCareerFilled) setStatus('COMPLETE');

    const koreanGrade = data.grade
      ? GRADE_ENUM_TO_KOREAN[data.grade as keyof typeof GRADE_ENUM_TO_KOREAN] ||
        data.grade
      : '';

    const newUser: CareerPlanValues = {
      university: data.university ?? '',
      grade: koreanGrade ?? '',
      major: data.major ?? '',
      wishField: data.wishField,
      wishJob: data.wishJob,
      wishIndustry: data.wishIndustry,
      wishCompany: data.wishCompany,
      wishEmploymentType: data.wishEmploymentType ?? '',
    };

    setUser(newUser);
    changeDetection.setInitialValues(
      newUser,
      data.wishField,
      data.wishJob ? [data.wishJob] : [],
      data.wishIndustry ? [data.wishIndustry] : [],
    );

    setSelectedField(data.wishField);
    setSelectedPositions(
      data.wishJob ? data.wishJob.split(',').map((s) => s.trim()) : [],
    );
    setSelectedIndustries(
      data.wishIndustry
        ? data.wishIndustry.split(',').map((s) => s.trim())
        : [],
    );
  }, [data]);

  if (isLoading) return <LoadingContainer />;

  const handleSubmit = () => {
    const enumGrade = user.grade
      ? GRADE_KOREAN_TO_ENUM[user.grade] || user.grade
      : null;

    patchUser.mutate(
      {
        university: user.university,
        grade: enumGrade,
        major: user.major,
        wishField: selectedField,
        wishJob:
          selectedPositions.length > 0 ? selectedPositions.join(', ') : null,
        wishIndustry:
          selectedIndustries.length > 0 ? selectedIndustries.join(', ') : null,
        wishCompany: user.wishCompany,
        wishEmploymentType: user.wishEmploymentType,
      },
      {
        onSuccess: () => {
          const isAllEmpty =
            !user.university &&
            !user.grade &&
            !user.major &&
            !selectedField &&
            selectedPositions.length === 0 &&
            selectedIndustries.length === 0 &&
            !user.wishCompany &&
            !user.wishEmploymentType;

          if (isAllEmpty) {
            setStatus('EMPTY');
          } else {
            setStatus('COMPLETE');
            changeDetection.setInitialValues(
              user,
              selectedField,
              selectedPositions,
              selectedIndustries,
            );
          }
        },
      },
    );
  };

  const handleEdit = () => {
    changeDetection.setInitialValues(
      user,
      selectedField,
      [...selectedPositions],
      [...selectedIndustries],
    );
    setStatus('EDIT');
  };

  const isEmptyData =
    !data?.university &&
    !data?.grade &&
    !data?.major &&
    !data?.wishField &&
    !data?.wishJob &&
    !data?.wishIndustry &&
    !data?.wishCompany &&
    !data?.wishEmploymentType;

  const handleCancel = () => {
    if (isEmptyData) {
      setStatus('EMPTY');
    } else {
      setStatus('COMPLETE');
    }

    // 기존 값으로 복원
    if (changeDetection.initialUser) {
      setUser(changeDetection.initialUser);
    }
    setSelectedField(changeDetection.initialField);
    setSelectedPositions(changeDetection.initialPositions);
    setSelectedIndustries(changeDetection.initialIndustries);
  };

  // CareerInfoForm에 전달할 값 변환
  const formValue: CareerInfoValues = {
    university: user.university ?? '',
    grade: user.grade ?? '',
    major: user.major ?? '',
    wishCompany: user.wishCompany ?? '',
    wishEmploymentType: user.wishEmploymentType ?? '',
  };

  const handleFormChange = (newValue: CareerInfoValues) => {
    setUser((prev) => ({
      ...prev,
      university: newValue.university,
      grade: newValue.grade,
      major: newValue.major,
      wishCompany: newValue.wishCompany,
      wishEmploymentType: newValue.wishEmploymentType,
    }));
  };

  if (status === 'EMPTY') {
    return <CareerPlanEmptySection handleEdit={handleEdit} />;
  }

  if (status === 'COMPLETE') {
    return <CareerPlanForm user={user} handleEdit={handleEdit} />;
  }

  return (
    <div className="flex w-full flex-col">
      <section>
        <CareerInfoForm
          value={formValue}
          onChange={handleFormChange}
          externalModalControls={modalControls}
          showSectionTitle={true}
          sectionTitle="기본 정보"
        />
        <div className="mt-12 flex gap-3">
          <OutlinedButton size="md" onClick={handleCancel} className="flex-1">
            취소하기
          </OutlinedButton>
          <SolidButton
            className="flex-1"
            onClick={handleSubmit}
            disabled={!changeDetection.hasChanges}
          >
            입력 완료
          </SolidButton>
        </div>
      </section>
    </div>
  );
}
