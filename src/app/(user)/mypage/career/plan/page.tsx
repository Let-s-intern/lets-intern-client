'use client';

import {
  DESIRED_INDUSTRY,
  JOB_CONDITIONS,
  JOB_FIELD_ROLES,
} from '@/utils/constants';
import { CheckboxItem } from '@components/common/challenge/my-challenge/talent-pool/WishJobCheckBox';
import { WishJobModal } from '@components/common/challenge/my-challenge/talent-pool/WishJobModal';
import { SelectButton } from '@components/common/ui/button/SelectButton';
import CheckBox from '@components/common/ui/CheckBox';
import LineInput from '@components/common/ui/input/LineInput';
import OutlinedButton from '@components/ui/button/OutlinedButton';
import SolidButton from '@components/ui/button/SolidButton';
import { useEffect, useMemo, useState } from 'react';

interface CareerPlanValues {
  university: string;
  grade: string;
  major: string;
  wishJob: string;
  wishCompany: string;
  wishIndustry: string;
  wishTargetCompany: string;
  jobConditions: string[];
}

interface JobField {
  id: number;
  name: string;
}

interface JobPosition {
  id: number;
  name: string;
  fieldId: number;
}

type ModalStep = 'grade' | 'field' | 'position' | 'industry' | null;

export default function Page() {
  const [user, setUser] = useState<CareerPlanValues>({
    university: '',
    grade: '',
    major: '',
    wishJob: '',
    wishCompany: '',
    wishIndustry: '',
    wishTargetCompany: '',
    jobConditions: [],
  });

  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const jobCategories: JobField[] = useMemo(
    () =>
      JOB_FIELD_ROLES.map((field, index) => ({
        id: index,
        name: field.jobField,
      })),
    [],
  );

  const jobPositions: Record<number, JobPosition[]> = useMemo(
    () =>
      JOB_FIELD_ROLES.reduce(
        (acc, field, index) => {
          acc[index] = field.jobRoles.map((role, roleIndex) => ({
            id: index * 100 + roleIndex,
            name: role,
            fieldId: index,
          }));
          return acc;
        },
        {} as Record<number, JobPosition[]>,
      ),
    [],
  );

  const industries = useMemo(
    () =>
      DESIRED_INDUSTRY.industryList.map((name, index) => ({
        id: index,
        name,
      })),
    [],
  );

  const handleConditionToggle = (value: string) => {
    setUser((prev) => ({
      ...prev,
      jobConditions: prev.jobConditions.includes(value)
        ? prev.jobConditions.filter((v) => v !== value)
        : [...prev.jobConditions, value],
    }));
  };

  useEffect(() => {
    document.body.style.overflow = modalStep !== null ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalStep]);

  const handleCancel = () => {
    console.log('cancel');
    /* TODO : 취소 로직  */
  };

  const handleFieldSelect = (id: number): void => {
    const fieldName = jobCategories[id].name;
    setSelectedField(fieldName);
    setSelectedPositions([]);

    if (fieldName === '직군 무관') {
      setSelectedPositions(['직무 무관']);
      setModalStep(null);
    } else {
      setModalStep('position');
    }
  };

  const toggleSelection = (
    name: string,
    selectedItems: string[],
    setSelectedItems: (items: string[]) => void,
  ) => {
    if (selectedItems.includes(name)) {
      setSelectedItems(selectedItems.filter((item) => item !== name));
    } else if (selectedItems.length < 3) {
      setSelectedItems([...selectedItems, name]);
    }
  };

  const handlePositionSelect = (id: number): void => {
    if (selectedField === null) return;

    const fieldIndex = jobCategories.findIndex(
      (cat) => cat.name === selectedField,
    );
    if (fieldIndex === -1) return;

    const allPositions = jobPositions[fieldIndex] || [];
    const selectedPosition = allPositions.find((pos) => pos.id === id);
    if (!selectedPosition) return;

    const positionName = selectedPosition.name;

    if (selectedPosition?.name.includes('직무 전체')) {
      setSelectedPositions(
        selectedPositions.includes(positionName) ? [] : [positionName],
      );
      return;
    }

    const hasAll = selectedPositions.some((name) => name.includes('직무 전체'));
    if (hasAll) return;

    toggleSelection(positionName, selectedPositions, setSelectedPositions);
  };

  const handleIndustrySelect = (id: number): void => {
    const selectedIndustry = industries.find((ind) => ind.id === id);
    if (!selectedIndustry) return;

    const industryName = selectedIndustry.name;

    if (industryName === '산업 무관') {
      setSelectedIndustries(
        selectedIndustries.includes(industryName) ? [] : [industryName],
      );
      return;
    }

    const hasUnrelated = selectedIndustries.some(
      (name) => name === '산업 무관',
    );
    if (hasUnrelated) return;

    toggleSelection(industryName, selectedIndustries, setSelectedIndustries);
  };

  const openGradeModal = (): void => setModalStep('grade');

  const openFieldModal = (): void => setModalStep('field');

  const openPositionModal = (): void => {
    if (selectedField === null || selectedField === '직군 무관') {
      setModalStep('field');
    } else {
      setModalStep('position');
    }
  };
  const openIndustryModal = (): void => setModalStep('industry');
  const closeModal = (): void => setModalStep(null);
  const backToField = () => {
    setSelectedPositions([]);
    setModalStep('field');
  };

  const getFieldDisplayText = (): string => {
    if (selectedField === null) return '희망 직군을 선택해 주세요.';
    return selectedField;
  };

  const getPositionDisplayText = (): string => {
    if (selectedField === null) return '희망 직무를 선택해 주세요.';
    if (selectedField === '직군 무관') return '직무 무관';
    if (selectedPositions.length === 0) return '희망 직무를 선택해 주세요.';
    return selectedPositions.join(', ');
  };

  const getIndustryDisplayText = (): string => {
    if (selectedIndustries.length === 0) return '희망 산업을 선택해 주세요.';
    return selectedIndustries.join(', ');
  };

  const isSubmitted = false;

  return (
    <div className="flex w-full flex-col">
      {user.university !== '' ? (
        <section className="flex h-[28rem] flex-col items-center justify-center gap-3">
          <div className="flex flex-col text-center text-sm text-neutral-20">
            <p>아직 커리어 방향을 설정하지 않았어요.</p>
            <p>목표를 세우면, 그 길에 한걸음 더 가까워질 수 있어요.</p>
          </div>
          <OutlinedButton size="xs" className="w-fit">
            커리어 계획하기
          </OutlinedButton>
        </section>
      ) : (
        <section>
          <h1 className="mb-6 text-small18">기본 정보</h1>
          <div>
            <div className="mb-10 flex flex-col gap-4">
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="university" className="text-xsmall16">
                  학교
                </label>
                <LineInput
                  id="university"
                  name="university"
                  placeholder="학교 이름을 입력해 주세요."
                  value={user.university}
                />
              </div>
              <SelectButton
                label="학년"
                value={user.grade || '학년을 선택해 주세요.'}
                placeholder="학년을 선택해 주세요."
                onClick={openGradeModal}
                disabled={isSubmitted}
              />
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="major" className="text-xsmall16">
                  전공
                </label>
                <LineInput
                  id="major"
                  name="major"
                  placeholder="전공을 입력해 주세요."
                  value={user.major}
                />
              </div>
            </div>
            <div className="mb-8 flex flex-col gap-4">
              <SelectButton
                label="희망 직군"
                value={getFieldDisplayText()}
                placeholder="희망 직군을 선택해 주세요."
                onClick={openFieldModal}
                disabled={isSubmitted}
              />
              <SelectButton
                label="희망 직무 (최대 3개)"
                value={getPositionDisplayText()}
                placeholder="희망 직무를 선택해 주세요."
                onClick={openPositionModal}
                disabled={isSubmitted}
              />
              <SelectButton
                label="희망 산업 (최대 3개)"
                value={getIndustryDisplayText()}
                placeholder="희망 산업을 선택해 주세요."
                onClick={openIndustryModal}
                disabled={isSubmitted}
              />
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="wishTargetCompany" className="text-xsmall16">
                  희망 기업
                </label>
                <LineInput
                  id="wishTargetCompany"
                  name="wishTargetCompany"
                  placeholder="희망 기업을 입력해주세요."
                  value={user.wishTargetCompany}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xsmall16">희망 구직 조건</span>
              <div className="flex flex-col gap-2">
                {JOB_CONDITIONS.map((option) => {
                  const isSelected = user.jobConditions.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleConditionToggle(option.value)}
                      className="flex w-full items-center gap-1 text-xsmall14"
                    >
                      <CheckBox checked={isSelected} width="w-6" />
                      <span>{option.label}</span>
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
            <SolidButton form="career-form" type="submit" className="flex-1">
              입력 완료
            </SolidButton>
          </div>
        </section>
      )}
      {modalStep === 'grade' && (
        <WishJobModal title="학년" onClose={closeModal}>
          {['1학년', '2학년', '3학년', '4학년', '5학년', '졸업생'].map(
            (grade) => {
              const isSelected = user.grade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => {
                    setUser((prev) => ({ ...prev, grade }));
                    closeModal();
                  }}
                  className={`flex w-full items-center justify-between rounded-xxs px-3 py-1.5 leading-[26px] ${
                    isSelected
                      ? 'text-primary'
                      : 'text-neutral-20 hover:bg-neutral-95'
                  }`}
                >
                  <span className="text-left">{grade}</span>
                  {isSelected && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M16.6667 5L7.50004 14.1667L3.33337 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            },
          )}
        </WishJobModal>
      )}
      {/* 직군 모달 */}
      {modalStep === 'field' && (
        <WishJobModal title="직군" onClose={closeModal}>
          {jobCategories.map((item) => {
            const isSelected = selectedField === item.name;
            return (
              <button
                key={item.id}
                onClick={() => handleFieldSelect(item.id)}
                className={`flex w-full items-center justify-between rounded-xxs px-3 py-1.5 leading-[26px] ${
                  isSelected
                    ? 'text-primary'
                    : 'text-neutral-20 hover:bg-neutral-95'
                }`}
              >
                <span className="text-left">{item.name}</span>
                {isSelected && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M16.6667 5L7.50004 14.1667L3.33337 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </WishJobModal>
      )}
      {/* 직무 선택 모달 */}
      {modalStep === 'position' && selectedField !== null && (
        <WishJobModal
          title="직무 선택 (최대 3개)"
          onClose={closeModal}
          footer={
            <>
              <button
                onClick={backToField}
                className="flex-1 rounded-xxs border border-primary py-3 text-primary"
              >
                이전으로
              </button>
              <button
                onClick={closeModal}
                className={`flex-1 rounded-xxs py-3 text-white ${
                  selectedPositions.length > 0
                    ? 'bg-primary'
                    : 'cursor-not-allowed bg-neutral-70'
                }`}
              >
                선택 완료
              </button>
            </>
          }
        >
          {(() => {
            const fieldIndex = jobCategories.findIndex(
              (cat) => cat.name === selectedField,
            );
            if (fieldIndex === -1) return null;

            return (jobPositions[fieldIndex] || []).map((item) => {
              const isSelected = selectedPositions.includes(item.name);

              // "직무 전체"가 선택되어 있는지 확인
              const hasAll = selectedPositions.some((name) =>
                name.includes('직무 전체'),
              );

              // 현재 항목이 "직무 전체"인지 확인
              const isAllPosition = item.name.includes('직무 전체');

              const isDisabled =
                (!isSelected && selectedPositions.length >= 3) ||
                (!isSelected && !isAllPosition && hasAll);

              return (
                <CheckboxItem
                  key={item.id}
                  label={item.name}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  onChange={() => handlePositionSelect(item.id)}
                />
              );
            });
          })()}
        </WishJobModal>
      )}

      {/* 산업 선택 모달 */}
      {modalStep === 'industry' && (
        <WishJobModal
          title="산업 선택 (최대 3개)"
          onClose={closeModal}
          footer={
            <button
              onClick={closeModal}
              className={`flex-1 rounded-xs py-3 text-white ${
                selectedIndustries.length > 0
                  ? 'bg-primary'
                  : 'cursor-not-allowed bg-neutral-70'
              }`}
            >
              선택 완료
            </button>
          }
        >
          {industries.map((industry) => {
            const isSelected = selectedIndustries.includes(industry.name);
            const isDisabled =
              (!isSelected && selectedIndustries.length >= 3) ||
              (!isSelected &&
                selectedIndustries.some((name) => name === '산업 무관'));

            return (
              <CheckboxItem
                key={industry.id}
                label={industry.name}
                isSelected={isSelected}
                isDisabled={isDisabled}
                onChange={() => handleIndustrySelect(industry.id)}
              />
            );
          })}
        </WishJobModal>
      )}
    </div>
  );
}
