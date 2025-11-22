'use client';

import { usePatchUser, useUserQuery } from '@/api/user';
import { useCareerModals } from '@/hooks/useCareerModals';
import { useChangeDetection } from '@/hooks/useChangeDetectionHook';
import {
  GRADE_ENUM_TO_KOREAN,
  GRADE_KOREAN_TO_ENUM,
  JOB_CONDITIONS,
} from '@/utils/constants';
import CareerModals from '@components/common/mypage/career/CareerModal';
import CareerPlanForm from '@components/common/mypage/career/CareerPlanForm';
import { SelectButton } from '@components/common/ui/button/SelectButton';
import CheckBox from '@components/common/ui/CheckBox';
import LineInput from '@components/common/ui/input/LineInput';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import OutlinedButton from '@components/ui/button/OutlinedButton';
import SolidButton from '@components/ui/button/SolidButton';
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

const ConditionList = ({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (value: string) => void;
}) => (
  <div className="flex flex-col gap-2">
    {JOB_CONDITIONS.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onToggle(option.value)}
        className="flex w-full items-center gap-1 text-xsmall14"
      >
        <CheckBox checked={selected.includes(option.value)} width="w-6" />
        <span className="text-xsmall14 md:text-xsmall16">{option.label}</span>
      </button>
    ))}
  </div>
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

  const {
    modalStep,
    setModalStep,
    selectedField,
    setSelectedField,
    selectedPositions,
    setSelectedPositions,
    selectedIndustries,
    setSelectedIndustries,
    getFieldDisplayText,
    getPositionDisplayText,
    getIndustryDisplayText,
    closeModal,
  } = useCareerModals();

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

  const handleConditionToggle = (value: string) => {
    setUser((prev) => {
      const current = prev.wishEmploymentType ?? '';
      const list = current
        ? current
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean)
        : [];
      const updated = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      return {
        ...prev,
        wishEmploymentType: updated.length > 0 ? updated.join(', ') : '',
      };
    });
  };

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

    if (changeDetection.initialUser) {
      setUser(changeDetection.initialUser);
    }
    setSelectedField(changeDetection.initialField);
    setSelectedPositions(changeDetection.initialPositions);
    setSelectedIndustries(changeDetection.initialIndustries);
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
        <h1 className="mb-6 text-xsmall16 md:text-small18">기본 정보</h1>
        <div>
          <div className="mb-10 flex flex-col gap-4">
            <div className="flex flex-col gap-[6px]">
              <label className="text-xsmall14 md:text-xsmall16">학교</label>
              <LineInput
                className="text-xsmall14 md:text-xsmall16"
                placeholder="학교 이름을 입력해 주세요."
                value={user.university ?? ''}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, university: e.target.value }))
                }
              />
            </div>
            <SelectButton
              label="학년"
              className="text-xsmall14 md:text-xsmall16"
              value={user.grade || '학년을 선택해 주세요.'}
              placeholder="학년을 선택해 주세요."
              onClick={() => setModalStep('grade')}
            />
            <div className="flex flex-col gap-[6px]">
              <label className="text-xsmall14 md:text-xsmall16">전공</label>
              <LineInput
                className="text-xsmall14 md:text-xsmall16"
                placeholder="전공을 입력해 주세요."
                value={user.major ?? ''}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, major: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="mb-8 flex flex-col gap-4">
            <SelectButton
              className="text-xsmall14 md:text-xsmall16"
              label="희망 직군"
              value={getFieldDisplayText()}
              placeholder="희망 직군을 선택해 주세요."
              onClick={() => setModalStep('field')}
            />
            <SelectButton
              className="text-xsmall14 md:text-xsmall16"
              label="희망 직무 (최대 3개)"
              value={getPositionDisplayText()}
              placeholder="희망 직무를 선택해 주세요."
              onClick={() => {
                if (!selectedField || selectedField === '직군 무관') {
                  setModalStep('field');
                } else {
                  setModalStep('position');
                }
              }}
            />
            <SelectButton
              className="text-xsmall14 md:text-xsmall16"
              label="희망 산업 (최대 3개)"
              value={getIndustryDisplayText()}
              placeholder="희망 산업을 선택해 주세요."
              onClick={() => setModalStep('industry')}
            />
            <div className="flex flex-col gap-[6px]">
              <label className="text-xsmall14 md:text-xsmall16">
                희망 기업
              </label>
              <LineInput
                id="wishTargetCompany"
                name="wishTargetCompany"
                className="text-xsmall14 md:text-xsmall16"
                placeholder="희망 기업을 입력해 주세요."
                value={user.wishCompany || ''}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    wishCompany: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xsmall14 md:text-xsmall16">
              희망 구직 조건
            </span>
            <ConditionList
              selected={(user.wishEmploymentType ?? '')
                .split(',')
                .map((v) => v.trim())
                .filter(Boolean)}
              onToggle={handleConditionToggle}
            />
          </div>
        </div>
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
      <CareerModals
        setModalStep={setModalStep}
        modalStep={modalStep}
        initialField={selectedField}
        initialPositions={selectedPositions}
        initialIndustries={selectedIndustries}
        userGrade={user.grade ?? ''}
        onGradeComplete={(grade) => {
          setUser((prev) => ({ ...prev, grade }));
          closeModal();
        }}
        onFieldComplete={(field, positions) => {
          setSelectedField(field);
          setSelectedPositions(positions);
          if (field === '직군 무관') {
            closeModal();
          } else {
            setModalStep('position');
          }
        }}
        onPositionsComplete={(positions) => {
          setSelectedPositions(positions);
          closeModal();
        }}
        onIndustriesComplete={(industries) => {
          setSelectedIndustries(industries);
          closeModal();
        }}
        onClose={closeModal}
      />
    </div>
  );
}
