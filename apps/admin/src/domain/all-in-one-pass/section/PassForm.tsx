import { PassFormInput } from '@/domain/all-in-one-pass/types';
import BasicInfoSection from './BasicInfoSection';
import BenefitSection from './BenefitSection';
import CalendarSection from './CalendarSection';
import DetailContentSection from './DetailContentSection';
import ExternalLinkSection from './ExternalLinkSection';
import FaqSection from './FaqSection';
import PlanSection, { createEmptyPlan } from './PlanSection';

/** 생성/수정 폼 초기값 (빈 폼) */
export const createInitialPassInput = (): PassFormInput => ({
  title: '',
  shortDescription: '',
  purchaseStartDate: null,
  purchaseEndDate: null,
  passDays: null,
  thumbnailUrl: null,
  plans: [createEmptyPlan()],
  calendarEvents: [],
  externalLinks: [],
  detailContent: null,
  benefits: [],
  faqs: [],
});

interface Props {
  input: PassFormInput;
  patch: (partial: Partial<PassFormInput>) => void;
}

/**
 * A-2 올인원패스 폼 본문 (6개 섹션). 생성/수정 페이지가 공용으로 쓴다.
 * 상세 콘텐츠(렉시컬)는 마운트 시점 초기값을 쓰므로, 프리필이 필요한
 * 수정 페이지는 데이터 로드 완료 후 이 컴포넌트를 렌더해야 한다.
 */
export default function PassForm({ input, patch }: Props) {
  return (
    <div className="mb-10 flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <BasicInfoSection input={input} patch={patch} />
        <PlanSection
          plans={input.plans}
          onChange={(plans) => patch({ plans })}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <CalendarSection
          events={input.calendarEvents}
          onChange={(calendarEvents) => patch({ calendarEvents })}
          purchaseStartDate={input.purchaseStartDate}
          purchaseEndDate={input.purchaseEndDate}
          passDays={input.passDays}
        />
        <ExternalLinkSection
          links={input.externalLinks}
          onChange={(externalLinks) => patch({ externalLinks })}
        />
      </div>
      <DetailContentSection
        initialContent={input.detailContent}
        onChange={(detailContent) => patch({ detailContent })}
      />
      <BenefitSection
        benefits={input.benefits}
        onChange={(benefits) => patch({ benefits })}
      />
      <FaqSection faqs={input.faqs} onChange={(faqs) => patch({ faqs })} />
    </div>
  );
}
