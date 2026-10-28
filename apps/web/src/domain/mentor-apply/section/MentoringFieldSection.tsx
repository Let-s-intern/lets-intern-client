import { Controller, useFormContext } from 'react-hook-form';

import {
  JOB_FIELD_OPTIONS,
  MENTORING_TYPE_OPTIONS,
  type MentorApplyFormValues,
} from '../schema';
import ChipCheckboxGroup from '../ui/ChipCheckboxGroup';
import FormField from '../ui/FormField';
import FormSection from '../ui/FormSection';

export default function MentoringFieldSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<MentorApplyFormValues>();

  return (
    <FormSection title="멘토링 분야">
      <FormField
        name="jobFields"
        label="멘토링 가능 분야"
        required
        hint="복수 선택 가능"
        error={errors.jobFields?.message}
      >
        <Controller
          control={control}
          name="jobFields"
          render={({ field }) => (
            <ChipCheckboxGroup
              name={field.name}
              options={JOB_FIELD_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={!!errors.jobFields}
            />
          )}
        />
      </FormField>

      <FormField
        name="mentoringTypes"
        label="가능한 멘토링 형태"
        required
        hint="복수 선택 가능"
        error={errors.mentoringTypes?.message}
      >
        <Controller
          control={control}
          name="mentoringTypes"
          render={({ field }) => (
            <ChipCheckboxGroup
              name={field.name}
              options={MENTORING_TYPE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={!!errors.mentoringTypes}
            />
          )}
        />
      </FormField>
    </FormSection>
  );
}
