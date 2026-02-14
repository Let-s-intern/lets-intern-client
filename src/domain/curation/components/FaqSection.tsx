import { FAQS } from '../constants';

const FaqSection = () => {
  return (
    <section className="flex w-full flex-col gap-4" id="curation-faq">
      <div className="flex flex-col gap-1">
        <h3 className="text-medium22 font-bold text-neutral-0">
          자주 묻는 질문
        </h3>
        <p className="text-xsmall15 text-neutral-40">
          챌린지 수강 전 궁금한 점을 모았어요.
        </p>
      </div>
      <div className="divide-y divide-neutral-90 overflow-hidden rounded-2xl border border-neutral-90 bg-white shadow-sm">
        {FAQS.map((item, index) => (
          <details
            key={item.question}
            className="group px-5 py-4"
            open={index < 2}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-small16 font-semibold text-neutral-0">
              <span>{item.question}</span>
              <span className="shrink-0 text-primary transition-transform">
                <span className="group-open:hidden">＋</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <p className="mt-2 border-l-2 border-primary-20 pl-3 text-xsmall14 leading-relaxed text-neutral-40">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
