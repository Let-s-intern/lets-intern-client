'use client';

import { useMentorApplicationStatusMutation } from '@/api/mentor-application/mentorApplication';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { fieldErrorId } from '../../ui/FormField';
import { primaryButtonClassName } from '../../ui/styles';
import TextInput from '../../ui/TextInput';
import { formatPhone, toPhoneDigits } from '../../utils/formatPhone';
import { guestLookupSchema, type GuestLookupValues } from '../schema';
import StatusResultCard from '../ui/StatusResultCard';
import { isRateLimited } from '../utils/isRateLimited';

const messageClassName =
  'rounded-[8px] bg-zinc-50 px-4 py-4 text-center text-sm text-zinc-600';

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
        <LookupField name="name" label="성함" error={errors.name?.message}>
          <TextInput
            id="name"
            autoComplete="name"
            invalid={!!errors.name}
            errorId={fieldErrorId('name')}
            {...register('name')}
          />
        </LookupField>

        <LookupField
          name="phoneNum"
          label="연락처"
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
        </LookupField>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={`${primaryButtonClassName} w-full py-3.5`}
        >
          {mutation.isPending ? '조회 중…' : '조회하기'}
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

/**
 * 조회 폼의 칸. 시안은 신청서와 달리 라벨을 24px 한 줄에 두고 입력칸을 바로 붙인다.
 * 신청서용 FormField 는 라벨 줄 아래 8px 를 띄워 이 화면에서는 칸마다 6.5px 씩 길어진다
 */
function LookupField({
  name,
  label,
  error,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div data-field={name}>
      <label
        htmlFor={name}
        className="block text-[15px] font-semibold leading-6 text-zinc-900"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={fieldErrorId(name)} className="mt-2 text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
