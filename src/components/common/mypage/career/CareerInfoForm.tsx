import { useCareerModals } from '@/hooks/useCareerModals';
import { JOB_CONDITIONS } from '@/utils/constants';
import { SelectButton } from '@components/common/ui/button/SelectButton';
import CheckBox from '@components/common/ui/CheckBox';
import LineInput from '@components/common/ui/input/LineInput';
import { useEffect } from 'react';
import CareerModals from './CareerModal';

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
        <CheckBox
          checked={selected.includes(option.value)}
          width="w-6"
          showCheckIcon
        />
        <span className="text-xsmall14 md:text-xsmall16">{option.label}</span>
      </button>
    ))}
  </div>
);

export interface CareerInfoValues {
  university: string;
  grade: string;
  major: string;
  wishCompany: string;
  wishEmploymentType: string;
}

export interface CareerInfoSelections {
  selectedField: string | null;
  selectedPositions: string[];
  selectedIndustries: string[];
}

/** useCareerModals 훅의 반환 타입 */
export type CareerModalControls = ReturnType<typeof useCareerModals>;

interface CareerInfoFormProps {
  /** 폼 기본값 */
  value: CareerInfoValues;
  /** 폼 값 변경 핸들러 */
  onChange: (value: CareerInfoValues) => void;
  /** 초기 선택 값 (직군, 직무, 산업) - externalModalControls가 없을 때만 사용 */
  initialSelections?: {
    field?: string | null;
    positions?: string[];
    industries?: string[];
  };
  /** 선택 값 변경 시 콜백 - externalModalControls가 없을 때만 사용 */
  onSelectionsChange?: (selections: CareerInfoSelections) => void;
  /** 외부 모달 컨트롤 - 제공 시 컴포넌트가 외부 상태 사용 */
  externalModalControls?: CareerModalControls;
  /** 섹션 타이틀 표시 여부 */
  showSectionTitle?: boolean;
  /** 섹션 타이틀 텍스트 */
  sectionTitle?: string;
}

/**
 * 커리어 정보 입력 공통 폼 컴포넌트
 * - 회원가입 추가정보 입력
 * - 챌린지 대시보드 진입 시 정보 입력
 * - 마이페이지 커리어 계획
 *
 * 두 가지 모드 지원:
 * 1. 내부 모드 (기본): 자체 useCareerModals 사용, initialSelections와 onSelectionsChange 활용
 * 2. 외부 모드: externalModalControls 전달 시 부모의 모달 상태 사용
 */
const CareerInfoForm = ({
  value,
  onChange,
  initialSelections,
  onSelectionsChange,
  externalModalControls,
  showSectionTitle = true,
  sectionTitle = '기본 정보',
}: CareerInfoFormProps) => {
  // 내부 모달 컨트롤 (외부 컨트롤이 없을 때만 사용)
  const internalModalControls = useCareerModals();

  // 외부 컨트롤이 있으면 사용, 없으면 내부 컨트롤 사용
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
  } = externalModalControls ?? internalModalControls;

  // 초기 선택 값 설정 (내부 모드일 때만)
  useEffect(() => {
    if (externalModalControls) return; // 외부 컨트롤 사용 시 스킵

    if (initialSelections?.field !== undefined) {
      setSelectedField(initialSelections.field);
    }
    if (initialSelections?.positions) {
      setSelectedPositions(initialSelections.positions);
    }
    if (initialSelections?.industries) {
      setSelectedIndustries(initialSelections.industries);
    }
  }, [
    externalModalControls,
    initialSelections?.field,
    initialSelections?.positions,
    initialSelections?.industries,
    setSelectedField,
    setSelectedPositions,
    setSelectedIndustries,
  ]);

  // 선택 값 변경 시 부모 컴포넌트에 알림 (내부 모드일 때만)
  useEffect(() => {
    if (externalModalControls) return; // 외부 컨트롤 사용 시 스킵

    onSelectionsChange?.({
      selectedField,
      selectedPositions,
      selectedIndustries,
    });
  }, [
    externalModalControls,
    selectedField,
    selectedPositions,
    selectedIndustries,
    onSelectionsChange,
  ]);

  const handleConditionToggle = (conditionValue: string) => {
    const current = value.wishEmploymentType ?? '';
    const list = current
      ? current
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
      : [];
    const updated = list.includes(conditionValue)
      ? list.filter((v) => v !== conditionValue)
      : [...list, conditionValue];

    onChange({
      ...value,
      wishEmploymentType: updated.length > 0 ? updated.join(', ') : '',
    });
  };

  return (
    <>
      {/* 기본 정보 섹션 */}
      {showSectionTitle && (
        <h1 className="mb-6 text-xsmall16 font-semibold text-neutral-0 md:text-small18">
          {sectionTitle}
        </h1>
      )}

      <div className="mb-10 flex flex-col gap-4">
        {/* 학교 */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-xsmall14 md:text-xsmall16">학교</label>
          <LineInput
            className="text-xsmall14 md:text-xsmall16"
            placeholder="학교 이름을 입력해 주세요."
            value={value.university}
            onChange={(e) => onChange({ ...value, university: e.target.value })}
          />
        </div>

        {/* 학년 */}
        <SelectButton
          className="text-xsmall14 md:text-xsmall16"
          label="학년"
          value={value.grade || '학년을 선택해 주세요.'}
          placeholder="학년을 선택해 주세요."
          onClick={() => setModalStep('grade')}
        />

        {/* 전공 */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-xsmall14 md:text-xsmall16">전공</label>
          <LineInput
            className="text-xsmall14 md:text-xsmall16"
            placeholder="전공을 입력해 주세요."
            value={value.major}
            onChange={(e) => onChange({ ...value, major: e.target.value })}
          />
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4">
        {/* 희망 직군 */}
        <SelectButton
          className="text-xsmall14 md:text-xsmall16"
          label="희망 직군"
          value={getFieldDisplayText()}
          placeholder="희망 직군을 선택해 주세요."
          onClick={() => setModalStep('field')}
        />

        {/* 희망 직무 */}
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

        {/* 희망 산업 */}
        <SelectButton
          className="text-xsmall14 md:text-xsmall16"
          label="희망 산업 (최대 3개)"
          value={getIndustryDisplayText()}
          placeholder="희망 산업을 선택해 주세요."
          onClick={() => setModalStep('industry')}
        />

        {/* 희망 기업 */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-xsmall14 md:text-xsmall16">희망 기업</label>
          <LineInput
            className="text-xsmall14 md:text-xsmall16"
            placeholder="기업 이름을 입력해 주세요."
            value={value.wishCompany}
            onChange={(e) =>
              onChange({ ...value, wishCompany: e.target.value })
            }
          />
        </div>
      </div>

      {/* 희망 구직 조건 */}
      <div className="flex flex-col gap-3">
        <span className="text-xsmall14 md:text-xsmall16">희망 구직 조건</span>
        <ConditionList
          selected={(value.wishEmploymentType ?? '')
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean)}
          onToggle={handleConditionToggle}
        />
      </div>

      {/* 모달 */}
      <CareerModals
        setModalStep={setModalStep}
        modalStep={modalStep}
        initialField={selectedField}
        initialPositions={selectedPositions}
        initialIndustries={selectedIndustries}
        userGrade={value.grade ?? ''}
        onGradeComplete={(grade) => {
          onChange({ ...value, grade });
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
    </>
  );
};

export default CareerInfoForm;
