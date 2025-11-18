import { DESIRED_INDUSTRY, JOB_FIELD_ROLES } from '@/utils/constants';
import { CheckboxItem } from '@components/common/challenge/my-challenge/talent-pool/WishJobCheckBox';
import { WishJobModal } from '@components/common/challenge/my-challenge/talent-pool/WishJobModal';
import { useEffect, useMemo, useState } from 'react';

type ModalStep = 'grade' | 'field' | 'position' | 'industry' | null;

interface CareerModalsProps {
  modalStep: ModalStep;
  initialField: string | null;
  initialPositions: string[];
  initialIndustries: string[];
  userGrade?: string;
  onGradeComplete: (grade: string) => void;
  onFieldComplete: (field: string | null, positions: string[]) => void;
  onPositionsComplete: (positions: string[]) => void;
  onIndustriesComplete: (industries: string[]) => void;
  onClose: () => void;
}

export default function CareerModals({
  modalStep,
  initialField,
  initialPositions,
  initialIndustries,
  userGrade,
  onGradeComplete,
  onFieldComplete,
  onPositionsComplete,
  onIndustriesComplete,
  onClose,
}: CareerModalsProps) {
  const [selectedField, setSelectedField] = useState<string | null>(
    initialField,
  );
  const [selectedPositions, setSelectedPositions] =
    useState<string[]>(initialPositions);
  const [selectedIndustries, setSelectedIndustries] =
    useState<string[]>(initialIndustries);

  useEffect(() => {
    if (modalStep !== null) {
      setSelectedField(initialField);
      setSelectedPositions(initialPositions);
      setSelectedIndustries(initialIndustries);
    }
  }, [modalStep, initialField, initialPositions, initialIndustries]);

  useEffect(() => {
    document.body.style.overflow = modalStep !== null ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalStep]);

  const jobCategories = useMemo(
    () =>
      JOB_FIELD_ROLES.map((field, index) => ({
        id: index,
        name: field.jobField,
      })),
    [],
  );

  const jobPositions = useMemo(
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
        {} as Record<number, { id: number; name: string; fieldId: number }[]>,
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

  const grades = ['1학년', '2학년', '3학년', '4학년', '5학년', '졸업생'];

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

  const handleFieldSelect = (id: number): void => {
    const fieldName = jobCategories[id].name;
    setSelectedField(fieldName);

    if (fieldName === '직군 무관') {
      onFieldComplete(fieldName, ['직무 무관']);
    } else {
      setSelectedPositions([]);
      onFieldComplete(fieldName, []);
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
      const newPositions = selectedPositions.includes(positionName)
        ? []
        : [positionName];
      setSelectedPositions(newPositions);
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
      const newIndustries = selectedIndustries.includes(industryName)
        ? []
        : [industryName];
      setSelectedIndustries(newIndustries);
      return;
    }

    const hasUnrelated = selectedIndustries.some(
      (name) => name === '산업 무관',
    );
    if (hasUnrelated) return;

    toggleSelection(industryName, selectedIndustries, setSelectedIndustries);
  };

  const handleBackToField = () => {
    setSelectedPositions([]);
    setSelectedField(null);
    onFieldComplete(null, []);
  };

  if (!modalStep) return null;

  // 학년 모달
  if (modalStep === 'grade') {
    return (
      <WishJobModal title="학년" onClose={onClose}>
        {grades.map((grade) => {
          const isSelected = userGrade === grade;
          return (
            <button
              key={grade}
              onClick={() => onGradeComplete(grade)}
              className={`flex w-full items-center justify-between rounded-xxs px-3 py-1.5 leading-[26px] ${
                isSelected
                  ? 'text-primary'
                  : 'text-neutral-20 hover:bg-neutral-95'
              }`}
            >
              <span className="text-left">{grade}</span>
              {isSelected && <CheckIcon />}
            </button>
          );
        })}
      </WishJobModal>
    );
  }

  // 직군 모달
  if (modalStep === 'field') {
    return (
      <WishJobModal title="직군" onClose={onClose}>
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
              {isSelected && <CheckIcon />}
            </button>
          );
        })}
      </WishJobModal>
    );
  }

  // 직무 모달
  if (modalStep === 'position' && selectedField !== null) {
    const fieldIndex = jobCategories.findIndex(
      (cat) => cat.name === selectedField,
    );
    if (fieldIndex === -1) return null;

    const hasAll = selectedPositions.some((name) => name.includes('직무 전체'));

    return (
      <WishJobModal
        title="직무 선택 (최대 3개)"
        onClose={onClose}
        footer={
          <>
            <button
              onClick={handleBackToField}
              className="flex-1 rounded-xxs border border-primary py-3 text-primary"
            >
              이전으로
            </button>
            <button
              onClick={() => onPositionsComplete(selectedPositions)}
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
        {(jobPositions[fieldIndex] || []).map((item) => {
          const isSelected = selectedPositions.includes(item.name);
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
        })}
      </WishJobModal>
    );
  }

  // 산업 모달
  if (modalStep === 'industry') {
    return (
      <WishJobModal
        title="산업 선택 (최대 3개)"
        onClose={onClose}
        footer={
          <button
            onClick={() => onIndustriesComplete(selectedIndustries)}
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
    );
  }

  return null;
}

const CheckIcon = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M16.6667 5L7.50004 14.1667L3.33337 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
