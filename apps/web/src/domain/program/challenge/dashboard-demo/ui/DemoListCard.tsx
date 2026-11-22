import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface Props {
  title: string;
  items: { id: number; title: string }[];
  onLocked: () => void;
  className?: string;
  /** 카드 위에 붙는 안내 말풍선 */
  tip?: ReactNode;
}

/** 대시보드의 공지사항·챌린지 가이드 카드 모양. 실제 카드는 외부 링크로 나가서 복사했다. */
const DemoListCard = ({ title, items, onLocked, className, tip }: Props) => (
  <section
    className={clsx(
      'relative flex flex-col gap-3 rounded-xs border border-[#E4E4E7] p-4',
      className,
    )}
  >
    {tip}
    <div className="flex items-center justify-between">
      <h2 className="font-semibold text-[#4A495C]">{title}</h2>
      <button
        type="button"
        onClick={onLocked}
        aria-label={`${title} 전체 보기`}
      >
        <ChevronRight width={20} height={20} color="#989BA2" />
      </button>
    </div>
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={onLocked}
            className="block w-full truncate text-left text-sm text-[#333333] hover:underline"
          >
            {item.title}
          </button>
        </li>
      ))}
    </ul>
  </section>
);

export default DemoListCard;
