'use client';

import { ChallengeIdPrimitive } from '@/schema';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  faqInfo: ChallengeIdPrimitive['faqInfo'];
}

const MarketingFAQSection = ({ faqInfo }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false,
  );

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
    if (isMobile || selectedCategory === '') return sortedFaqs;
    return sortedFaqs.filter((faq) => faq.category === selectedCategory);
  }, [sortedFaqs, selectedCategory, isMobile]);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="flex w-full flex-col items-center justify-center bg-white px-5 py-[60px] md:px-0 md:py-[100px]">
      <span className="mb-12 hidden items-center justify-center text-small20 font-semibold text-neutral-45 md:flex">
        FAQ
      </span>
      <div className="mx-auto w-full max-w-[900px]">
        <h3 className="mb-3 text-center text-xsmall16 font-semibold text-[#4A76FF] md:text-small20">
          자주 묻는 질문
        </h3>
        <h2 className="mb-12 text-center text-medium22 font-bold text-neutral-0 md:text-xlarge30">
          궁금한 점이 있으신가요?
        </h2>

        {/* 카테고리 버튼 (모바일은 숨김) */}
        {!isMobile && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {faqCategoryOrder.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat ?? '')}
                className={`w-[145px] rounded-xxl border px-5 py-3 text-small20 font-semibold ${
                  selectedCategory === cat
                    ? 'border-[#4A76FF] bg-[#F0F4FF] text-[#4A76FF]'
                    : 'border-neutral-300 text-neutral-45'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQ 목록 */}
        <ul className="justify-items-center space-y-4">
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
                    openIndex === idx
                      ? 'rotate-180 text-[#4A76FF]'
                      : 'text-neutral-400'
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="bg-white px-4 pb-4 pt-2 text-xsmall14 leading-relaxed text-neutral-35 md:text-small18">
                  {item.answer}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default MarketingFAQSection;
