'use client';

import { FORM_PROGRAM_TYPES, getProgramTypeLabel } from '@letscareer/utils';
import { Controller, useFormContext } from 'react-hook-form';

import { PassCertificationFormValues } from '../passCertificationForm';
import {
  CheckboxRow,
  Chip,
  FormField,
  inputClassName,
  TextInput,
} from './fields';

export default function StepFeedback() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<PassCertificationFormValues>();

  const programTypeList = watch('programTypeList');
  const hasEtc = programTypeList?.includes('ETC');

  return (
    <div className="flex flex-col gap-5">
      {/* 참여 프로그램 (복수 선택) */}
      <FormField
        label="참여하신 렛츠커리어 프로그램 (복수 선택)"
        required
        error={errors.programTypeList?.message}
      >
        <Controller
          control={control}
          name="programTypeList"
          rules={{
            validate: (v) =>
              (v && v.length > 0) || '참여하신 프로그램을 선택해 주세요.',
          }}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {FORM_PROGRAM_TYPES.map((type) => {
                const selected = field.value?.includes(type);
                return (
                  <Chip
                    key={type}
                    selected={!!selected}
                    onClick={() =>
                      field.onChange(
                        selected
                          ? field.value.filter((t) => t !== type)
                          : [...(field.value ?? []), type],
                      )
                    }
                  >
                    {getProgramTypeLabel(type)}
                  </Chip>
                );
              })}
            </div>
          )}
        />
      </FormField>

      {hasEtc && (
        <FormField
          label="참여 프로그램 (기타)"
          required
          error={errors.programTypeEtc?.message}
        >
          <TextInput
            placeholder="참여 프로그램을 입력해 주세요. 예)인적성 챌린지"
            error={!!errors.programTypeEtc}
            {...register('programTypeEtc', {
              validate: (v, values) =>
                !values.programTypeList?.includes('ETC') ||
                !!v?.trim() ||
                '기타 내용을 입력해 주세요.',
            })}
          />
        </FormField>
      )}

      {/* 후기 */}
      <FormField label="렛츠커리어 프로그램이 어떻게 도움이 되었나요?">
        <textarea
          rows={4}
          placeholder="자유롭게 남겨주세요. 후배 취준생들에게 큰 힘이 돼요!"
          className={`${inputClassName} resize-none`}
          {...register('programFeedback')}
        />
      </FormField>

      {/* 동의 */}
      <div className="flex flex-col gap-3">
        <Controller
          control={control}
          name="privacyAgree"
          rules={{
            validate: (v) => v || '개인정보 수집·이용에 동의해 주세요.',
          }}
          render={({ field }) => (
            <div>
              <CheckboxRow checked={field.value} onChange={field.onChange}>
                리워드 지급과 인증 확인을 위한 개인정보 수집·이용에 동의합니다.
                <span className="text-primary-90 ml-1">*</span>
              </CheckboxRow>
              {errors.privacyAgree && (
                <p className="text-xxsmall12 text-requirement mt-1 pl-6">
                  {errors.privacyAgree.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="virtuousCycleAgree"
          render={({ field }) => (
            <CheckboxRow checked={field.value} onChange={field.onChange}>
              렛츠커리어 선순환 구조에 함께 해주실 의향이 있으신가요? (선택 ·
              합격자 인터뷰 섭외 메일을 보내드려요)
            </CheckboxRow>
          )}
        />
      </div>
    </div>
  );
}
