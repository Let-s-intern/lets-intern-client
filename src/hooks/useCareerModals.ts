import { useEffect, useState } from 'react';

type ModalStep = 'grade' | 'field' | 'position' | 'industry' | null;

export const useCareerModals = (
  initialField?: string | null,
  initialPositions?: string[],
  initialIndustries?: string[],
) => {
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [selectedField, setSelectedField] = useState<string | null>(
    initialField || null,
  );
  const [selectedPositions, setSelectedPositions] = useState<string[]>(
    initialPositions || [],
  );
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    initialIndustries || [],
  );

  useEffect(() => {
    document.body.style.overflow = modalStep !== null ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalStep]);

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

  const closeModal = () => setModalStep(null);

  const openFieldModal = () => setModalStep('field');

  const openPositionModal = () => {
    if (!selectedField || selectedField === '직군 무관') {
      setModalStep('field');
    } else {
      setModalStep('position');
    }
  };

  const openIndustryModal = () => setModalStep('industry');

  const handleFieldComplete = (field: string, positions: string[]) => {
    setSelectedField(field);
    setSelectedPositions(positions);
    if (field === '직군 무관') {
      closeModal();
    } else {
      setModalStep('position');
    }
  };

  const handlePositionsComplete = (positions: string[]) => {
    setSelectedPositions(positions);
    closeModal();
  };

  const handleIndustriesComplete = (industries: string[]) => {
    setSelectedIndustries(industries);
    closeModal();
  };

  return {
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
    openFieldModal,
    openPositionModal,
    openIndustryModal,
    handleFieldComplete,
    handlePositionsComplete,
    handleIndustriesComplete,
  };
};
