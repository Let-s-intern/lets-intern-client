'use client';

import { usePatchUser, useUserQuery } from '@/api/user';
import { GRADE_ENUM_TO_KOREAN, JOB_CONDITIONS } from '@/utils/constants';
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
type ModalStep = 'grade' | 'field' | 'position' | 'industry' | null;

const GRADE_KOREAN_TO_ENUM = Object.fromEntries(
  Object.entries(GRADE_ENUM_TO_KOREAN).map(([key, value]) => [value, key]),
);

export default function Page() {
  const { data, isLoading } = useUserQuery();
  const patchUser = usePatchUser();

  const [status, setStatus] = useState<CareerPlanStatus>('EMPTY');
  const [user, setUser] = useState<CareerPlanValues>({
    university: '',
    grade: '',
    major: '',
    wishField: null,
    wishJob: null,
    wishCompany: null,
    wishIndustry: null,
    wishEmploymentType: null,
  });

  const [initialUser, setInitialUser] = useState<CareerPlanValues | null>(null);
  const [initialField, setInitialField] = useState<string | null>(null);
  const [initialPositions, setInitialPositions] = useState<string[]>([]);
  const [initialIndustries, setInitialIndustries] = useState<string[]>([]);

  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

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
    setInitialUser(newUser);

    setSelectedField(data.wishField);
    setInitialField(data.wishField);

    setSelectedPositions(data.wishJob ? [data.wishJob] : []);
    setInitialPositions(data.wishJob ? [data.wishJob] : []);

    setSelectedIndustries(data.wishIndustry ? [data.wishIndustry] : []);
    setInitialIndustries(data.wishIndustry ? [data.wishIndustry] : []);
  }, [data]);

  useEffect(() => {
    document.body.style.overflow = modalStep !== null ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalStep]);

  if (isLoading) return <LoadingContainer />;

  const handleConditionToggle = (value: string) => {
    setUser((prev) => {
      const current = prev.wishEmploymentType ?? '';
      const list = current ? current.split(', ') : [];
      const updated = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      return { ...prev, wishEmploymentType: updated.join(',') };
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
        wishJob: selectedPositions.join(', ') ?? null,
        wishIndustry: selectedIndustries.join(', ') ?? null,
        wishCompany: user.wishCompany,
        wishEmploymentType: user.wishEmploymentType,
      },
      {
        onSuccess: () => {
          setStatus('COMPLETE');
          setInitialUser(user);
          setInitialField(selectedField);
          setInitialPositions(selectedPositions);
          setInitialIndustries(selectedIndustries);
        },
      },
    );
  };
  const handleEdit = () => {
    setInitialUser(user);
    setInitialField(selectedField);
    setInitialPositions([...selectedPositions]);
    setInitialIndustries([...selectedIndustries]);
    setStatus('EDIT');
  };

  const closeModal = () => setModalStep(null);

  const handleCancel = () => {
    if (initialUser) {
      setUser(initialUser);
      setSelectedField(initialField);
      setSelectedPositions(initialPositions);
      setSelectedIndustries(initialIndustries);
    }
    setStatus(initialUser ? 'COMPLETE' : 'EMPTY');
  };

  const getFieldDisplayText = () => {
    if (selectedField === null || selectedField === '') {
      return '희망 직군을 선택해 주세요.';
    }
    return selectedField;
  };
  const getPositionDisplayText = () => {
    if (selectedField === null) return '희망 직무를 선택해 주세요.';
    if (selectedField === '직군 무관') return '직무 무관';
    if (selectedPositions.length === 0) return '희망 직무를 선택해 주세요.';
    return selectedPositions.join(', ');
  };

  const getIndustryDisplayText = () => {
    if (selectedIndustries.length === 0) return '희망 산업을 선택해 주세요.';
    return selectedIndustries.join(', ');
  };

  const hasChanges =
    initialUser &&
    (JSON.stringify(user) !== JSON.stringify(initialUser) ||
      JSON.stringify(selectedField) !== JSON.stringify(initialField) ||
      JSON.stringify(selectedPositions) !== JSON.stringify(initialPositions) ||
      JSON.stringify(selectedIndustries) !== JSON.stringify(initialIndustries));

  if (status === 'EMPTY') {
    return (
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
  }

  if (status === 'COMPLETE') {
    return (
      <CareerPlanForm
        user={user}
        setStatus={setStatus}
        getFieldDisplayText={getFieldDisplayText}
        getPositionDisplayText={getPositionDisplayText}
        getIndustryDisplayText={getIndustryDisplayText}
        handleEdit={handleEdit}
      />
    );
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
            <div className="flex flex-col gap-2">
              {JOB_CONDITIONS.map((option) => {
                const selected = (user.wishEmploymentType ?? '').split(',');
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleConditionToggle(option.value)}
                    className="flex w-full items-center gap-1 text-xsmall14"
                  >
                    <CheckBox
                      checked={selected.includes(option.value)}
                      width="w-6"
                    />
                    <span className="text-xsmall14 md:text-xsmall16">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-12 flex gap-3">
          <OutlinedButton size="md" onClick={handleCancel} className="flex-1">
            취소하기
          </OutlinedButton>
          <SolidButton
            className="flex-1"
            onClick={handleSubmit}
            disabled={!hasChanges}
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
