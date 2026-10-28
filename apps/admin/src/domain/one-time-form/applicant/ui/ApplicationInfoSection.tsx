import type { AdminOneTimeFormApplication } from '@/api/one-time-form/oneTimeFormSchema';
import dayjs from '@/lib/dayjs';

import DetailSection from './DetailSection';
import InfoList from './InfoList';

const formatDateTime = (value: string | null) =>
  value === null ? null : dayjs(value).format('YYYY.MM.DD HH:mm');

interface ApplicationInfoSectionProps {
  application: AdminOneTimeFormApplication;
}

/** 신청일시, 상태, 신청자가 입력한 연락처 */
const ApplicationInfoSection = ({
  application,
}: ApplicationInfoSectionProps) => (
  <DetailSection title="신청 정보">
    <InfoList
      items={[
        { label: '신청일시', value: formatDateTime(application.createDate) },
        {
          label: '상태',
          value: application.isCanceled ? '신청 취소' : '신청 완료',
        },
        { label: '이름', value: application.name },
        { label: '이메일', value: application.email },
        { label: '전화번호', value: application.phoneNum },
        { label: '취소일시', value: formatDateTime(application.canceledAt) },
      ]}
    />
  </DetailSection>
);

export default ApplicationInfoSection;
