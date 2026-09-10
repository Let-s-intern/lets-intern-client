'use client';

import { FORM_PASS_TYPES, PASS_TYPE_LABEL } from '@letscareer/utils';
import { Controller, useFormContext } from 'react-hook-form';
import { FiUploadCloud } from 'react-icons/fi';

import { PassCertificationFormValues } from '../passCertificationForm';
import { Chip, FormField, TextInput } from './fields';

export default function StepPassInfo() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<PassCertificationFormValues>();

  const passType = watch('passType');

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <FormField
            label="합격 회사"
            required
            error={errors.companyName?.message}
          >
            <TextInput
              placeholder="회사명을 입력해 주세요."
              error={!!errors.companyName}
              {...register('companyName', {
                required: '합격 회사를 입력해 주세요.',
              })}
            />
          </FormField>
        </div>
        <div className="flex-1">
          <FormField label="합격 직무" required error={errors.jobName?.message}>
            <TextInput
              placeholder="합격 직무를 입력해 주세요."
              error={!!errors.jobName}
              {...register('jobName', {
                required: '합격 직무를 입력해 주세요.',
              })}
            />
          </FormField>
        </div>
      </div>

      {/* 합격 형태 (단일 선택) */}
      <FormField label="합격 형태" required error={errors.passType?.message}>
        <Controller
          control={control}
          name="passType"
          rules={{ required: '합격 형태를 선택해 주세요.' }}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {FORM_PASS_TYPES.map((type) => (
                <Chip
                  key={type}
                  selected={field.value === type}
                  onClick={() => field.onChange(type)}
                >
                  {PASS_TYPE_LABEL[type]}
                </Chip>
              ))}
            </div>
          )}
        />
      </FormField>

      {passType === 'ETC' && (
        <FormField
          label="합격 형태 (기타)"
          required
          error={errors.passTypeEtc?.message}
        >
          <TextInput
            placeholder="합격 형태를 입력해 주세요."
            error={!!errors.passTypeEtc}
            {...register('passTypeEtc', {
              validate: (v, values) =>
                values.passType !== 'ETC' ||
                !!v?.trim() ||
                '기타 내용을 입력해 주세요.',
            })}
          />
        </FormField>
      )}

      {/* 합격 인증 사진 */}
      <FormField
        label="합격 인증 사진"
        required
        helper="합격 이메일·사원증 등, 개인정보는 가려주세요."
        error={errors.certificationImage?.message}
      >
        <Controller
          control={control}
          name="certificationImage"
          rules={{
            required: '합격 인증 사진을 첨부해 주세요.',
            validate: (file) =>
              !file ||
              ['image/jpeg', 'image/png', 'application/pdf'].includes(
                file.type,
              ) ||
              'JPG, PNG, PDF 파일만 첨부할 수 있어요.',
          }}
          render={({ field }) => (
            <label
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed px-4 py-7 text-center transition-colors ${
                errors.certificationImage
                  ? 'border-requirement bg-static-100'
                  : 'border-primary-40 bg-primary-5 hover:border-primary'
              }`}
            >
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                className="hidden"
                onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
              />
              {field.value ? (
                <span className="text-xsmall14 text-neutral-0 font-medium">
                  {field.value.name}
                </span>
              ) : (
                <>
                  <FiUploadCloud className="text-primary hidden h-6 w-6 md:block" />
                  <span className="text-xsmall14 text-primary font-medium">
                    클릭해서 업로드
                  </span>
                  <span className="text-xxsmall12 text-neutral-40">
                    JPG·PNG·PDF 형식만 지원합니다
                  </span>
                </>
              )}
            </label>
          )}
        />
      </FormField>
    </div>
  );
}
