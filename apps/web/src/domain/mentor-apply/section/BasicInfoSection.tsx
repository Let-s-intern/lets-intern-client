import { Controller, useFormContext } from 'react-hook-form';

import { CONTACT_METHOD_OPTIONS, type MentorApplyFormValues } from '../schema';
import ChipCheckboxGroup from '../ui/ChipCheckboxGroup';
import FormField, { fieldErrorId } from '../ui/FormField';
import FormSection from '../ui/FormSection';
import TextInput from '../ui/TextInput';
import { formatPhone } from '../utils/formatPhone';

export default function BasicInfoSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MentorApplyFormValues>();

  return (
    <FormSection title="기본 정보">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          name="name"
          label="성함"
          htmlFor="name"
          required
          error={errors.name?.message}
        >
          <TextInput
            id="name"
            autoComplete="name"
            invalid={!!errors.name}
            errorId={fieldErrorId('name')}
            {...register('name')}
          />
        </FormField>

        <FormField
          name="company"
          label="소속"
          htmlFor="company"
          required
          error={errors.company?.message}
        >
          <TextInput
            id="company"
            autoComplete="organization"
            invalid={!!errors.company}
            errorId={fieldErrorId('company')}
            {...register('company')}
          />
        </FormField>

        <FormField
          name="jobTitle"
          label="직무"
          htmlFor="jobTitle"
          required
          error={errors.jobTitle?.message}
        >
          <TextInput
            id="jobTitle"
            placeholder="예: 백엔드 개발, 브랜드 마케팅"
            invalid={!!errors.jobTitle}
            errorId={fieldErrorId('jobTitle')}
            {...register('jobTitle')}
          />
        </FormField>

        <FormField
          name="yearsOfExperience"
          label="연차"
          htmlFor="yearsOfExperience"
          required
          error={errors.yearsOfExperience?.message}
        >
          <div className="relative">
            <TextInput
              id="yearsOfExperience"
              type="number"
              inputMode="numeric"
              min={0}
              max={60}
              className="pr-10"
              invalid={!!errors.yearsOfExperience}
              errorId={fieldErrorId('yearsOfExperience')}
              {...register('yearsOfExperience')}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-zinc-500">
              년
            </span>
          </div>
        </FormField>

        <FormField
          name="phoneNum"
          label="전화번호"
          htmlFor="phoneNum"
          required
          error={errors.phoneNum?.message}
        >
          <Controller
            control={control}
            name="phoneNum"
            render={({ field }) => (
              <TextInput
                id="phoneNum"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="010-0000-0000"
                invalid={!!errors.phoneNum}
                errorId={fieldErrorId('phoneNum')}
                {...field}
                onChange={(e) => field.onChange(formatPhone(e.target.value))}
              />
            )}
          />
        </FormField>

        <FormField
          name="email"
          label="이메일"
          htmlFor="email"
          required
          error={errors.email?.message}
        >
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            invalid={!!errors.email}
            errorId={fieldErrorId('email')}
            {...register('email')}
          />
        </FormField>

        <FormField
          name="preferredContactMethods"
          label="선호 연락 수단"
          required
          hint="복수 선택 가능"
          error={errors.preferredContactMethods?.message}
          className="sm:col-span-2"
        >
          <Controller
            control={control}
            name="preferredContactMethods"
            render={({ field }) => (
              <ChipCheckboxGroup
                name={field.name}
                options={CONTACT_METHOD_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={!!errors.preferredContactMethods}
              />
            )}
          />
        </FormField>
      </div>
    </FormSection>
  );
}
