'use client';

import { typeToBank } from '@letscareer/utils';
import { Controller, useFormContext } from 'react-hook-form';

import { PassCertificationFormValues } from '../passCertificationForm';
import { FormField, SelectField, TextInput } from './fields';

const BANK_OPTIONS = Object.entries(typeToBank).map(([value, label]) => ({
  value,
  label,
}));

export default function StepBasicInfo() {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<PassCertificationFormValues>();

  return (
    // 데스크톱: 2컬럼 (이름·전화 / 이메일 full / 계좌·은행) · 모바일: 1컬럼 stack
    <div className="grid grid-cols-1 items-start gap-x-4 gap-y-4 md:grid-cols-2 md:gap-y-6">
      <FormField label="이름" required error={errors.name?.message}>
        <TextInput
          placeholder="이름을 입력해 주세요."
          error={!!errors.name}
          {...register('name', { required: '이름을 입력해 주세요.' })}
        />
      </FormField>

      <FormField label="전화번호" required error={errors.phoneNum?.message}>
        <TextInput
          placeholder="'-' 없이 숫자만 입력해 주세요."
          inputMode="numeric"
          error={!!errors.phoneNum}
          {...register('phoneNum', {
            required: '전화번호를 입력해 주세요.',
            pattern: {
              value: /^\d{10,11}$/,
              message: '숫자 10~11자리로 입력해 주세요.',
            },
            onChange: (e) => {
              const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
              setValue('phoneNum', digits, { shouldValidate: true });
            },
          })}
        />
      </FormField>

      <div className="md:col-span-2">
        <FormField
          label="이메일"
          required
          helper="VOD & PDF 자료를 받을 주소입니다."
          hideHelperOnMobile
          error={errors.email?.message}
        >
          <TextInput
            type="email"
            placeholder="이메일을 입력해 주세요."
            error={!!errors.email}
            {...register('email', {
              required: '이메일을 입력해 주세요.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '올바른 이메일 형식이 아닙니다.',
              },
            })}
          />
        </FormField>
      </div>

      <FormField
        label="계좌번호"
        required
        helper="합격 축하금을 받을 계좌입니다."
        hideHelperOnMobile
        error={errors.accountNumber?.message}
      >
        <TextInput
          placeholder="'-' 없이 숫자만 입력해 주세요."
          inputMode="numeric"
          error={!!errors.accountNumber}
          {...register('accountNumber', {
            required: '계좌번호를 입력해 주세요.',
            minLength: {
              value: 7,
              message: '계좌번호는 7자리 이상 입력해 주세요.',
            },
            onChange: (e) => {
              const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 19);
              setValue('accountNumber', digits, { shouldValidate: true });
            },
          })}
        />
      </FormField>

      <FormField label="은행" required error={errors.bankName?.message}>
        <Controller
          control={control}
          name="bankName"
          rules={{ required: '은행을 선택해 주세요.' }}
          render={({ field }) => (
            <SelectField
              value={field.value}
              onChange={field.onChange}
              options={BANK_OPTIONS}
              placeholder="은행을 선택해 주세요."
              error={!!errors.bankName}
            />
          )}
        />
      </FormField>
    </div>
  );
}
