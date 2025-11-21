'use client';

import { usePatchUser, useUserQuery } from '@/api/user';
import { JOB_CONDITIONS } from '@/utils/constants';
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

    setUser({
      university: data.university ?? '',
      grade: data.grade ?? '',
      major: data.major ?? '',
      wishField: data.wishField,
      wishJob: data.wishJob,
      wishIndustry: data.wishIndustry,
      wishCompany: data.wishCompany,
      wishEmploymentType: data.wishEmploymentType ?? '',
    });

    setSelectedField(data.wishField);
    setSelectedPositions(data.wishJob ? [data.wishJob] : []);
    setSelectedIndustries(data.wishIndustry ? [data.wishIndustry] : []);
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

      const list = current ? current.split(',') : [];

      const updated = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];

      return { ...prev, wishEmploymentType: updated.join(',') };
    });
  };

  const handleSubmit = () => {
    patchUser.mutate(
      {
        university: user.university,
        grade: user.grade,
        major: user.major,
        wishField: selectedField,
        wishJob: selectedPositions[0] ?? null,
        wishIndustry: selectedIndustries[0] ?? null,
        wishCompany: user.wishCompany,
        wishEmploymentType: user.wishEmploymentType,
      },
      {
        onSuccess: () => {
          setStatus('COMPLETE');
        },
      },
    );
  };
  const handleEdit = () => setStatus('EDIT');

  const closeModal = () => setModalStep(null);
  const getFieldDisplayText = () => selectedField ?? '-';

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
        <h1 className="mb-6 text-small18">기본 정보</h1>
        <div>
          <div className="mb-10 flex flex-col gap-4">
            <div className="flex flex-col gap-[6px]">
              <label htmlFor="university" className="text-xsmall16">
                학교
              </label>
              <LineInput
                placeholder="학교 이름을 입력해 주세요."
                value={user.university ?? ''}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, university: e.target.value }))
                }
              />
            </div>
            <SelectButton
              label="학년"
              value={user.grade || '학년을 선택해 주세요.'}
              placeholder="학년을 선택해 주세요."
              onClick={() => setModalStep('grade')}
            />
            <div className="flex flex-col gap-[6px]">
              <label htmlFor="major" className="text-xsmall16">
                전공
              </label>
              <LineInput
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
              label="희망 직군"
              value={getFieldDisplayText()}
              placeholder="희망 직군을 선택해 주세요."
              onClick={() => setModalStep('field')}
            />
            <SelectButton
              label="희망 직무 (최대 3개)"
              value={getPositionDisplayText()}
              placeholder="희망 직무를 선택해 주세요."
              onClick={() =>
                selectedField ? setModalStep('position') : setModalStep('field')
              }
            />
            <SelectButton
              label="희망 산업 (최대 3개)"
              value={getIndustryDisplayText()}
              placeholder="희망 산업을 선택해 주세요."
              onClick={() => setModalStep('industry')}
            />
            <div className="flex flex-col gap-[6px]">
              <label className="text-xsmall16">희망 기업</label>
              <LineInput
                id="wishTargetCompany"
                name="wishTargetCompany"
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
            <span className="text-xsmall16">희망 구직 조건</span>
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
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-12 flex gap-3">
          <OutlinedButton
            size="md"
            onClick={
              status === 'EDIT'
                ? () => setStatus('COMPLETE')
                : () => setStatus('EMPTY')
            }
            className="flex-1"
          >
            취소하기
          </OutlinedButton>
          <SolidButton className="flex-1" onClick={handleSubmit}>
            입력 완료
          </SolidButton>
        </div>
      </section>
      <CareerModals
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
