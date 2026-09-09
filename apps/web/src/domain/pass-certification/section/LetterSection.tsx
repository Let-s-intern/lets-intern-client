'use client';

import { useEffect, useRef, useState } from 'react';

import SectionHeading from '@/domain/pass-certification/components/SectionHeading';

/** 편지 섹션 */
export default function LetterSection() {
  const envelopeRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = envelopeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-neutral-95">
      <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-10 px-5 py-16 md:gap-14 md:px-5 md:py-20">
        <SectionHeading
          label="렛츠커리어 대표 멘토이자 CEO 쥬디의 편지"
          title="합격까지 하신 여러분께"
        />

        <div
          ref={envelopeRef}
          className="relative mx-auto w-full min-w-[330px] max-w-[400px] md:max-w-[1000px]"
        >
          <img
            src="/images/pass-certification/letter-mobile.png"
            alt=""
            aria-hidden
            className="w-full md:hidden"
          />
          <img
            src="/images/pass-certification/letter.png"
            alt=""
            aria-hidden
            className="hidden w-full md:block"
          />

          <div
            className={`absolute left-1/2 top-[3%] flex w-[252px] max-w-[85%] -translate-x-1/2 flex-col gap-5 pt-9 text-left transition-[opacity,transform] duration-700 ease-out min-[400px]:w-[300px] min-[400px]:pt-12 md:top-[10.5%] md:w-[624px] md:max-w-[62.4%] md:gap-8 md:pt-0 min-[1000px]:gap-[46px] ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <div className="flex flex-col gap-3">
              <img
                src="/icons/heart-line.svg"
                alt=""
                aria-hidden
                className="h-6 w-6 self-start md:self-end"
              />
              <div className="text-neutral-20 text-xsmall14 md:text-small18 min-[400px]:text-xsmall16 min-[1000px]:text-medium24 flex flex-col gap-4 font-light leading-[1.6] tracking-tight md:font-normal md:leading-[1.5] min-[1000px]:gap-6 min-[1000px]:leading-[1.4]">
                <p>
                  렛츠커리어와 함께 열심히 취준하시고, 합격까지 하신 여러분!{' '}
                  <br />
                  취업이 어려운 시기에 정말 고생 많으셨고 축하드립니다!!
                </p>
                <p>
                  여러분이 취준을 잘 했듯, 인턴·신입 생활도 잘 하셨으면 하는
                  마음에 자료를 하나 준비했어요!
                </p>
                <p>
                  신입 시절 제가 겪었던 어려움과 사수분께 들었던 조언을
                  녹여냈으니, <br />
                  회사 생활 어려울 때마다 한 번씩 펼쳐보세요!
                </p>
                <p>그럼 앞으로의 커리어 여정도 응원할게요!</p>
              </div>
            </div>

            <p className="text-primary text-xsmall16 md:text-small20 min-[1000px]:text-large26 font-medium md:font-semibold">
              렛츠커리어 CEO 쥬디 드림.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
