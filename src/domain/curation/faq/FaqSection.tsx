'use client';

import { useState } from 'react';
import { FAQS } from '../data/constants';
import type { FAQCategory } from '../types/types';

const FAQ_CATEGORIES: FAQCategory[] = [
  '프로그램 적합성',
  '커리큘럼/자료',
  '참여 방법',
  '피드백/멘토링',
];

// 마크다운 볼드(**텍스트**)를 연한 파란색 볼드로 렌더링하는 함수
const parseMarkdown = (text: string) => {
  // 줄바꿈으로 분리
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    // 각 줄에서 **텍스트** 파싱
    const parts = line.split(/(\*\*.*?\*\*)/g);

    const parsedLine = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        return (
          <span
            key={`${lineIndex}-${partIndex}`}
            className="font-bold text-blue-500"
          >
            {content}
          </span>
        );
      }
      return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
    });

    return (
      <div key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
        {parsedLine}
      </div>
    );
  });
};

const FaqSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | 'all'>(
    'all',
  );

  const filteredFaqs =
    selectedCategory === 'all'
      ? FAQS
      : FAQS.filter((faq) => faq.category === selectedCategory);

  return (
    <section className="flex w-full flex-col items-center gap-6" id="curation-faq">
      <div className="flex flex-col items-center gap-5 self-stretch py-14">
        <div className="flex w-[62.5rem] flex-col items-center gap-10">
          <p className="self-stretch text-center text-lg font-semibold leading-6 text-indigo-500">
            FAQ
          </p>
          <h3 className="text-center text-3xl font-bold leading-10 text-neutral-0">
            자주 묻는 질문
          </h3>
        </div>
        <p className="self-stretch text-center text-lg font-semibold leading-6 text-zinc-600">
          챌린지 수강 전 궁금한 점을 모았어요
        </p>
      </div>

      {/* 카테고리 필터 버튼 */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`rounded-full px-4 py-1.5 text-base font-bold leading-6 transition-all ${
            selectedCategory === 'all'
              ? 'bg-indigo-500 text-gray-50'
              : 'bg-zinc-100 text-neutral-600 font-medium hover:bg-zinc-200'
          }`}
          type="button"
        >
          전체
        </button>
        {FAQ_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-1.5 text-base font-bold leading-6 transition-all ${
              selectedCategory === category
                ? 'bg-indigo-500 text-gray-50'
                : 'bg-zinc-100 text-neutral-600 font-medium hover:bg-zinc-200'
            }`}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ 리스트 */}
      <div className="flex w-[50rem] flex-col gap-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item) => (
            <details
              key={`${selectedCategory}-${item.question}`}
              className="group overflow-hidden rounded-lg border border-neutral-90 bg-white"
              open={selectedCategory !== 'all'}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-lg font-semibold leading-6 text-neutral-0">
                <span>{item.question}</span>
                <span className="shrink-0 text-neutral-40 transition-transform">
                  <span className="group-open:hidden">＋</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <div className="border-t border-neutral-90 px-5 py-5 text-base font-normal leading-6 text-neutral-35">
                <div>{parseMarkdown(item.answer)}</div>
                {item.image && (
                  <img
                    src={
                      typeof item.image === 'string'
                        ? item.image
                        : item.image.src || item.image.default || item.image
                    }
                    alt={item.question}
                    className="mt-3 w-full rounded-lg border border-neutral-90"
                  />
                )}
              </div>
            </details>
          ))
        ) : (
          <div className="rounded-lg border border-neutral-90 bg-white px-5 py-8 text-center text-base text-neutral-40">
            해당 카테고리에 질문이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqSection;
