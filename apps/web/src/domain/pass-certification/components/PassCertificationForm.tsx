'use client';

import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  passCertificationDefaultValues,
  PassCertificationFormValues,
  STEP_FIELDS,
} from '../passCertificationForm';
import { usePassCertificationSubmit } from '../usePassCertificationSubmit';
import StepBasicInfo from './StepBasicInfo';
import StepComplete from './StepComplete';
import StepFeedback from './StepFeedback';
import StepPassInfo from './StepPassInfo';
import Stepper from './Stepper';

const LAST_STEP = STEP_FIELDS.length - 1; // 2 (합격 후기)
const COMPLETE_STEP = STEP_FIELDS.length; // 3 (완료)

export default function PassCertificationForm() {
  const methods = useForm<PassCertificationFormValues>({
    // 첫 blur 전엔 검증 안 함(입력 중 에러 방지) → 이후 실시간 검증.
    // 단계 이동은 goNext 의 trigger() 로 강제 검증하므로 버튼 동작엔 영향 없음.
    mode: 'onTouched',
    defaultValues: passCertificationDefaultValues,
  });
  const [step, setStep] = useState(0);
  const { submit, submitting } = usePassCertificationSubmit();

  const goNext = async () => {
    if (submitting) return;
    const valid = await methods.trigger(STEP_FIELDS[step]);
    if (!valid) return;
    if (step < LAST_STEP) {
      setStep((s) => s + 1);
    } else {
      const ok = await submit(methods.getValues());
      if (ok) setStep(COMPLETE_STEP);
    }
  };

  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  const reset = () => {
    methods.reset(passCertificationDefaultValues);
    setStep(0);
  };

  return (
    <div className="bg-static-100 mx-auto flex min-h-[600px] w-full min-w-[320px] flex-col rounded-xl p-6 md:min-h-[686px] md:w-[820px] md:p-10 md:pt-[60px]">
      <Stepper current={step} />

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
                  disabled={submitting}
                  className="flex-1 py-3 md:py-4"
                >
                  이전으로
                </OutlinedButton>
              )}
              <SolidButton
                type="button"
                size="xl"
                onClick={goNext}
                disabled={submitting}
                className="flex-1 py-3 md:py-4"
              >
                {step === LAST_STEP
                  ? submitting
                    ? '제출 중...'
                    : '제출하기'
                  : '다음으로'}
              </SolidButton>
            </div>
          </div>
        </FormProvider>
      )}
    </div>
  );
}
