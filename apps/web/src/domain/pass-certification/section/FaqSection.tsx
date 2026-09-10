'use client';

import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

import channelService from '@/ChannelService';
import SectionHeading from '@/domain/pass-certification/components/SectionHeading';

import { PASS_SECTION_ID } from './sectionIds';

/** 합격 인증 FAQ (정적) */
const PASS_FAQS = [
  {
    question: '합격 인증은 누구나 할 수 있나요?',
    answer:
      '렛츠커리어 프로그램에 참여한 후 인턴 또는 신입으로 합격하신 분이라면 누구나 인증할 수 있어요. 정규직뿐 아니라 체험형·채용형 인턴 합격도 가능합니다.',
  },
  {
    question: '어떤 자료를 첨부해야 하나요?',
    answer:
      '합격 사실을 확인할 수 있는 합격 안내 메일, 문자, 사원증 등의 이미지를 첨부해 주세요. 이름과 회사명, 합격 여부를 확인할 수 있으면 충분하며, 불필요한 개인정보는 가린 후 제출해도 괜찮아요.',
  },
  {
    question: '1만원 축하 리워드는 언제 지급되나요?',
    answer:
      '합격 인증자 중 매월 10명을 추첨해 1만원의 합격 축하금을 드려요. 선정된 분께는 인증한 달의 다음 달 6일에 일괄 지급됩니다. 예를 들어 8월에 합격을 인증했다면 9월 6일에 지급돼요.',
  },
  {
    question: 'VOD와 PDF 자료는 언제 받을 수 있나요?',
    answer:
      '제출해 주신 합격 인증을 확인한 후, 작성해 주신 이메일로 회사생활 TIP VOD와 PDF를 보내드려요. 메일 주소를 정확하게 입력했는지 꼭 확인해 주세요.',
  },
  {
    question: '합격자 인터뷰는 어떻게 진행되나요?',
    answer:
      '인터뷰 참여를 희망하신 분께 렛츠커리어 팀이 별도로 연락드려요. 일정과 진행 방식을 함께 조율한 뒤, 취업 준비 과정과 합격 경험을 편하게 들려주시면 됩니다. 인터뷰 내용은 비슷한 고민을 가진 후배 취준생에게 도움이 되는 콘텐츠로 소개돼요.',
  },
];

/** 아코디언 항목 */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xxs border-neutral-80 overflow-hidden border">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 bg-neutral-100 p-5 text-left"
        aria-expanded={open}
      >
        <span className="text-xsmall16 md:text-medium22 text-neutral-0 font-semibold">
          {question}
        </span>
        <IoIosArrowDown
          size={24}
          color="#7A7D84"
          className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-neutral-80 text-xsmall14 md:text-small18 text-neutral-35 border-t p-5 leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

/** FAQ 섹션 */
export default function FaqSection() {
  return (
    <section
      id={PASS_SECTION_ID.faq}
      className="scroll-mt-[56px] md:scroll-mt-[60px]"
    >
      <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-10 px-5 py-10 md:gap-16 md:px-0 md:py-20">
        <SectionHeading label="FAQ" title="궁금한 점이 있으신가요?" />

        <div className="flex w-full max-w-[800px] flex-col gap-3">
          {PASS_FAQS.map((faq) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>

        {/* 문의 CTA */}
        <div className="bg-neutral-95 flex w-full max-w-[800px] flex-col items-center gap-3 rounded-md px-8 py-4 md:flex-row md:justify-between">
          <span className="text-xsmall14 text-neutral-35 md:text-small20 font-semibold">
            아직 궁금증이 풀리지 않았다면?
          </span>
          <button
            type="button"
            onClick={() => channelService.showMessenger()}
            className="border-neutral-70 text-xsmall14 md:text-small18 rounded-sm border bg-white px-5 py-3 font-medium md:px-6"
          >
            1:1 채팅 문의하기
          </button>
        </div>
      </div>
    </section>
  );
}
