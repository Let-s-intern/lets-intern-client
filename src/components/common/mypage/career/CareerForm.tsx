'use client';

import { EmployeeType, UserCareerType } from '@/api/careerSchema';
import { EmployeeTypeModal } from '@components/common/mypage/career/EmployeeTypeModal';
import { PeriodSelectModal } from '@components/pages/mypage/experience/components/PeriodSelectModal';
import OutlinedButton from '@components/ui/button/OutlinedButton';
import SolidButton from '@components/ui/button/SolidButton';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CareerFormProps {
  initialCareer: UserCareerType;
  handleCancel: () => void;
  handleSubmit: (data: UserCareerType) => void;
}

/**
 * 커리어 작성/수정 UI
 */
// TODO: form 유효성 검사 추가 예정 (라이브러리 도입 검토)
const CareerForm = ({
  initialCareer,
  handleCancel,
  handleSubmit,
}: CareerFormProps) => {
  const [form, setForm] = useState<UserCareerType>({
    id: initialCareer.id,
    company: initialCareer.company,
    position: initialCareer.position,
    employeeType: initialCareer.employeeType,
    employeeTypeOther: initialCareer.employeeTypeOther,
    startDate: initialCareer.startDate,
    endDate: initialCareer.endDate,
  });

  const [employeeTypeModalOpen, setEmployeeTypeModalOpen] = useState(false);
  const [startDateModalOpen, setStartDateModalOpen] = useState(false);
  const [endDateModalOpen, setEndDateModalOpen] = useState(false);

  const handleEmployeeTypeSelect = (type: EmployeeType) => {
    setForm((prev) => ({ ...prev, employeeType: type }));
    setEmployeeTypeModalOpen(false);
  };

  const handleStartDateSelect = (year: number, month: number) => {
    const dateString = `${year}.${String(month).padStart(2, '0')}`;
    setForm((prev) => ({ ...prev, startDate: dateString }));
  };

  const handleEndDateSelect = (year: number, month: number) => {
    const dateString = `${year}.${String(month).padStart(2, '0')}`;
    setForm((prev) => ({ ...prev, endDate: dateString }));
  };

  return (
    <>
      <form
        id="career-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(form);
        }}
        className="flex w-full flex-col gap-3 rounded-xs border border-neutral-80 p-5"
      >
        {/* 기업 이름 */}
        <fieldset className="flex flex-col gap-1.5">
          <label
            htmlFor="career-company"
            className="font-medium text-neutral-20"
          >
            기업 이름
          </label>
          <input
            id="career-company"
            value={form.company ?? ''}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, company: e.target.value }))
            }
            type="text"
            placeholder="예) 렛츠커리어"
            className="w-full rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none"
          />
        </fieldset>

        {/* 직무 */}
        <fieldset className="flex flex-col gap-1.5">
          <label
            htmlFor="career-position"
            className="font-medium text-neutral-20"
          >
            직무
          </label>
          <input
            id="career-position"
            type="text"
            value={form.position ?? ''}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, position: e.target.value }))
            }
            placeholder="예) 서비스 기획자"
            className="w-full rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none"
          />
        </fieldset>

        {/* 고용 형태 */}
        <fieldset className="flex flex-col gap-1.5">
          <span
            id="career-employment-type"
            className="font-medium text-neutral-20"
          >
            고용 형태
          </span>
          <button
            aria-labelledby="career-employment-type"
            type="button"
            onClick={() => setEmployeeTypeModalOpen(true)}
            className="flex w-full items-center justify-between rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-50"
          >
            {form.employeeType ? (
              <span className="text-neutral-0">{form.employeeType}</span>
            ) : (
              <span>고용 형태를 선택해 주세요.</span>
            )}
            <ChevronRight size={20} className="text-neutral-50" />
          </button>

          {form.employeeType === '기타(직접입력)' && (
            <input
              id="career-employee-type-other"
              type="text"
              value={form.employeeTypeOther ?? ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  employeeTypeOther: e.target.value,
                }))
              }
              placeholder="직접 입력해 주세요."
              className="mt-0.5 w-full rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none"
            />
          )}
        </fieldset>

        {/* 근무 기간 */}
        <fieldset className="flex flex-col gap-1.5">
          <div className="flex items-baseline gap-2">
            <span id="career-period" className="font-medium text-neutral-20">
              근무 기간
            </span>
            <p className="text-sm text-neutral-45">
              현재 근무 중인 경우에는 종료일을 비워주세요.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="career-period"
              type="button"
              onClick={() => setStartDateModalOpen(true)}
              className="flex w-full items-center justify-between rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-50"
            >
              {form.startDate ? (
                <span className="text-neutral-0">{form.startDate}</span>
              ) : (
                <span>시작 연도,월</span>
              )}
              <ChevronRight size={20} className="text-neutral-50" />
            </button>
            <span className="text-neutral-30">-</span>
            <button
              id="career-period"
              type="button"
              onClick={() => setEndDateModalOpen(true)}
              className="flex w-full items-center justify-between rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-50"
            >
              {form.endDate ? (
                <span className="text-neutral-0">{form.endDate}</span>
              ) : (
                <span>종료 연도,월</span>
              )}
              <ChevronRight size={20} className="text-neutral-50" />
            </button>
          </div>
        </fieldset>

        <div className="mt-11 flex w-full gap-2">
          <OutlinedButton onClick={handleCancel} className="flex-1">
            취소하기
          </OutlinedButton>
          <SolidButton form="career-form" type="submit" className="flex-1">
            입력 완료
          </SolidButton>
        </div>
      </form>

      <EmployeeTypeModal
        open={employeeTypeModalOpen}
        onClose={() => setEmployeeTypeModalOpen(false)}
        selected={form.employeeType}
        onSelect={handleEmployeeTypeSelect}
      />

      <PeriodSelectModal
        isOpen={startDateModalOpen}
        onClose={() => setStartDateModalOpen(false)}
        onSelect={handleStartDateSelect}
        initialYear={
          form.startDate ? Number(form.startDate.split('.')[0]) : null
        }
        initialMonth={
          form.startDate ? Number(form.startDate.split('.')[1]) : null
        }
      />

      <PeriodSelectModal
        isOpen={endDateModalOpen}
        onClose={() => setEndDateModalOpen(false)}
        onSelect={handleEndDateSelect}
        initialYear={form.endDate ? Number(form.endDate.split('.')[0]) : null}
        initialMonth={form.endDate ? Number(form.endDate.split('.')[1]) : null}
      />
    </>
  );
};

export default CareerForm;
