'use client';

import { JOB_CONDITIONS } from '@/utils/constants';
import CareerModals from '@components/common/mypage/career/CareerModal';
import { SelectButton } from '@components/common/ui/button/SelectButton';
import CheckBox from '@components/common/ui/CheckBox';
import LineInput from '@components/common/ui/input/LineInput';
import OutlinedButton from '@components/ui/button/OutlinedButton';
import SolidButton from '@components/ui/button/SolidButton';
import { useEffect, useState } from 'react';

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

  const [isEditing, setIsEditing] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const handleCreateNew = () => setIsEditing(true);
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
      {!isEditing ? (
        <section className="flex h-[28rem] flex-col items-center justify-center gap-3">
          <div className="flex flex-col text-center text-sm text-neutral-20">
            <p>아직 커리어 방향을 설정하지 않았어요.</p>
            <p>목표를 세우면, 그 길에 한걸음 더 가까워질 수 있어요.</p>
          </div>
          <OutlinedButton size="xs" onClick={handleCreateNew} className="w-fit">
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
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, university: e.target.value }))
                  }
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
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, major: e.target.value }))
                  }
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
                  onChange={(e) =>
                    setUser((prev) => ({
                      ...prev,
                      wishTargetCompany: e.target.value,
                    }))
                  }
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
      <CareerModals
        modalStep={modalStep}
        initialField={selectedField}
        initialPositions={selectedPositions}
        initialIndustries={selectedIndustries}
        userGrade={user.grade}
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
