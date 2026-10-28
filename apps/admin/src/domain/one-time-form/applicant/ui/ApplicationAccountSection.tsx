import type { AdminOneTimeFormApplication } from '@/api/one-time-form/oneTimeFormSchema';

import DetailSection from './DetailSection';
import InfoList from './InfoList';

interface ApplicationAccountSectionProps {
  user: AdminOneTimeFormApplication['user'];
}

/** 조회 시점의 계정 프로필. 열 이름은 CSV(계약 14.2)와 같다 */
const ApplicationAccountSection = ({
  user,
}: ApplicationAccountSectionProps) => (
  <DetailSection title="계정 정보">
    {user === null ? (
      <p className="text-xsmall14 text-neutral-40">탈퇴한 계정</p>
    ) : (
      <InfoList
        items={[
          { label: '유저 ID', value: user.userId },
          { label: '가입 이메일', value: user.email },
          { label: '학교', value: user.university },
          { label: '전공', value: user.major },
          { label: '학년', value: user.grade },
          { label: '희망 직군', value: user.wishField },
          { label: '희망 직무', value: user.wishJob },
          { label: '희망 산업', value: user.wishIndustry },
          { label: '유입 경로(가입 시)', value: user.inflowPath },
          {
            label: '마케팅 동의',
            value: user.marketingAgree ? '동의' : '미동의',
          },
        ]}
      />
    )}
  </DetailSection>
);

export default ApplicationAccountSection;
