import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ArrowRight, CalendarDays, Clock, Quote, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { CSSProperties, ReactNode } from 'react';

import { AI_CHAT_KIND_LABEL } from '../constants/aiChat';
import { AiChatProgramDetail } from '../types/aiChat';
import { formatPeriod, formatWon } from '../utils/format';
import styles from './DetailPanel.module.css';
import ItemThumbnail from './ItemThumbnail';

/** 섹션마다 등장 시점을 조금씩 늦춘다 */
const riseDelay = (order: number): CSSProperties => ({
  animationDelay: `${order * 80}ms`,
});

/** 모집 마감까지 남은 날. 지났거나 없으면 null */
function getDeadlineBadge(end: string | null | undefined) {
  if (!end) return null;
  const days = dayjs(end).startOf('day').diff(dayjs().startOf('day'), 'day');
  if (days < 0 || days > 30) return null;
  return days === 0 ? '오늘 마감' : `마감 D-${days}`;
}

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h4 className="text-xsmall14 text-neutral-0 flex items-center gap-1.5 font-bold">
    <span className="bg-primary h-3.5 w-1 rounded-full" />
    {children}
  </h4>
);

const DetailPanel = ({ detail }: { detail: AiChatProgramDetail }) => {
  const { item, summary, highlights, steps, stepsTitle, reviews } = detail;
  const { price } = item;
  const discountRate =
    price?.original != null
      ? Math.round((1 - price.selling / price.original) * 100)
      : null;
  const recruit = formatPeriod(item.recruit);
  const schedule = formatPeriod(item.schedule);
  const deadlineBadge = getDeadlineBadge(item.recruit?.end);
  let order = 0;

  return (
    <div className="flex min-h-0 flex-col md:h-full">
      <div className="border-neutral-85 shadow-03 flex min-h-0 flex-col overflow-hidden rounded-lg border bg-white md:flex-1">
        <div className="flex min-h-0 flex-col overflow-y-auto md:flex-1">
          {/* 히어로: 이미지 위에 종류·마감 배지. 썸네일에 제목 글자가 들어 있어 제목은 아래에 둔다 */}
          <div className={twMerge('relative', styles.rise)}>
            <ItemThumbnail
              item={item}
              size="lg"
              className="aspect-[16/9] w-full"
            />
            <div className="absolute left-3 top-3 flex gap-1.5">
              <span className="text-xxsmall12 text-primary rounded-full bg-white/90 px-2.5 py-1 font-semibold backdrop-blur">
                {AI_CHAT_KIND_LABEL[item.kind] ?? item.kind}
              </span>
              {deadlineBadge && (
                <span className="text-xxsmall12 bg-system-error rounded-full px-2.5 py-1 font-semibold text-white">
                  {deadlineBadge}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 p-4 md:p-5">
            {/* 제목 + 가격 + 일정 */}
            <div
              className={twMerge('flex flex-col gap-3', styles.rise)}
              style={riseDelay(++order)}
            >
              <h3 className="text-small18 text-neutral-0 md:text-small20 font-bold leading-snug">
                {item.title}
              </h3>
              {price && (
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    {price.original && (
                      <span className="text-xsmall14 text-neutral-50 line-through">
                        {formatWon(price.original)}
                      </span>
                    )}
                    <div className="flex items-baseline gap-2">
                      {discountRate != null && discountRate > 0 && (
                        <span className="text-medium22 text-system-error font-extrabold">
                          {discountRate}%
                        </span>
                      )}
                      <span className="text-medium22 text-neutral-0 font-extrabold">
                        {formatWon(price.selling)}
                      </span>
                    </div>
                  </div>
                  {price.note && (
                    <span className="text-xxsmall12 bg-neutral-95 text-neutral-35 rounded-full px-2.5 py-1">
                      {price.note}
                    </span>
                  )}
                </div>
              )}
              {(recruit || schedule) && (
                <div className="flex flex-wrap gap-1.5">
                  {recruit && (
                    <span className="text-xxsmall12 border-neutral-85 text-neutral-20 flex items-center gap-1 rounded-full border px-2.5 py-1">
                      <CalendarDays size={12} className="text-primary" />
                      모집 {recruit}
                    </span>
                  )}
                  {schedule && (
                    <span className="text-xxsmall12 border-neutral-85 text-neutral-20 flex items-center gap-1 rounded-full border px-2.5 py-1">
                      <Clock size={12} className="text-primary" />
                      진행 {schedule}
                    </span>
                  )}
                </div>
              )}
            </div>

            {summary && (
              <p
                className={twMerge(
                  'from-primary-10 text-xsmall14 text-neutral-10 rounded-md bg-gradient-to-br to-white px-4 py-3.5 font-medium',
                  styles.rise,
                )}
                style={riseDelay(++order)}
              >
                <Sparkles
                  size={14}
                  className="text-primary mb-1 inline-block"
                />{' '}
                <span className="whitespace-pre-line">{summary}</span>
              </p>
            )}

            {highlights.length > 0 && (
              <section
                className={twMerge('flex flex-col gap-3', styles.rise)}
                style={riseDelay(++order)}
              >
                <SectionTitle>이런 점이 좋아요</SectionTitle>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {highlights.map((h, index) => (
                    <li
                      key={h.title}
                      className="border-neutral-85 hover:border-primary-30 rounded-md border p-3 transition-colors"
                    >
                      <span className="text-xxsmall12 text-primary font-extrabold">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="text-xsmall14 text-neutral-0 mt-1 font-semibold leading-snug">
                        {h.title}
                      </p>
                      {h.description && (
                        <p className="text-xxsmall12 text-neutral-40 mt-1 line-clamp-3">
                          {h.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {steps.length > 0 && (
              <section
                className={twMerge('flex flex-col gap-3', styles.rise)}
                style={riseDelay(++order)}
              >
                <SectionTitle>{stepsTitle}</SectionTitle>
                <ol className="border-primary-20 ml-1.5 flex flex-col gap-3 border-l-2 pl-4">
                  {steps.map((step, index) => (
                    <li key={`${step.label}-${index}`} className="relative">
                      <span className="bg-primary absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 border-white" />
                      <span className="text-xxsmall12 text-primary font-semibold">
                        {step.label}
                      </span>
                      <p className="text-xsmall14 text-neutral-10 font-medium">
                        {step.title}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section
              className={twMerge('flex flex-col gap-3', styles.rise)}
              style={riseDelay(++order)}
            >
              <SectionTitle>
                수강생 후기
                {reviews.length > 0 && (
                  <span className="text-primary font-semibold">
                    {reviews.length}
                  </span>
                )}
              </SectionTitle>
              {reviews.length === 0 ? (
                <p className="bg-neutral-95 text-xxsmall12 text-neutral-45 rounded-md px-4 py-5 text-center">
                  아직 등록된 후기가 없어요.
                </p>
              ) : (
                <ul className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 md:-mx-5 md:px-5">
                  {reviews.map((review, index) => (
                    <li
                      key={index}
                      className="from-primary-5 border-primary-10 flex w-[82%] shrink-0 snap-start flex-col rounded-md border bg-gradient-to-b to-white p-4"
                    >
                      <Quote
                        size={18}
                        className="text-primary-40 fill-primary-20"
                      />
                      {review.title && (
                        <p className="text-xsmall14 text-neutral-0 mt-2 line-clamp-2 font-bold">
                          {review.title}
                        </p>
                      )}
                      <p className="text-xsmall14 text-neutral-20 mt-1.5 line-clamp-5">
                        {review.content}
                      </p>
                      {(review.author || review.meta) && (
                        <p className="text-xxsmall12 text-neutral-45 mt-auto line-clamp-1 pt-3">
                          {[review.author, review.meta]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>

        {/* 하단 고정 CTA: 가격을 다시 보여주며 상세로 */}
        <div className="border-neutral-85 border-t bg-white p-3">
          <Link
            href={item.href}
            className={twMerge(
              'ai_chat_detail_cta text-xsmall14 md:text-xsmall16 from-primary flex items-center justify-between gap-2 rounded-md bg-gradient-to-r to-[#7B61FF] px-4 py-3.5 font-semibold text-white shadow-[0_8px_20px_-8px_rgba(77,85,245,0.7)] transition-transform hover:-translate-y-0.5',
              styles.shine,
            )}
            data-url={item.href}
            data-text={item.title}
          >
            <span>{price ? `${formatWon(price.selling)}` : '자세히 보기'}</span>
            <span className="flex items-center gap-1">
              자세히 보고 신청하기
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
