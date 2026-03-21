'use client';

import Image from 'next/image';
import { memo, useCallback, useEffect, useState } from 'react';
import BeforeAfterCard from '../components/BeforeAfterCard';
import type { BeforeAfter } from '../types';

interface BeforeAfterSectionProps {
  beforeAfter: BeforeAfter;
}

const BeforeAfterSection = memo(function BeforeAfterSection({
  beforeAfter,
}: BeforeAfterSectionProps) {
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
      <section className="flex w-full flex-col items-center justify-center bg-[#13112a] py-16 md:py-24">
        <p className="text-center text-sm font-semibold text-[#B49AFF] md:text-base">
          피드백 비포&애프터
        </p>
        <h2 className="mt-2 text-center text-xl font-bold text-white md:text-2xl">
          확실하게 업그레이드 된 서류!
          <br />
          Before & After
        </h2>
        <p className="mb-10 mt-4 text-center text-base text-gray-300 md:text-lg">
          부족한 점은 채우고, 강조할 부분은 더 눈에 띄도록, 구조화된 서류로
          업그레이드 해보세요.
        </p>
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 md:flex-row md:gap-12">
          <BeforeAfterCard
            type="before"
            image={beforeAfter.beforeImage}
            description={beforeAfter.beforeDescription}
            onImageClick={openModal}
          />
          <BeforeAfterCard
            type="after"
            image={beforeAfter.afterImage}
            description={beforeAfter.afterDescription}
            onImageClick={openModal}
          />
        </div>
      </section>

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
              height={1050}
              className="w-[95vw] md:w-[900px] lg:w-[1200px]"
              sizes="90vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
});

export default BeforeAfterSection;
