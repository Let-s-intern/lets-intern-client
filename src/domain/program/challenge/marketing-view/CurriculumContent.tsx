import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ChallengeContent, ChallengeCurriculum } from '@/types/interface';
import { ReactNode } from 'react';

export interface WeekGroup {
  week: string;
  weekTitle: string;
  startDate?: string;
  endDate?: string;
  items: ChallengeCurriculum[];
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
        ? 'bg-[#FFF0F4]'
        : 'bg-transparent';

  const textStyle = hasHighlightColor
    ? 'text-xsmall16 font-semibold md:text-small18'
    : 'text-xxsmall12 text-neutral-0 md:text-xsmall16';

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

export const CurriculumContent = ({ weekGroup }: { weekGroup: WeekGroup }) => {
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

export const getCurriculumGroupedByWeek = (
  curriculum: ChallengeCurriculum[] | undefined,
  content?: ChallengeContent,
): WeekGroup[] => {
  if (!curriculum || curriculum.length === 0) {
    return [];
  }

  if (!content?.useWeekSettings || !content.weekTitles?.length) {
    return [
      {
        week: '',
        weekTitle: '',
        startDate: '',
        endDate: '',
        items: curriculum,
      },
    ];
  }

  const weekMap = new Map<string, WeekGroup>();

  content.weekTitles.forEach((weekTitle) => {
    weekMap.set(weekTitle.week, {
      week: weekTitle.week,
      weekTitle: weekTitle.weekTitle,
      startDate: weekTitle.startDate,
      endDate: weekTitle.endDate,
      items: [],
    });
  });

  curriculum.forEach((item) => {
    if (item.week && weekMap.has(item.week)) {
      weekMap.get(item.week)!.items.push(item);
    } else {
      const firstWeek = Array.from(weekMap.values())[0];
      if (firstWeek) {
        firstWeek.items.push(item);
      }
    }
  });

  return Array.from(weekMap.values());
};
