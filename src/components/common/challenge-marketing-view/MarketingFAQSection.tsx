'use client';

import channelService from '@/ChannelService';
import { ChallengeIdPrimitive } from '@/schema';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  faqInfo: ChallengeIdPrimitive['faqInfo'];
}

const MarketingFAQSection = ({ faqInfo }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false,
  );
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const faqCategoryOrder = useMemo(() => {
    const categories = Array.from(
      new Set(faqInfo.map((faq) => faq.category ?? '')),
    );
    return categories;
  }, [faqInfo]);

  useEffect(() => {
    if (faqCategoryOrder.length > 0 && selectedCategory === '') {
      setSelectedCategory(faqCategoryOrder[0]);
    }
  }, [faqCategoryOrder, selectedCategory]);

  const sortedFaqs = useMemo(() => {
    const categoryMap = new Map(faqCategoryOrder.map((cat, i) => [cat, i]));

    return [...faqInfo].sort((a, b) => {
      return (
        (categoryMap.get(a.category ?? '') ?? Infinity) -
        (categoryMap.get(b.category ?? '') ?? Infinity)
      );
    });
  }, [faqInfo, faqCategoryOrder]);

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === '') return sortedFaqs;
    return sortedFaqs.filter((faq) => faq.category === selectedCategory);
  }, [sortedFaqs, selectedCategory, isMobile]);

  const toggle = (idx: number) => {
    setOpenIndexes(
      (prev) =>
        prev.includes(idx)
          ? prev.filter((i) => i !== idx) // 닫기
          : [...prev, idx], // 열기
    );
  };

  return (
    <section className="flex w-full flex-col items-center justify-center bg-white px-5 py-[60px] md:px-0 md:py-[100px]">
      <span className="mb-12 hidden items-center justify-center text-small20 font-semibold text-neutral-45 md:flex">
        FAQ
      </span>
      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center">
        <h3 className="mb-3 text-center text-xsmall16 font-semibold text-[#4A76FF] md:text-small20">
          자주 묻는 질문
        </h3>
        <h2 className="mb-12 text-center text-medium22 font-bold text-neutral-0 md:text-xlarge30">
          궁금한 점이 있으신가요?
        </h2>

        <div className="mb-8 flex grid w-[320px] grid-cols-4 items-center gap-2 md:w-[652px] md:grid-cols-4">
          {faqCategoryOrder.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat ?? '');
                setOpenIndexes([]);
              }}
              className={`h-[32px] w-[72.5px] rounded-xxl border py-2 text-xxsmall12 font-semibold md:h-auto md:w-[145px] md:px-5 md:py-3 md:text-small20 ${
                selectedCategory === cat
                  ? 'border-[#4A76FF] bg-[#F0F4FF] text-[#4A76FF]'
                  : 'border-neutral-300 text-neutral-45'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ 목록 */}
        <ul className="flex w-full flex-col items-center space-y-4">
          {filteredFaqs.map((item, idx) => (
            <li
              key={idx}
              className="w-full overflow-hidden rounded-sm border border-neutral-200 bg-white md:w-[800px]"
            >
              <button
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between bg-[#F9F9F8] px-4 py-3 text-left text-xsmall16 font-semibold text-neutral-0 transition-colors md:text-medium22"
              >
                {item.question}
                <ChevronDown
                  className={`ml-2 h-5 w-5 transition-transform ${
                    openIndexes.includes(idx)
                      ? 'rotate-180 text-[#4A76FF]'
                      : 'text-neutral-400'
                  }`}
                />
              </button>

              {openIndexes.includes(idx) && (
                <div className="bg-white px-4 pb-4 pt-2 text-xsmall14 leading-relaxed text-neutral-35 md:text-small18">
                  {item.answer}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex w-full flex-col items-center justify-between rounded-md bg-[#F9F9F8] px-[30px] py-4 md:w-[800px] md:flex-row">
        <p className="mb-3 text-xsmall14 font-semibold text-neutral-35 md:mb-0 md:text-small20">
          아직 궁금증이 풀리지 않았다면?
        </p>
        <button
          className="rounded-sm border border-neutral-300 bg-white px-5 py-2 text-xsmall14 font-medium text-neutral-20 md:px-6 md:py-3 md:text-small18"
          onClick={() => channelService.showMessenger()}
        >
          1:1 채팅 문의하기
        </button>
      </div>
    </section>
  );
};

export default MarketingFAQSection;
