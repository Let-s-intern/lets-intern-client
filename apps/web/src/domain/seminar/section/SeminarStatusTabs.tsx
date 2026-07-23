'use client';

import { CategoryTabs } from '@letscareer/ui';
import { useSeminarStatusParam } from '../hooks/useSeminarStatusParam';
import { SeminarStatus } from '../utils/seminarStatus';

const SEMINAR_STATUS_TAB_OPTIONS: { value: SeminarStatus; label: string }[] = [
  { value: 'recruiting', label: '모집 중' },
  { value: 'closed', label: '모집 종료' },
];

/** 세미나 모집상태 필터 탭(S3) — CategoryTabs 무수정 재사용, URL query 기반 controlled. */
const SeminarStatusTabs = () => {
  const [status, setStatus] = useSeminarStatusParam();

  return (
    <CategoryTabs
      options={SEMINAR_STATUS_TAB_OPTIONS}
      selected={status}
      onChange={setStatus}
      size="large"
      className="justify-center !pl-0"
    />
  );
};

export default SeminarStatusTabs;
