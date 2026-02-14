import { FAQS } from '../constants';

const FaqSection = () => {
  return (
    <section className="flex w-full flex-col gap-4" id="curation-faq">
      <div className="flex flex-col gap-1">
        <h3 className="text-medium22 font-bold text-neutral-0">정성적 FAQ</h3>
        <p className="text-xsmall15 text-neutral-40">
          챌린지와 서비스 관련 빈출 질문만 모았습니다.
        </p>
      </div>
      <div className="divide-y divide-neutral-90 overflow-hidden rounded-2xl border border-neutral-90 bg-white shadow-sm">
        {FAQS.map((item, index) => (
          <details
            key={item.question}
            className={`group px-5 py-4 ${index === 0 ? '' : ''}`}
            open={index < 2}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-small16 font-semibold text-neutral-0">
              <span>{item.question}</span>
              <span className="text-primary">＋</span>
            </summary>
            <p className="pt-2 text-xsmall14 text-neutral-40">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
