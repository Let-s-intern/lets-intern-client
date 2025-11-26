'use client';

import {
  careerFormSchema,
  CareerFormType,
  EmployeeType,
  UserCareerType,
} from '@/api/careerSchema';
import { convertCareerUiToApiFormat } from '@/utils/career';
import { EmployeeTypeModal } from '@components/common/mypage/career/EmployeeTypeModal';
import { PeriodSelectModal } from '@components/pages/mypage/experience/components/PeriodSelectModal';
import OutlinedButton from '@components/ui/button/OutlinedButton';
import SolidButton from '@components/ui/button/SolidButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface CareerFormProps {
  initialCareer: CareerFormType;
  handleCancel: () => void;
  handleSubmit: (data: UserCareerType) => void;
}

/**
 * 커리어 작성/수정 UI
 */
const CareerForm = ({
  initialCareer,
  handleCancel,
  handleSubmit,
}: CareerFormProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors, isDirty },
    handleSubmit: rhfHandleSubmit,
  } = useForm<CareerFormType>({
    resolver: zodResolver(careerFormSchema),
    defaultValues: initialCareer,
    mode: 'onChange',
  });

  const [employeeTypeModalOpen, setEmployeeTypeModalOpen] = useState(false);
  const [periodMode, setPeriodMode] = useState<'start' | 'end' | null>(null);

  const form = watch();

  const onSubmit = (validatedData: CareerFormType) => {
    handleSubmit(convertCareerUiToApiFormat(validatedData));
  };

  const handleEmployeeTypeSelect = (type: EmployeeType) => {
    if (type !== '기타(직접입력)') {
      setValue('employmentTypeOther', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    setValue('employmentType', type, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setEmployeeTypeModalOpen(false);
  };

  const handleStartDateSelect = (year: number, month: number) => {
    const dateString = `${year}.${String(month).padStart(2, '0')}`;
    setValue('startDate', dateString, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleEndDateSelect = (year: number, month: number) => {
    const dateString = `${year}.${String(month).padStart(2, '0')}`;
    setValue('endDate', dateString, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <>
      <form
        id="career-form"
        onSubmit={rhfHandleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        className="flex w-full flex-col gap-3 rounded-xs border border-neutral-80 p-5 text-sm md:text-base"
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
            {...register('company')}
            type="text"
            placeholder="예) 렛츠커리어"
            className="w-full rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none"
          />
          <ErrorMsg msg={errors.company?.message} />
        </fieldset>

        {/* 직무 */}
        <fieldset className="flex flex-col gap-1.5">
          <label htmlFor="career-job" className="font-medium text-neutral-20">
            직무
          </label>
          <input
            id="career-job"
            type="text"
            {...register('job')}
            placeholder="예) 서비스 기획자"
            className="w-full rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none"
          />
          <ErrorMsg msg={errors.job?.message} />
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
            {form.employmentType ? (
              <span className="text-neutral-0">{form.employmentType}</span>
            ) : (
              <span>고용 형태를 선택해 주세요.</span>
            )}
            <ChevronRight size={20} className="text-neutral-50" />
          </button>

          <ErrorMsg msg={errors.employmentType?.message} />

          {form.employmentType === '기타(직접입력)' && (
            <input
              id="career-employee-type-other"
              type="text"
              {...register('employmentTypeOther')}
              placeholder="직접 입력해 주세요."
              className="mt-0.5 w-full rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none"
            />
          )}

          <ErrorMsg msg={errors.employmentTypeOther?.message} />
        </fieldset>

        {/* 근무 기간 */}
        <fieldset className="flex flex-col gap-1.5">
          <div className="flex flex-col items-baseline gap-1 md:flex-row md:gap-2">
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
              onClick={() => setPeriodMode('start')}
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
              onClick={() => {
                if (!form.startDate) {
                  setPeriodMode('start');
                } else {
                  setPeriodMode('end');
                }
              }}
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

          <ErrorMsg msg={errors.startDate?.message} />
          <ErrorMsg msg={errors.endDate?.message} />
        </fieldset>

        <div className="mt-11 flex w-full gap-2">
          <OutlinedButton onClick={handleCancel} className="flex-1">
            취소하기
          </OutlinedButton>
          <SolidButton
            form="career-form"
            type="submit"
            disabled={!isDirty}
            className="flex-1"
          >
            입력 완료
          </SolidButton>
        </div>
      </form>

      <EmployeeTypeModal
        open={employeeTypeModalOpen}
        onClose={() => setEmployeeTypeModalOpen(false)}
        selected={form.employmentType as EmployeeType}
        onSelect={handleEmployeeTypeSelect}
      />

      {periodMode && (
        <PeriodSelectModal
          isOpen={!!periodMode}
          mode={periodMode}
          onClose={() => setPeriodMode(null)}
          onNext={() => setPeriodMode('end')}
          onPrev={() => setPeriodMode('start')}
          onSelect={
            periodMode === 'start' ? handleStartDateSelect : handleEndDateSelect
          }
          initialYear={
            periodMode === 'start'
              ? form.startDate
                ? Number(form.startDate.split('.')[0])
                : null
              : form.endDate
                ? Number(form.endDate.split('.')[0])
                : null
          }
          initialMonth={
            periodMode === 'start'
              ? form.startDate
                ? Number(form.startDate.split('.')[1])
                : null
              : form.endDate
                ? Number(form.endDate.split('.')[1])
                : null
          }
        />
      )}
    </>
  );
};

export default CareerForm;

const ErrorMsg = ({ msg }: { msg?: string }) => {
  if (!msg) return;
  return <span className="mt-1 text-xxsmall12 text-red-500">{msg}</span>;
};
