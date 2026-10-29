'use client';

import { useState } from 'react';
import { KAKAO_CHAT_URL } from '../data/links';

type FaqItem = { question: string; answer: string };

// 초안 — 정산·활동 조건 등 운영 정책이 확정되면 문구 검토 필요
const FAQ_TABS: { label: string; items: FaqItem[] }[] = [
  {
    label: '참여 전',
    items: [
      {
        question: '어떤 분들이 멘토로 지원할 수 있나요?',
        answer:
          '기업에서 근무하신 이력이 있는 분들이라면 누구나 지원하실 수 있어요. 직접 겪은 취업 준비 과정과 실무 경험이 후배들에게는 가장 현실적인 도움이 됩니다!',
      },
      {
        question: '어떤 멘토링을 할 수 있나요?',
        answer:
          '서류 첨삭, 모의 면접, 커리어 상담, 직무 Q&A 중 자신 있는 형태를 골라 진행하실 수 있어요. 무엇을 나눠야 할지 막막하시다면 합류 후 렛츠커리어 매니저가 멘토님의 경험에 맞는 주제와 진행 방식을 함께 정리해드려요.',
      },
      {
        question: '신청 후 합류까지 어떻게 진행되나요?',
        answer:
          "신청서를 제출하시면 5영업일 내로 선택하신 연락 수단(전화 또는 이메일)으로 회신드려요. 진행 상황은 '신청 현황 조회'에서 이름과 전화번호로 언제든 확인하실 수 있어요.",
      },
      {
        question: '신청서를 제출한 뒤 내용을 수정할 수 있나요?',
        answer:
          '제출된 신청서는 직접 수정할 수 없어요. 변경이 필요하시면 1:1 채팅 문의로 말씀해주세요.',
      },
      {
        question: '렛츠커리어만의 특별한 멘토 혜택이 있나요?',
        answer:
          '렛츠커리어 대표, 쥬디와 함께 SNS 키우기 혹은 인플루언서 도전을 시도해보실 수 있어요. 추가로 연말 멘토님들만의 네트워킹도 진행할 예정입니다. 다양한 직무의 인재분들을 만나볼 수 있어요.',
      },
    ],
  },
  {
    label: '참여 중',
    items: [
      {
        question: '멘토링은 온라인으로 진행되나요?',
        answer:
          '네, 멘토링은 온라인으로 진행돼요. 오프라인 참석 부담 없이 집이나 원하는 장소에서 참여하실 수 있어요.',
      },
      {
        question: '회사 업무가 바빠도 활동할 수 있나요?',
        answer:
          '멘토링 일정은 멘토님이 가능한 시간을 기준으로 잡아요. 퇴근 후나 주말처럼 원하는 시간대에 활동하실 수 있고, 업무 일정이 바뀌면 매니저와 조율하실 수 있어요.',
      },
      {
        question: '멘토링 일지나 보고 같은 행정 업무도 해야 하나요?',
        answer:
          '멘티 모집, 일정 안내, 기업 보고용 자료 정리 같은 운영 업무는 렛츠커리어가 맡아요. 멘토님은 멘토링 자체에만 집중하실 수 있도록 필요한 절차를 최소화하고 있어요.',
      },
    ],
  },
  {
    label: '참여 후',
    items: [
      {
        question: '멘토링 활동비는 어떻게 지급되나요?',
        answer:
          '진행하신 멘토링에 따라 활동비가 정산돼요. 금액과 정산 일정 등 자세한 조건은 합류 안내 과정에서 개별적으로 안내드려요.',
      },
      {
        question: '한 번 참여한 뒤에도 계속 활동할 수 있나요?',
        answer:
          '물론이에요. 원하시는 만큼 꾸준히 활동하실 수 있고, 잠시 쉬었다가 다시 참여하셔도 괜찮아요. 활동이 쌓일수록 멘토님만의 커리어 브랜드를 만드는 데에도 도움이 돼요.',
      },
    ],
  },
  {
    label: '기타',
    items: [
      {
        question: '이름이나 얼굴 같은 개인정보가 공개되나요?',
        answer:
          '멘토님이 동의하지 않은 개인정보는 공개되지 않아요. 실명이나 얼굴 공개가 부담스러우시다면 신청 후 회신 과정에서 말씀해주세요. 공개 범위를 함께 정할 수 있어요.',
      },
      {
        question: '궁금한 점은 어디로 문의하면 되나요?',
        answer:
          "아래 '1:1 채팅 문의하기'를 눌러 카카오톡 오픈채팅으로 편하게 문의해주세요.",
      },
    ],
  },
];

export function Faq() {
  const [active, setActive] = useState(0);
  const { items } = FAQ_TABS[active];

  return (
    <div className="flex w-full max-w-[800px] flex-col gap-16 sm:gap-[100px]">
      <div className="flex flex-col items-center gap-10 sm:gap-20">
        <div
          role="tablist"
          className="flex w-full max-w-[652px] gap-2 sm:gap-[23px]"
        >
          {FAQ_TABS.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`flex-1 rounded-full border px-2 py-2.5 text-[15px] font-semibold leading-[1.4] sm:px-5 sm:py-3.5 sm:text-xl ${
                i === active
                  ? 'border-[#4a76ff] bg-[#f1f4ff] text-[#4a76ff]'
                  : 'border-[#cfcfcf] bg-white text-[#989ba2] hover:bg-zinc-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="flex w-full flex-col gap-3">
          {items.length === 0 && (
            <p className="py-10 text-center text-base text-[#989ba2]">
              등록된 질문이 없어요.
            </p>
          )}
          {items.map((item, i) => (
            // 탭마다 첫 질문만 펼쳐 둔다. 탭을 바꾸면 펼침 상태도 처음으로 돌아간다
            <details
              key={`${active}-${item.question}`}
              open={i === 0}
              className="group"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[4px] border border-[#e7e7e7] bg-[#fafafa] px-4 py-3.5 group-open:rounded-b-none sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
                <span className="text-[17px] font-semibold leading-[1.4] text-[#27272d] sm:text-[22px]">
                  {item.question}
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="size-6 shrink-0 text-[#7a7d84] transition-transform group-open:rotate-180"
                >
                  <path
                    d="M6 9.5 12 15l6-5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <p className="rounded-b-[4px] border border-t-0 border-[#e7e7e7] bg-white p-4 text-[15px] leading-[1.45] text-[#5c5f66] sm:p-5 sm:text-lg">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 rounded-[12px] bg-[#f9f9f8] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-[30px]">
        <p className="text-lg font-semibold leading-[1.4] text-[#5c5f66] sm:text-xl">
          아직 궁금증이 풀리지 않았다면?
        </p>
        <a
          href={KAKAO_CHAT_URL}
          data-track-target="inquiry"
          data-track-location="faq"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center rounded-[8px] border border-[#cfcfcf] bg-white px-6 text-base font-medium leading-[1.45] text-[#3e4148] hover:bg-zinc-50 sm:h-14 sm:text-lg"
        >
          1:1 채팅 문의하기
        </a>
      </div>
    </div>
  );
}
