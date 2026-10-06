import { PassFormInput } from '@/domain/all-in-one-pass/types';
import BasicInfoSection from './BasicInfoSection';
import CalendarSection from './CalendarSection';
import DetailContentSection from './DetailContentSection';
import ExtensionSection from './ExtensionSection';
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
  extensionOptions: [],
  detailContent: null,
  faqList: [],
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
      <ExtensionSection
        options={input.extensionOptions}
        onChange={(extensionOptions) => patch({ extensionOptions })}
      />
      <DetailContentSection
        initialContent={input.detailContent}
        onChange={(detailContent) => patch({ detailContent })}
      />
      {/* FAQ: 공통 풀 관리(/faq) + 이 패스에 노출할 항목 체크 선택 */}
      <FaqSection
        selectedIds={input.faqList}
        onChange={(faqList) => patch({ faqList })}
      />
    </div>
  );
}
