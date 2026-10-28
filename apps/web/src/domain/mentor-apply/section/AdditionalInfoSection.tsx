import { Controller, useFormContext } from 'react-hook-form';

import { MAX_TEXT_LENGTH, type MentorApplyFormValues } from '../schema';
import CounterTextarea from '../ui/CounterTextarea';
import FormSection from '../ui/FormSection';

export default function AdditionalInfoSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<MentorApplyFormValues>();

  return (
    <FormSection
      title="추가 정보 (선택)"
      description="멘토님께 맞는 활동을 제안드릴 때 참고할게요. 편하게 적어주세요."
    >
      <Controller
        control={control}
        name="introduction"
        render={({ field }) => (
          <CounterTextarea
            label="이력 소개"
            placeholder="멘토님의 이력을 간단하게 소개해주세요."
            maxLength={MAX_TEXT_LENGTH}
            error={errors.introduction?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="motivation"
        render={({ field }) => (
          <CounterTextarea
            label="전하고 싶은 말씀"
            placeholder="렛츠커리어에 대해 궁금하신 점, 함께해보고 싶은 활동 등 편하게 이야기해주세요."
            maxLength={MAX_TEXT_LENGTH}
            error={errors.motivation?.message}
            {...field}
          />
        )}
      />
    </FormSection>
  );
}
