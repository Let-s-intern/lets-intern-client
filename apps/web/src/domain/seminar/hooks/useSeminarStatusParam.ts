'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SeminarStatus } from '../utils/seminarStatus';

const STATUS_PARAM = 'status';
const DEFAULT_STATUS: SeminarStatus = 'recruiting';

const isSeminarStatus = (value: string | null): value is SeminarStatus =>
  value === 'recruiting' || value === 'closed';

/**
 * 세미나 모집상태를 URL query(`?status=recruiting|closed`)로 관리한다.
 * 필터 탭과 빈 상태의 "종료된 세미나 보러가기" 버튼이 동일한 소스를 공유하도록 한다.
 */
export const useSeminarStatusParam = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status: SeminarStatus = isSeminarStatus(searchParams.get(STATUS_PARAM))
    ? (searchParams.get(STATUS_PARAM) as SeminarStatus)
    : DEFAULT_STATUS;

  const setStatus = (next: SeminarStatus) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(STATUS_PARAM, next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return [status, setStatus] as const;
};
