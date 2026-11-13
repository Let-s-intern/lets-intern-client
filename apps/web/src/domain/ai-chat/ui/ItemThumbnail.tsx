import { twMerge } from '@/lib/twMerge';

import { AI_CHAT_KIND_LABEL } from '../constants/aiChat';
import { AiChatItem } from '../types/aiChat';

/**
 * 추천·비교 카드 썸네일. 이미지가 없으면 멘토링 목록 카드(MentorCard)와 같이
 * 브랜드 컬러 배경에 흰 글자로 채운다. 작은 카드는 종류, 큰 카드는 제목을 쓴다.
 */
const ItemThumbnail = ({
  item,
  size,
  className,
}: {
  item: AiChatItem;
  size: 'sm' | 'lg';
  className?: string;
}) => {
  if (item.thumbnail) {
    return (
      <img
        src={item.thumbnail}
        alt=""
        className={twMerge('object-cover', className)}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={twMerge(
        'bg-primary flex items-center justify-center text-center font-bold text-white',
        size === 'sm' ? 'text-xxsmall12 p-1.5' : 'text-small18 p-4',
        className,
      )}
    >
      <span className="line-clamp-3 break-keep">
        {size === 'sm'
          ? (AI_CHAT_KIND_LABEL[item.kind] ?? item.kind)
          : item.title}
      </span>
    </div>
  );
};

export default ItemThumbnail;
