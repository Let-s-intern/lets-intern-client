'use client';

import FaqDropdown from '@/common/dropdown/FaqDropdown';
import DetailSection from './DetailSection';

/**
 * 멘토가 편집하지 않는 고정 섹션 중 **마크업으로 구현하는 것** (시안 7·10).
 *
 * 이미지로 박은 섹션(`DetailImageSection`)과 달리, 여기 둘은
 * 멘토별 값이 들어가거나(진행 기간) 인터랙션이 필요해서(FAQ 아코디언) 마크업이어야 한다.
 * 문구 자체는 운영이 확정한 값이라 하드코딩한다.
 */

/** 시안 7 · 진행 프로세스 4단계. */
const PROCESS_STEPS = [
  {
    title: '멘토링 예약 신청 완료',
    desc: '멘토링 상세페이지에서 플랜과 원하는 멘토링 주제, 예약일시를 선택한 후 1:1 멘토링을 신청해요.',
  },
  {
    title: '사전 자료, 질문 제출',
    desc: '예약 완료 후, 마이페이지의 신청현황에서 사전 질문을 등록하고 자기소개서, 이력서, 포트폴리오 등 검토받을 자료가 있다면 제출해요.',
  },
  {
    title: '1:1 LIVE 멘토링',
    desc: '예약한 시간에 맞춰 온라인으로 입장해 멘토와 실시간 멘토링을 진행해요.',
  },
  {
    title: '종료 및 평가',
    desc: '멘토링이 끝난 후 후기를 남기고, 받은 조언을 바탕으로 다음 준비를 이어가요.',
  },
] as const;

/** 시안 7 · 멘토링 진행 방법. */
const PROCESS_HOW = [
  '멘토링 타입 별 사전 자료, 사전 질문 제출',
  '예약된 시간에 맞추어 LIVE 멘토링(온라인) 입장',
  '제출된 자료와 질문을 바탕으로 멘토님의 조언과 추가 질문으로 취업 뽀개기',
] as const;

/** 시안 10 · 자주 묻는 질문 (운영 확정). */
const FAQ_ITEMS = [
  {
    q: '온라인 참여는 어떻게 하나요?',
    a: '신청을 완료하신 후에, 카카오톡 알림톡을 통해 멘토링 입장 링크를 전송드릴 예정입니다. 혹시나 링크를 받아보지 못하셨다면, 채팅문의를 통해 문의주세요.',
  },
  {
    q: '사전 자료는 꼭 제출해야 하나요?',
    a: '필수는 아닙니다. 다만 이력서·자기소개서·포트폴리오를 미리 공유해주시면 멘토가 내용을 검토한 상태로 멘토링을 시작할 수 있어 훨씬 밀도 있게 진행됩니다.',
  },
  {
    q: '예약한 일정을 변경할 수 있나요?',
    a: '멘토링 시작 전까지 마이페이지 신청현황에서 변경하실 수 있습니다. 시작 시간이 임박한 경우에는 채팅문의로 연락주세요.',
  },
  {
    q: '멘토링 시간이 부족하면 연장할 수 있나요?',
    a: '예약된 시간 내에서 진행됩니다. 더 깊게 상담받고 싶으시다면 60분 플랜을 선택해주세요.',
  },
] as const;

interface DetailProcessSectionProps {
  /** "2026년 07월 14일(화) ~ 07월 27일(월)" 형태. 오픈 설정 값에서 온다. */
  period: string;
}

/** 시안 7 · 멘토링 진행 프로세스. */
export const DetailProcessSection = ({ period }: DetailProcessSectionProps) => (
  <DetailSection
    dark
    label="멘토링 프로세스"
    title="멘토링은 이렇게 진행돼요!"
    subtitle="예약부터 멘토링, 후기까지 4단계로 진행됩니다."
  >
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2 rounded-md bg-white/10 p-5">
        <p className="text-xsmall14 text-primary-light font-semibold">
          진행 기간
        </p>
        <p className="text-xsmall14">{period}</p>
        <p className="text-xsmall14 text-primary-light mt-2 font-semibold">
          진행 방식
        </p>
        <p className="text-xsmall14">
          100% 온라인 (멘토링 페이지, 온라인 화상)
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-md bg-white/10 p-5">
        <p className="text-xsmall14 text-primary-light font-semibold">
          멘토링 진행 방법
        </p>
        <ul className="flex flex-col gap-2">
          {PROCESS_HOW.map((line) => (
            <li key={line} className="text-xsmall14 flex gap-2 text-white/85">
              <span className="text-primary-light shrink-0">✓</span>
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>

    <ol className="grid grid-cols-1 gap-5 md:grid-cols-4">
      {PROCESS_STEPS.map((step, i) => (
        <li key={step.title} className="flex flex-col gap-2.5">
          <span className="bg-primary text-xxsmall12 w-fit rounded-full px-3 py-1.5 font-semibold text-white">
            Step {i + 1}
          </span>
          <p className="text-xsmall16 font-bold">{step.title}</p>
          <p className="text-xsmall14 leading-relaxed text-white/70">
            {step.desc}
          </p>
        </li>
      ))}
    </ol>
  </DetailSection>
);

interface DetailFaqSectionProps {
  id?: string;
}

/**
 * 시안 10 · 자주 묻는 질문.
 * 챌린지 상페와 **같은 공용 컴포넌트**(`common/dropdown/FaqDropdown`)를 쓴다 —
 * 아코디언 동작·타이포·테두리가 그대로 맞는다.
 */
export const DetailFaqSection = ({ id }: DetailFaqSectionProps) => (
  <DetailSection id={id} label="자주 묻는 질문" title="궁금한 점이 있으신가요?">
    <div className="flex flex-col gap-3">
      {FAQ_ITEMS.map((item, i) => (
        <FaqDropdown
          key={item.q}
          faq={{ id: i + 1, question: item.q, answer: item.a }}
        />
      ))}
    </div>

    <div className="bg-neutral-95 flex flex-col items-center justify-between gap-3 rounded-md px-5 py-4 md:flex-row">
      <p className="text-xsmall14 md:text-xsmall16 font-medium">
        아직 궁금증이 풀리지 않았다면?
      </p>
      <button
        type="button"
        onClick={() => window.ChannelIO?.('showMessenger')}
        className="border-neutral-80 text-xsmall14 rounded-sm border bg-white px-4 py-2 font-medium"
      >
        1:1 채팅 문의하기
      </button>
    </div>
  </DetailSection>
);
