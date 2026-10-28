import { userCareerQueryOptions } from '@/api/career/career';
import { useUserQuery } from '@/api/user/user';
import useAuthStore from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { SNS_LINK_COUNT, type MentorApplyFormValues } from '../schema';
import { formatPhone } from '../utils/formatPhone';
import { parseSnsList } from '../utils/parseSnsList';

type Prefill = Partial<MentorApplyFormValues>;

/** 값이 있는 항목만 남긴다. 빈 값으로 기본값을 덮지 않기 위해서다 */
const compact = (values: Prefill): Prefill =>
  Object.fromEntries(
    Object.entries(values).filter(([, v]) => v !== undefined && v !== ''),
  );

/**
 * 로그인 사용자의 정보로 신청서를 채운다. 회원 정보와 경력은 각각 처음 도착했을 때 한 번만 채운다.
 * `keepDirtyValues` 로 사용자가 이미 고친 필드는 그대로 두고, 채운 값은 기본값이 되어 수정으로 치지 않는다.
 */
export function usePrefillFromUser(form: UseFormReturn<MentorApplyFormValues>) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { data: user } = useUserQuery();
  const { data: careers } = useQuery({
    ...userCareerQueryOptions(
      { page: 0, size: 1 },
      { sort: 'desc', sortType: 'START_DATE' },
    ),
    enabled: isLoggedIn,
  });

  const filledUser = useRef(false);
  const filledCareer = useRef(false);

  useEffect(() => {
    if (!user || filledUser.current) return;
    filledUser.current = true;

    const sns = parseSnsList(user.sns).slice(0, SNS_LINK_COUNT);
    apply(form, {
      name: user.name ?? undefined,
      phoneNum: user.phoneNum ? formatPhone(user.phoneNum) : undefined,
      email: user.contactEmail || user.email || undefined,
      snsLinks: sns.length
        ? [...sns, ...Array(SNS_LINK_COUNT - sns.length).fill('')]
        : undefined,
    });
  }, [user, form]);

  useEffect(() => {
    if (!careers || filledCareer.current) return;
    filledCareer.current = true;

    const latest = careers.userCareers[0];
    if (!latest) return;
    apply(form, { company: latest.company, jobTitle: latest.job });
  }, [careers, form]);
}

function apply(form: UseFormReturn<MentorApplyFormValues>, values: Prefill) {
  const prefill = compact(values);
  if (Object.keys(prefill).length === 0) return;
  form.reset({ ...form.getValues(), ...prefill }, { keepDirtyValues: true });
}
