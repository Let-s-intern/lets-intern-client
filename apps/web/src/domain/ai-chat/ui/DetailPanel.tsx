import { CalendarDays, Check, ChevronRight, Clock, Quote } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

import { AI_CHAT_KIND_LABEL } from '../constants/aiChat';
import { AiChatProgramDetail } from '../types/aiChat';
import { formatPeriod, formatWon } from '../utils/format';
import ItemThumbnail from './ItemThumbnail';

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="border-neutral-85 border-t pt-4">
    <h4 className="text-xsmall14 text-neutral-0 font-bold">{title}</h4>
    <div className="mt-2.5">{children}</div>
  </section>
);

/** 프로그램 하나의 상세 소개: 기본 정보 → 바로가기 → 소개·특징·커리큘럼·후기 */
const DetailPanel = ({ detail }: { detail: AiChatProgramDetail }) => {
  const { item, summary, highlights, steps, stepsTitle, reviews } = detail;
  const { price } = item;
  const discountRate =
    price?.original != null
      ? Math.round((1 - price.selling / price.original) * 100)
      : null;
  const recruit = formatPeriod(item.recruit);
  const schedule = formatPeriod(item.schedule);

  return (
    <div className="flex min-h-0 flex-col md:h-full">
      <h3 className="text-xsmall16 text-neutral-0 md:text-small18 font-bold">
        프로그램 소개
      </h3>
      <div className="border-neutral-85 mt-3 flex min-h-0 flex-col overflow-hidden rounded-md border bg-white md:flex-1">
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-4 md:flex-1">
          <div className="flex gap-3">
            <ItemThumbnail
              item={item}
              size="lg"
              className="rounded-xs aspect-[4/3] w-28 shrink-0 md:w-32"
            />
            <div className="flex min-w-0 flex-col">
              <span className="text-xxsmall12 text-primary font-semibold">
                {AI_CHAT_KIND_LABEL[item.kind] ?? item.kind}
              </span>
              <h4 className="text-xsmall14 text-neutral-0 md:text-xsmall16 mt-0.5 line-clamp-2 font-bold">
                {item.title}
              </h4>
              {price && (
                <div className="mt-1.5">
                  {price.original && (
                    <span className="text-xxsmall12 text-neutral-50 line-through">
                      {formatWon(price.original)}
                    </span>
                  )}
                  <div className="flex items-baseline gap-1.5">
                    {discountRate != null && discountRate > 0 && (
                      <span className="text-xsmall16 text-system-error font-bold">
                        {discountRate}%
                      </span>
                    )}
                    <span className="text-xsmall16 text-neutral-0 font-bold">
                      {formatWon(price.selling)}
                    </span>
                  </div>
                  {price.note && (
                    <p className="text-xxsmall12 text-neutral-45">
                      {price.note}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {(recruit || schedule) && (
            <div className="bg-neutral-95 text-xxsmall12 text-neutral-20 flex flex-col gap-1 rounded-sm px-3 py-2.5">
              {recruit && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} className="text-neutral-45" />
                  모집 {recruit}
                </span>
              )}
              {schedule && (
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-neutral-45" />
                  진행 {schedule}
                </span>
              )}
            </div>
          )}

          {summary && (
            <p className="text-xsmall14 text-neutral-20 whitespace-pre-line">
              {summary}
            </p>
          )}

          {highlights.length > 0 && (
            <Section title="이런 점이 좋아요">
              <ul className="flex flex-col gap-2.5">
                {highlights.map((h) => (
                  <li key={h.title} className="flex gap-2">
                    <span className="bg-primary-10 text-primary mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-xsmall14 text-neutral-0 font-semibold">
                        {h.title}
                      </p>
                      {h.description && (
                        <p className="text-xxsmall12 text-neutral-40 mt-0.5">
                          {h.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {steps.length > 0 && (
            <Section title={stepsTitle}>
              <ol className="flex flex-col gap-1.5">
                {steps.map((step, index) => (
                  <li
                    key={`${step.label}-${index}`}
                    className="text-xsmall14 flex gap-2"
                  >
                    <span className="text-primary w-14 shrink-0 font-semibold">
                      {step.label}
                    </span>
                    <span className="text-neutral-20">{step.title}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          <Section title="수강생 후기">
            {reviews.length === 0 ? (
              <p className="text-xxsmall12 text-neutral-45">
                아직 등록된 후기가 없어요.
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {reviews.map((review, index) => (
                  <li
                    key={index}
                    className="bg-primary-5 relative rounded-sm px-3.5 py-3"
                  >
                    <Quote
                      size={14}
                      className="text-primary-30 absolute right-3 top-3"
                    />
                    {review.title && (
                      <p className="text-xsmall14 text-neutral-0 pr-5 font-semibold">
                        {review.title}
                      </p>
                    )}
                    <p className="text-xxsmall12 text-neutral-20 md:text-xsmall14 mt-1 line-clamp-4">
                      {review.content}
                    </p>
                    {(review.author || review.meta) && (
                      <p className="text-xxsmall12 text-neutral-45 mt-1.5 line-clamp-1">
                        {[review.author, review.meta]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        <div className="border-neutral-85 border-t p-3">
          <Link
            href={item.href}
            className="ai_chat_detail_cta bg-primary text-xsmall14 hover:bg-primary-hover flex items-center justify-center gap-0.5 rounded-sm px-3 py-3 font-semibold text-white"
            data-url={item.href}
            data-text={item.title}
          >
            자세히 보고 신청하기
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
