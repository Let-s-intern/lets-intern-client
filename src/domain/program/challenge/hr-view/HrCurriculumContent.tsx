import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ChallengeCurriculum } from '@/types/interface';
import { ReactNode } from 'react';

interface WeekGroup {
  week: string;
  weekTitle: string;
  startDate?: string;
  endDate?: string;
  items: ChallengeCurriculum[];
}

interface HrCurriculumContentProps {
  weekGroup: WeekGroup;
}

function Description({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center">
      <p className="whitespace-pre-line break-words text-xxsmall12 text-neutral-0 md:text-xsmall16">
        {children}
      </p>
    </div>
  );
}

function Highlight({
  contentImg,
  contentHighlightColor,
  description,
  className,
}: {
  contentImg?: string;
  contentHighlightColor?: 'none' | 'gray' | 'accent';
  description: ReactNode;
  className?: string;
}) {
  const hasHighlightColor =
    contentHighlightColor && contentHighlightColor !== 'none';

  const bgColorClass =
    contentHighlightColor === 'gray'
      ? 'bg-neutral-90'
      : contentHighlightColor === 'accent'
        ? 'bg-orange-50'
        : 'bg-transparent';

  const textStyle = hasHighlightColor
    ? 'text-xsmall16 font-semibold md:text-small18'
    : 'text-xxsmall12 text-neutral-0 md:text-xsmall16';

  // 강조 색상이 있을 때만 padding 적용
  const paddingClass = hasHighlightColor ? 'px-3 py-2.5' : '';

  return (
    <div
      className={twMerge(
        'flex w-full max-w-full flex-col gap-2.5 rounded-xs text-neutral-0 md:mt-2',
        bgColorClass,
        paddingClass,
        className,
      )}
    >
      <p
        className={twMerge(
          textStyle,
          'min-w-0 whitespace-pre-line break-words',
        )}
      >
        {contentImg && (
          <img
            src={contentImg}
            alt=""
            className="mb-1 mr-2 inline-block h-5 align-top md:h-7"
          />
        )}
        {description}
      </p>
    </div>
  );
}

const HrCurriculumContent = ({ weekGroup }: HrCurriculumContentProps) => {
  const isLastItem = (index: number) => index === weekGroup.items.length - 1;

  return (
    <ul className="w-full min-w-0">
      {weekGroup.items.map((item, index) => {
        const dateRange = `${dayjs(item.startDate).format('M/D')}-${dayjs(item.endDate).format('M/D')}`;
        const hasHighlight =
          item.contentHighlightColor && item.contentHighlightColor !== 'none';
        const hasContentImg = !!item.contentImg;

        return (
          <li key={item.id} className="flex w-full min-w-0 flex-col gap-1">
            <div className="flex min-w-0 items-center gap-2 text-xsmall14 font-semibold text-neutral-0 md:text-small18">
              {dateRange && <span className="flex-shrink-0">{dateRange}</span>}
              <h4 className="min-w-0 break-words">
                {item.session} {item.title}
              </h4>
            </div>
            {hasHighlight || hasContentImg ? (
              <Highlight
                contentImg={item.contentImg}
                contentHighlightColor={item.contentHighlightColor}
                description={item.content}
              />
            ) : (
              <Description>{item.content}</Description>
            )}
            {!isLastItem(index) && (
              <hr className="my-2 border-t border-neutral-80 md:my-[14px]" />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default HrCurriculumContent;
