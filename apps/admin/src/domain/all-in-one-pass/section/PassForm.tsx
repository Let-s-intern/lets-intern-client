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

/**
 * A-2 올인원패스 폼 본문. 헤더 토글(view)로 "올인원패스 정보"(기본정보·플랜·캘린더·
 * 외부링크·FAQ)와 "랜딩페이지 구성"(히어로·렉시컬·추가혜택·후기·CTA)을 전환한다.
 * 상세 콘텐츠(렉시컬)는 마운트 시점 초기값을 쓰므로, 프리필이 필요한 수정 페이지는
 * 데이터 로드 완료 후 이 컴포넌트를 렌더해야 한다.
 */
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
      {/* 왼쪽: 기본정보(멘토링·연장 포함) / 오른쪽: 플랜(세로로 긴 편) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <BasicInfoSection input={input} patch={patch} />
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
      {/* FAQ: 공통 풀 관리(/faq) + 이 패스에 노출할 항목 체크 선택 */}
      <FaqSection
        selectedIds={input.faqList}
        onChange={(faqList) => patch({ faqList })}
      />
    </div>
  );
}
