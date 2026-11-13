import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { AI_CHAT_KIND_LABEL } from '../constants/aiChat';
import { AiChatItem } from '../types/aiChat';
import ProgramMeta from './ProgramMeta';

const RecommendPanel = ({ items }: { items: AiChatItem[] }) => {
  // 프로그램을 먼저, 블로그는 맨 뒤로. 같은 종류 안에서는 관련도 순서를 유지한다
  const sorted = [
    ...items.filter((item) => item.kind !== 'BLOG'),
    ...items.filter((item) => item.kind === 'BLOG'),
  ];

  return (
    <div className="flex min-h-0 flex-col md:h-full">
      <h3 className="text-xsmall16 text-neutral-0 md:text-small18 font-bold">
        AI 추천 프로그램
      </h3>
      <ul className="mt-3 flex min-h-0 flex-col gap-2.5 md:flex-1 md:overflow-y-auto">
        {sorted.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className="ai_chat_recommend border-neutral-85 hover:border-primary flex gap-3 rounded-sm border bg-white p-3 transition-colors"
              data-url={item.href}
              data-text={item.title}
            >
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt=""
                  className="rounded-xs h-16 w-16 shrink-0 object-cover"
                />
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-xxsmall12 text-primary font-semibold">
                  {AI_CHAT_KIND_LABEL[item.kind] ?? item.kind}
                </span>
                <span className="text-xsmall14 text-neutral-0 line-clamp-2 font-semibold">
                  {item.title}
                </span>
                {item.kind === 'BLOG' ? (
                  <span className="text-xxsmall12 text-neutral-40 line-clamp-1">
                    {item.description}
                  </span>
                ) : (
                  <ProgramMeta item={item} />
                )}
              </div>
              <span className="text-xxsmall12 text-primary flex shrink-0 items-center self-center font-semibold">
                바로가기
                <ChevronRight size={14} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendPanel;
