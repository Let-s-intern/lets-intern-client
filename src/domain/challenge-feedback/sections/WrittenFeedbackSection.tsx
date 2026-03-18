'use client';

import Image from 'next/image';
import { memo, useCallback, useEffect, useState } from 'react';
import type { FeedbackDetailWithTiers } from '../types';

interface WrittenFeedbackSectionProps {
  writtenDetails: FeedbackDetailWithTiers[];
}

const WrittenFeedbackSection = memo(function WrittenFeedbackSection({
  writtenDetails,
}: WrittenFeedbackSectionProps) {
  const [modalSrc, setModalSrc] = useState<string | null>(null);
  const [modalAlt, setModalAlt] = useState('');

  const openModal = useCallback((src: string, alt: string) => {
    setModalSrc(src);
    setModalAlt(alt);
  }, []);

  const closeModal = useCallback(() => {
    setModalSrc(null);
  }, []);

  useEffect(() => {
    if (!modalSrc) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [modalSrc, closeModal]);

  return (
    <>
      <section className="flex w-full flex-col items-center bg-[#13112a] py-12 md:py-16">
        <div className="w-full max-w-[1200px] px-6">
          <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
            서면 피드백, 이렇게{' '}
            <span className="text-[#B49AFF]">꼼꼼하게</span> 봐드려요
          </h2>
          <p className="mb-10 mt-4 text-center text-base text-gray-400 md:text-lg">
            실제 피드백 예시를 확인해 보세요
          </p>

          <div className="flex flex-col gap-10">
            {writtenDetails.map((detail) => (
              <div key={detail.round}>
                <div className="mb-4 flex items-center justify-center gap-2">
                  <h3 className="text-lg font-semibold text-white md:text-xl">
                    {detail.round}: {detail.description}
                  </h3>
                  {detail.tiers.map((tier) => (
                    <span
                      key={tier}
                      className="rounded bg-white/10 px-2 py-0.5 text-xs font-medium text-gray-400"
                    >
                      {tier}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col items-center gap-4">
                  {detail.exampleImages.map((src, i) => {
                    const alt = `${detail.round} ${detail.description} 피드백 예시 ${i + 1}`;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => openModal(src, alt)}
                        className="group relative h-[300px] w-full cursor-zoom-in overflow-hidden rounded-lg md:h-[400px]"
                      >
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 768px) 100vw, 1200px"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5"
                            >
                              <circle cx={11} cy={11} r={8} />
                              <line x1={21} y1={21} x2={16.65} y2={16.65} />
                              <line x1={11} y1={8} x2={11} y2={14} />
                              <line x1={8} y1={11} x2={14} y2={11} />
                            </svg>
                          </div>
                        </div>
                        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-sm text-white/70">
                          클릭하여 전체 보기
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 이미지 확대 모달 */}
      {modalSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closeModal}
        >
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
          >
            &times;
          </button>
          <div
            className="max-h-[90vh] max-w-[95vw] overflow-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={modalSrc}
              alt={modalAlt}
              width={1400}
              height={1867}
              className="w-[95vw] min-w-[700px] md:w-[900px] lg:w-[1200px]"
              sizes="90vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
});

export default WrittenFeedbackSection;
