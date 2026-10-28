import { useFormContext } from 'react-hook-form';

import { type MentorApplyFormValues } from '../schema';
import { fieldErrorId } from '../ui/FormField';
import FormSection from '../ui/FormSection';

export default function PrivacyAgreementSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<MentorApplyFormValues>();

  return (
    <FormSection title="개인정보 수집·이용 동의">
      <div data-field="privacyAgreed" className="flex flex-col gap-3">
        <div className="bg-neutral-95 text-xsmall14 text-neutral-30 rounded-sm p-4 leading-relaxed">
          <p>
            · 수집 항목: 성함, 소속, 직무, 연차, 전화번호, 이메일, 이력 소개,
            전하고 싶은 말씀, 첨부파일·링크
          </p>
          <p>· 수집 목적: 멘토 선발 및 선발 결과 안내</p>
          <p>· 보유 기간: 모집 종료 후 1년 (요청 시 즉시 파기)</p>
          <p className="text-neutral-40 mt-2">
            동의를 거부할 수 있으나, 거부 시 멘토 신청이 제한됩니다.
          </p>
        </div>
        <label className="text-xsmall16 text-neutral-0 flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            aria-invalid={errors.privacyAgreed ? true : false}
            aria-describedby={
              errors.privacyAgreed ? fieldErrorId('privacyAgreed') : undefined
            }
            className="accent-primary h-5 w-5"
            {...register('privacyAgreed')}
          />
          <span>
            개인정보 수집·이용에 동의합니다.{' '}
            <span className="text-requirement">(필수)</span>
          </span>
        </label>
        {errors.privacyAgreed ? (
          <p
            id={fieldErrorId('privacyAgreed')}
            className="text-xxsmall12 text-requirement"
          >
            {errors.privacyAgreed.message}
          </p>
        ) : null}
      </div>
    </FormSection>
  );
}
