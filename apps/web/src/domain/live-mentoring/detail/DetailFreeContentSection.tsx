import type {
  LiveMentorDetail,
  LiveMentoringFreeContentPosition,
} from '@/api/live-mentoring/liveMentoringSchema';
import LexicalContent from '@/common/lexical/LexicalContent';

import { parseLexicalRoot } from './utils/parseLexicalRoot';

type NodeWithChildren = { type: string; children?: NodeWithChildren[] };

/** 에디터를 열었다 닫기만 하면 빈 문단 하나짜리 본문이 저장된다. 그것도 비어 있는 것으로 본다 */
const isEmptyRoot = (root: NodeWithChildren) =>
  (root.children ?? []).every(
    (child) => child.type === 'paragraph' && !child.children?.length,
  );

/** 위치를 저장한 적 없으면 서버 기본값과 같은 자리에 둔다 */
const DEFAULT_POSITION: LiveMentoringFreeContentPosition =
  'AFTER_MENTORING_TYPES';

interface DetailFreeContentSectionProps {
  freeContent: LiveMentorDetail['template']['freeContent'];
  /** 이 슬롯의 자리. 자유 입력란의 위치가 같을 때만 그린다 */
  at: LiveMentoringFreeContentPosition;
}

/**
 * 자유 입력란 — 운영이 어드민에서 넣는 글·이미지(LC-3494, LC-3495).
 *
 * 페이지는 섹션마다 이 슬롯을 하나씩 두고, 위치가 맞는 슬롯 하나만 그려진다.
 * 꺼져 있거나, 본문이 비었거나, Lexical JSON 이 아니면 아무것도 그리지 않는다.
 */
const DetailFreeContentSection = ({
  freeContent,
  at,
}: DetailFreeContentSectionProps) => {
  if (!freeContent?.visible) return null;
  if ((freeContent.position ?? DEFAULT_POSITION) !== at) return null;

  const root = parseLexicalRoot(freeContent.content);
  if (!root || isEmptyRoot(root as NodeWithChildren)) return null;

  return (
    <section
      data-free-content={at}
      className="relative w-full bg-white py-16 md:py-24"
    >
      <div className="mw-1180 px-5">
        <LexicalContent node={root} />
      </div>
    </section>
  );
};

export default DetailFreeContentSection;
