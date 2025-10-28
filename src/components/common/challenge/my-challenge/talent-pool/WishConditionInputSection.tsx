import { DESIRED_INDUSTRY, JOB_FIELD_ROLES } from '@/utils/constants';
import { SelectButton } from '@components/common/ui/button/SelectButton';
import { useEffect, useState } from 'react';
import { CheckboxItem } from './WishJobCheckBox';
import { WishJobModal } from './WishJobModal';

interface JobField {
  id: number;
  name: string;
}

interface JobPosition {
  id: number;
  name: string;
  fieldId: number;
}

type ModalStep = 'field' | 'position' | 'industry' | null;

interface WishConditionInputSectionProps {
  selectedField: number | null;
  selectedPositions: number[];
  selectedIndustries: number[];
  onFieldChange: (field: number | null) => void;
  onPositionsChange: (positions: number[]) => void;
  onIndustriesChange: (industries: number[]) => void;
}

export default function WishConditionInputSection({
  selectedField,
  selectedPositions,
  selectedIndustries,
  onFieldChange,
  onPositionsChange,
  onIndustriesChange,
}: WishConditionInputSectionProps) {
  const [modalStep, setModalStep] = useState<ModalStep>(null);

  const jobCategories: JobField[] = JOB_FIELD_ROLES.map((field, index) => ({
    id: index,
    name: field.jobField,
  }));

  const jobPositions: Record<number, JobPosition[]> = JOB_FIELD_ROLES.reduce(
    (acc, field, index) => {
      acc[index] = field.jobRoles.map((role, roleIndex) => ({
        id: index * 100 + roleIndex,
        name: role,
        fieldId: index,
      }));
      return acc;
    },
    {} as Record<number, JobPosition[]>,
  );

  const industries = DESIRED_INDUSTRY.industryList.map((name, index) => ({
    id: index,
    name,
  }));

  useEffect(() => {
    document.body.style.overflow = modalStep !== null ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalStep]);

  const handleFieldSelect = (id: number): void => {
    onFieldChange(id);
    onPositionsChange([]);

    // 직군 무관을 선택한 경우
    if (jobCategories[id].name === '직군 무관') {
      onPositionsChange([]);
      setModalStep(null);
    } else {
      setModalStep('position');
    }
  };

  const toggleSelection = (
    id: number,
    selectedItems: number[],
    setSelectedItems: (items: number[]) => void,
  ) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else if (selectedItems.length < 3) {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handlePositionSelect = (id: number): void => {
    const allPositions = jobPositions[selectedField!] || [];
    const selectedPosition = allPositions.find((pos) => pos.id === id);

    // "직무 전체" 선택
    if (selectedPosition?.name.includes('직무 전체')) {
      onPositionsChange(selectedPositions.includes(id) ? [] : [id]);
      return;
    }

    // "직무 전체"가 선택되어 있으면 다른 직무 선택 불가
    const hasAll = selectedPositions.some((posId) => {
      const pos = allPositions.find((p) => p.id === posId);
      return pos?.name.includes('직무 전체');
    });

    if (hasAll) return;

    toggleSelection(id, selectedPositions, onPositionsChange);
  };

  const handleIndustrySelect = (id: number): void => {
    const selectedIndustry = industries.find((ind) => ind.id === id);

    // "산업 무관" 선택
    if (selectedIndustry?.name === '산업 무관') {
      onIndustriesChange(selectedIndustries.includes(id) ? [] : [id]);
      return;
    }
    // 산업 무관이 이미 선택되어 있으면 다른 산업 선택 불가
    const hasUnrelated = selectedIndustries.some((industryId) => {
      const industry = industries.find((ind) => ind.id === industryId);
      return industry?.name === '산업 무관';
    });

    if (hasUnrelated) return;

    toggleSelection(id, selectedIndustries, onIndustriesChange);
  };
  const openFieldModal = (): void => setModalStep('field');

  const openPositionModal = (): void => {
    if (
      selectedField === null ||
      jobCategories[selectedField].name === '직군 무관'
    ) {
      setModalStep('field');
    } else {
      setModalStep('position');
    }
  };

  const openIndustryModal = (): void => setModalStep('industry');
  const closeModal = (): void => setModalStep(null);
  const backToField = (): void => setModalStep('field');

  const getFieldDisplayText = (): string => {
    if (selectedField === null) return '희망 직군을 선택해 주세요.';
    return jobCategories[selectedField]?.name || '';
  };

  const getPositionDisplayText = (): string => {
    if (selectedField === null) return '희망 직무를 선택해 주세요.';

    const field = jobCategories[selectedField];
    if (field.name === '직군 무관') return '직무 무관';
    if (selectedPositions.length === 0) return '희망 직무를 선택해 주세요.';

    const allPositions = Object.values(jobPositions).flat();
    return allPositions
      .filter((pos) => selectedPositions.includes(pos.id))
      .map((pos) => pos.name)
      .join(', ');
  };

  const getIndustryDisplayText = (): string => {
    if (selectedIndustries.length === 0) return '희망 산업을 선택해 주세요.';
    return industries
      .filter((ind) => selectedIndustries.includes(ind.id))
      .map((ind) => ind.name)
      .join(', ');
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <SelectButton
          label="희망 직군"
          value={getFieldDisplayText()}
          placeholder="희망 직군을 선택해 주세요."
          onClick={openFieldModal}
        />

        <SelectButton
          label="희망 직무 (최대 3개)"
          value={getPositionDisplayText()}
          placeholder="희망 직무를 선택해 주세요."
          onClick={openPositionModal}
        />

        <SelectButton
          label="희망 산업 (최대 3개)"
          value={getIndustryDisplayText()}
          placeholder="희망 산업을 선택해 주세요."
          onClick={openIndustryModal}
        />
      </div>

      {/* 직군 모달 */}
      {modalStep === 'field' && (
        <WishJobModal title="직군" onClose={closeModal}>
          {jobCategories.map((item) => {
            const isSelected = selectedField === item.id;
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
      {modalStep === 'position' && (
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
          {(jobPositions[selectedField!] || []).map((item) => {
            const isSelected = selectedPositions.includes(item.id);
            const allPositions = jobPositions[selectedField!] || [];

            // "직무 전체"가 선택되어 있는지 확인
            const hasAll = selectedPositions.some((posId) => {
              const pos = allPositions.find((p) => p.id === posId);
              return pos?.name.includes('직무 전체');
            });

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
          })}
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
            const isSelected = selectedIndustries.includes(industry.id);
            const isDisabled =
              (!isSelected && selectedIndustries.length >= 3) ||
              (!isSelected &&
                selectedIndustries.some((id) => {
                  const ind = industries.find((industry) => industry.id === id);
                  return ind?.name === '산업 무관';
                }));

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
