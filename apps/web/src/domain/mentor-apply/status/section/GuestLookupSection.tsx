'use client';

import { useMentorApplicationStatusMutation } from '@/api/mentor-application/mentorApplication';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import FormField, { fieldErrorId } from '../../ui/FormField';
import TextInput from '../../ui/TextInput';
import { formatPhone, toPhoneDigits } from '../../utils/formatPhone';
import { guestLookupSchema, type GuestLookupValues } from '../schema';
import StatusResultCard from '../ui/StatusResultCard';
import { isRateLimited } from '../utils/isRateLimited';

const messageClassName = 'text-xsmall14 text-neutral-30 text-center';

/** 비회원 조회. 성함·연락처 폼과 그 아래 결과 영역 */
export default function GuestLookupSection() {
  const mutation = useMentorApplicationStatusMutation();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestLookupValues>({
    resolver: zodResolver(guestLookupSchema),
    defaultValues: { name: '', phoneNum: '' },
  });

  const onSubmit = handleSubmit(({ name, phoneNum }) =>
    mutation.mutate({ name: name.trim(), phoneNum: toPhoneDigits(phoneNum) }),
  );

  return (
    <div className="flex flex-col gap-8">
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField
          name="name"
          label="성함"
          htmlFor="name"
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
          name="phoneNum"
          label="연락처"
          htmlFor="phoneNum"
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

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-primary text-static-100 hover:bg-primary-hover text-xsmall16 w-full rounded-sm py-3.5 font-semibold transition-colors disabled:opacity-60"
        >
          조회하기
        </button>
      </form>

      <div aria-live="polite">
        {mutation.isError ? (
          <p className={messageClassName}>
            {isRateLimited(mutation.error)
              ? '잠시 후 다시 시도해주세요.'
              : '조회하지 못했습니다. 잠시 후 다시 시도해주세요.'}
          </p>
        ) : mutation.data?.length === 0 ? (
          <p className={messageClassName}>
            일치하는 신청 내역이 없습니다. 성함과 연락처를 다시 확인해주세요.
          </p>
        ) : mutation.data ? (
          <ul className="flex flex-col gap-4">
            {mutation.data.map((application, index) => (
              <li key={`${application.submittedAt}-${index}`}>
                <StatusResultCard application={application} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
