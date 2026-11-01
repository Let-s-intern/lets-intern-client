import type { Faq as FaqItem } from '@/schema';
import { ChevronDown } from 'lucide-react';

export function Faq({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section className="break-keep bg-[#f7f8fc] py-14 md:py-20">
      <div className="mx-auto max-w-[880px] px-5">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#1c1e2b] md:text-4xl">
          자주 묻는 질문
        </h2>
        <ul className="mt-7 flex flex-col gap-2 md:mt-9 md:gap-[13px]">
          {faqs.map(({ id, question, answer }) => (
            <li key={id}>
              <details className="group rounded-[16px] border border-[#dcdde3] bg-white md:rounded-[12px]">
                <summary className="flex min-h-[53px] cursor-pointer list-none items-center justify-between gap-3 px-[17px] py-2.5 text-sm leading-[1.15] text-[#1c1e2b] md:min-h-[51px] md:px-[21px] md:text-[15px] [&::-webkit-details-marker]:hidden">
                  <span>{question ?? ''}</span>
                  <ChevronDown
                    aria-hidden
                    className="h-5 w-5 shrink-0 text-[#3a3d4c] transition-transform group-open:rotate-180"
                    strokeWidth={2.5}
                  />
                </summary>
                <p className="whitespace-pre-line border-t border-[#ededf3] px-[17px] py-4 text-sm leading-[1.6] text-[#5b5e6d] md:px-[21px]">
                  {answer ?? ''}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
