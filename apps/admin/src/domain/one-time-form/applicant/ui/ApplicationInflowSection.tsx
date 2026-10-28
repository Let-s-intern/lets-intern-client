import type { AdminOneTimeFormApplication } from '@/api/one-time-form/oneTimeFormSchema';

import DetailSection from './DetailSection';
import InfoList from './InfoList';

interface ApplicationInflowSectionProps {
  application: Pick<
    AdminOneTimeFormApplication,
    | 'utmSource'
    | 'utmMedium'
    | 'utmCampaign'
    | 'utmContent'
    | 'utmTerm'
    | 'referrer'
  >;
}

/** 신청 URL 의 UTM 과 referrer */
const ApplicationInflowSection = ({
  application,
}: ApplicationInflowSectionProps) => (
  <DetailSection title="유입">
    <InfoList
      items={[
        { label: 'utm_source', value: application.utmSource },
        { label: 'utm_medium', value: application.utmMedium },
        { label: 'utm_campaign', value: application.utmCampaign },
        { label: 'utm_content', value: application.utmContent },
        { label: 'utm_term', value: application.utmTerm },
        { label: 'referrer', value: application.referrer },
      ]}
    />
  </DetailSection>
);

export default ApplicationInflowSection;
