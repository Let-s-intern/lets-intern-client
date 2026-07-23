'use client';

import { useState } from 'react';
import channelService from '@/ChannelService';
import { SEMINAR_FAQ_HEAD, SEMINAR_FAQS } from '../data/faqs';
import FaqItem from '../ui/FaqItem';

/**
 * S10 FAQ 섹션 — 세미나 도메인 자체 아코디언(하드코딩, single).
 * 한 번에 하나의 항목만 열리며, 해소되지 않은 문의는 채널톡으로 연결한다.
 *
 * [이력] 이전엔 공용 헤드리스 Accordion(@letscareer/ui · packages/ui/src/Accordion)을 소비했다.
 * 그 프리미티브의 실제 호출처는 아래 두 곳이 전부였고(유일 소비처), 제거 후 도메인 로컬 구현으로 되돌렸다.
 *   - FaqSection.tsx  : Accordion (root, type="single")
 *   - FaqItem.tsx     : AccordionItem / AccordionTrigger / AccordionContent
 */
const FaqSection = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="w-full px-5 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xsmall14 md:text-xsmall16 text-primary font-semibold">
            {SEMINAR_FAQ_HEAD.eyebrow}
          </p>
          <h2 className="text-small20 md:text-large26 text-neutral-0 font-bold">
            {SEMINAR_FAQ_HEAD.title}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {SEMINAR_FAQS.map((faq) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => toggle(faq.id)}
            />
          ))}
        </div>

        <div className="bg-neutral-95 flex flex-col items-center gap-3 rounded-md px-6 py-5 md:flex-row md:justify-between">
          <span className="text-xsmall14 md:text-small18 text-neutral-35 font-semibold">
            아직 궁금증이 풀리지 않았다면?
          </span>
          <button
            type="button"
            onClick={() => channelService.showMessenger()}
            className="border-neutral-70 text-xsmall14 md:text-xsmall16 text-neutral-0 rounded-sm border bg-neutral-100 px-5 py-3 font-medium"
          >
            1:1 채팅 문의하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
