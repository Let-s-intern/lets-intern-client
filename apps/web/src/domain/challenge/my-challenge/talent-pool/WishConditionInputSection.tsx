import { SelectButton } from '@/common/button/SelectButton';
import { DESIRED_INDUSTRY, JOB_FIELD_ROLES } from '@/utils/constants';
import { useEffect, useMemo, useState } from 'react';
import WishFieldSelectModal from './modal/WishFieldSelectModal';
import WishIndustrySelectModal from './modal/WishIndustrySelectModal';
import WishPositionSelectModal from './modal/WishPositionSelectModal';

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
  selectedField: string | null;
  selectedPositions: string[];
  selectedIndustries: string[];
  isSubmitted: boolean;
  onFieldChange: (field: string | null) => void;
  onPositionsChange: (positions: string[]) => void;
  onIndustriesChange: (industries: string[]) => void;
}

export default function WishConditionInputSection({
  selectedField,
  selectedPositions,
  selectedIndustries,
  isSubmitted,
  onFieldChange,
  onPositionsChange,
  onIndustriesChange,
}: WishConditionInputSectionProps) {
  const [modalStep, setModalStep] = useState<ModalStep>(null);

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

  useEffect(() => {
    document.body.style.overflow = modalStep !== null ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalStep]);

  const handleFieldSelect = (id: number): void => {
    const fieldName = jobCategories[id].name;
    onFieldChange(fieldName);
    onPositionsChange([]);

    // 직군 무관을 선택한 경우
    if (fieldName === '직군 무관') {
      onPositionsChange(['직무 무관']);
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

    // "직무 전체" 선택
    if (selectedPosition?.name.includes('직무 전체')) {
      onPositionsChange(
        selectedPositions.includes(positionName) ? [] : [positionName],
      );
      return;
    }

    // "직무 전체"가 선택되어 있으면 다른 직무 선택 불가
    const hasAll = selectedPositions.some((name) => name.includes('직무 전체'));

    if (hasAll) return;

    toggleSelection(positionName, selectedPositions, onPositionsChange);
  };

  const handleIndustrySelect = (id: number): void => {
    const selectedIndustry = industries.find((ind) => ind.id === id);
    if (!selectedIndustry) return;

    const industryName = selectedIndustry.name;

    // "산업 무관" 선택
    if (industryName === '산업 무관') {
      onIndustriesChange(
        selectedIndustries.includes(industryName) ? [] : [industryName],
      );
      return;
    }
    // 산업 무관이 이미 선택되어 있으면 다른 산업 선택 불가
    const hasUnrelated = selectedIndustries.some(
      (name) => name === '산업 무관',
    );

    if (hasUnrelated) return;

    toggleSelection(industryName, selectedIndustries, onIndustriesChange);
  };
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
    onPositionsChange([]);
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

  return (
    <div className="mb-9">
      <div className="flex flex-col gap-5">
        <SelectButton
          label="희망 직군"
          value={getFieldDisplayText()}
          placeholder="희망 직군을 선택해 주세요."
          onClick={openFieldModal}
          isRequired={true}
          disabled={isSubmitted}
        />

        <SelectButton
          label="희망 직무 (최대 3개)"
          value={getPositionDisplayText()}
          placeholder="희망 직무를 선택해 주세요."
          onClick={openPositionModal}
          isRequired={true}
          disabled={isSubmitted}
        />

        <SelectButton
          label="희망 산업 (최대 3개)"
          value={getIndustryDisplayText()}
          placeholder="희망 산업을 선택해 주세요."
          onClick={openIndustryModal}
          isRequired={true}
          disabled={isSubmitted}
        />
      </div>

      {modalStep === 'field' && (
        <WishFieldSelectModal
          jobCategories={jobCategories}
          selectedField={selectedField}
          onFieldSelect={handleFieldSelect}
          onClose={closeModal}
        />
      )}

      {modalStep === 'position' && selectedField !== null && (
        <WishPositionSelectModal
          selectedField={selectedField}
          selectedPositions={selectedPositions}
          jobCategories={jobCategories}
          jobPositions={jobPositions}
          onPositionSelect={handlePositionSelect}
          onBackToField={backToField}
          onClose={closeModal}
        />
      )}

      {modalStep === 'industry' && (
        <WishIndustrySelectModal
          industries={industries}
          selectedIndustries={selectedIndustries}
          onIndustrySelect={handleIndustrySelect}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
