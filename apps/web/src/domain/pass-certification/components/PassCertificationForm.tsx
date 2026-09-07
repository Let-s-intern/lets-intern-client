'use client';

import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';
import { twMerge } from '@/lib/twMerge';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FiCheck } from 'react-icons/fi';

import {
  MOBILE_STEP_LABELS,
  passCertificationDefaultValues,
  PassCertificationFormValues,
  STEP_FIELDS,
  STEP_LABELS,
} from '../passCertificationForm';
import StepBasicInfo from './StepBasicInfo';
import StepComplete from './StepComplete';
import StepFeedback from './StepFeedback';
import StepPassInfo from './StepPassInfo';

const LAST_STEP = STEP_FIELDS.length - 1; // 2 (합격 후기)
const COMPLETE_STEP = STEP_FIELDS.length; // 3 (완료)

/** 데스크톱 스텝퍼 원 좌우 연결선 */
function Line({ filled }: { filled: boolean }) {
  return (
    <div
      className={twMerge(
        'h-0.5 flex-1',
        filled ? 'bg-primary' : 'bg-neutral-85',
      )}
    />
  );
}

/** 데스크톱: 가로 연결선 스텝퍼 (기본 정보 / 합격 정보 / 합격 후기) */
function DesktopStepper({ current }: { current: number }) {
  return (
    <div className="mb-6 hidden items-start px-6 pb-5 md:flex">
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const filled = i <= current;

        return (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <Line filled={filled} />
              <div
                className={twMerge(
                  'text-xsmall14 text-static-100 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold',
                  filled ? 'bg-primary' : 'bg-neutral-85',
                )}
              >
                {done ? <FiCheck className="h-4 w-4" /> : i + 1}
              </div>
              {/* 오른쪽 선은 완료된 단계만 강조 */}
              <Line filled={done} />
            </div>
            <span
              className={twMerge(
                'text-xxsmall12 mt-2',
                filled ? 'text-primary font-bold' : 'text-neutral-45',
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** 모바일: 현재 단계만 표시하는 번호 뱃지 (제출 완료 포함) */
function MobileStepper({ current }: { current: number }) {
  return (
    <div className="mb-4 flex items-center gap-2 md:mb-6 md:hidden">
      <span className="bg-primary text-xxsmall12 text-static-100 flex h-6 w-6 items-center justify-center rounded-full font-semibold">
        {current + 1}
      </span>
      <span className="text-xsmall14 text-primary font-semibold">
        {MOBILE_STEP_LABELS[current]}
      </span>
    </div>
  );
}

export default function PassCertificationForm() {
  const methods = useForm<PassCertificationFormValues>({
    mode: 'onChange',
    defaultValues: passCertificationDefaultValues,
  });
  const [step, setStep] = useState(0);

  const goNext = async () => {
    const valid = await methods.trigger(STEP_FIELDS[step]);
    if (!valid) return;
    if (step < LAST_STEP) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  // TODO(3b): presigned 업로드 + useCreatePassCertificationMutation 연결
  const handleSubmit = () => {
    setStep(COMPLETE_STEP);
  };

  const reset = () => {
    methods.reset(passCertificationDefaultValues);
    setStep(0);
  };

  return (
    <div className="bg-static-100 mx-auto flex min-h-[600px] w-full min-w-[320px] flex-col rounded-xl p-6 md:min-h-[686px] md:w-[820px] md:p-10 md:pt-[60px]">
      <MobileStepper current={step} />
      <DesktopStepper current={step} />

      {step === COMPLETE_STEP ? (
        <StepComplete onReset={reset} />
      ) : (
        <FormProvider {...methods}>
          <div className="flex flex-1 flex-col justify-between gap-5 md:gap-6">
            <div>
              {step === 0 && <StepBasicInfo />}
              {step === 1 && <StepPassInfo />}
              {step === 2 && <StepFeedback />}
            </div>
            {/* 버튼: 모바일 lg / 데스크톱 xl (lg↔xl 차이는 py 뿐이라 py 만 반응형 오버라이드) */}
            <div className="flex gap-3">
              {step > 0 && (
                <OutlinedButton
                  type="button"
                  size="xl"
                  variant="secondary"
                  onClick={goPrev}
                  className="flex-1 py-3 md:py-4"
                >
                  이전으로
                </OutlinedButton>
              )}
              <SolidButton
                type="button"
                size="xl"
                onClick={goNext}
                className="flex-1 py-3 md:py-4"
              >
                {step === LAST_STEP ? '제출하기' : '다음으로'}
              </SolidButton>
            </div>
          </div>
        </FormProvider>
      )}
    </div>
  );
}
