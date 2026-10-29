import { PassFormInput, PassPlan } from '@/domain/all-in-one-pass/types';
import { createEmptyLandingConfig } from '@/domain/all-in-one-pass/util/landingDescriptionMapper';
import BasicInfoSection from './BasicInfoSection';
import CalendarSection from './CalendarSection';
import ExternalLinkSection from './ExternalLinkSection';
import FaqSection from './FaqSection';
import LandingSection from './LandingSection';
import type { PassFormView } from './PassFormViewTabs';
import PlanSection, { createEmptyPlan } from './PlanSection';

export type { PassFormView };

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
  landing: createEmptyLandingConfig(),
  faqList: [],
  mentoringCouponAutoIssue: true,
});

interface Props {
  input: PassFormInput;
  patch: (partial: Partial<PassFormInput>) => void;
  /** 올인원패스 정보 / 랜딩페이지 구성 뷰 (헤더 토글로 전환) */
  view?: PassFormView;
  /** 수정 페이지 전용: 플랜 per-plan 저장/삭제 (넘기면 플랜 편집 모드) */
  onSavePlan?: (plan: PassPlan) => Promise<void>;
  onDeletePlan?: (plan: PassPlan) => void;
}

export default function PassForm({
  input,
  patch,
  view = 'info',
  onSavePlan,
  onDeletePlan,
}: Props) {
  if (view === 'landing') {
    return (
      <div className="mb-10">
        <LandingSection
          value={input.landing}
          plans={input.plans}
          externalLinks={input.externalLinks}
          onChange={(landing) => patch({ landing })}
        />
      </div>
    );
  }

  return (
    <div className="mb-10 flex flex-col gap-10">
      {/* 왼쪽: 기본정보·외부링크 세로 스택 / 오른쪽: 플랜(세로로 긴 편) */}
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <div className="flex w-full flex-1 flex-col gap-10">
          <BasicInfoSection input={input} patch={patch} />
          <ExternalLinkSection
            links={input.externalLinks}
            onChange={(externalLinks) => patch({ externalLinks })}
          />
        </div>
        <div className="w-full flex-1">
          <PlanSection
            plans={input.plans}
            onChange={(plans) => patch({ plans })}
            mentoringCouponAutoIssue={input.mentoringCouponAutoIssue}
            onMentoringChange={(mentoringCouponAutoIssue) =>
              patch({ mentoringCouponAutoIssue })
            }
            onSavePlan={onSavePlan}
            onDeletePlan={onDeletePlan}
          />
        </div>
      </div>
      <CalendarSection
        events={input.calendarEvents}
        onChange={(calendarEvents) => patch({ calendarEvents })}
        purchaseStartDate={input.purchaseStartDate}
        purchaseEndDate={input.purchaseEndDate}
        passDays={input.passDays}
      />
      <FaqSection
        selectedIds={input.faqList}
        onChange={(faqList) => patch({ faqList })}
      />
    </div>
  );
}
