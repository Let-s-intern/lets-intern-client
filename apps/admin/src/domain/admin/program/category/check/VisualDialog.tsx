import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import {
  programCategoryTargetTypeLabel,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import type { PreviewHighlight } from '../preview/ui/LandingPreview';
import MiniGnb from '../preview/ui/MiniGnb';
import TagLandingPreview from '../preview/ui/TagLandingPreview';
import { siteMenuOf, tagsOf } from '../utils/tagUtils';
import MiniProgramFilter from './MiniProgramFilter';

/** 점검에서 누른 곳을 사이트 모습으로 보여 줄 대상 */
export type Visual =
  | { kind: 'landing'; tagId: number; highlight?: PreviewHighlight }
  | { kind: 'filter'; tagId: number; highlight?: PreviewHighlight['target'] }
  | { kind: 'menu'; slug: string };

const titleOf = (visual: Visual, groups: ProgramCategoryGroup[]) => {
  const tag =
    'tagId' in visual
      ? tagsOf(groups).find((t) => t.tag.id === visual.tagId)
      : null;
  if (visual.kind === 'landing')
    return `/category/${tag?.tag.slug ?? '?'} 페이지`;
  if (visual.kind === 'filter')
    return `/program 필터 · ${tag?.row.title} > ${tag?.tag.title}`;
  return `GNB 메뉴 · ${visual.slug}`;
};

/** 메뉴 항목: 드롭다운에서 그 항목을 칠하고, 화살표 다음에 가는 곳 */
const MenuVisual = ({
  slug,
  groups,
}: {
  slug: string;
  groups: ProgramCategoryGroup[];
}) => {
  const tag = tagsOf(groups).find((t) => t.tag.slug === slug)?.tag;
  const direct = tag?.directTargetType && tag.directTargetId;
  return (
    <div className="flex flex-col gap-4">
      <MiniGnb menu={siteMenuOf(groups)} slug={slug} />
      <p className="text-small18 text-neutral-50">↓</p>
      {direct ? (
        <p className="rounded-xs bg-neutral-95 p-4 text-xsmall14">
          누르면 상품 상세로 바로 가요 ·{' '}
          {programCategoryTargetTypeLabel[tag.directTargetType!]} #
          {tag.directTargetId}
        </p>
      ) : tag ? (
        <TagLandingPreview tag={tag} groups={groups} />
      ) : (
        <p className="rounded-xs bg-neutral-95 p-4 text-xsmall14">
          /category/{slug} 에 맞는 분류가 없어 사이트에는 예전 랜딩(있다면) 또는
          &quot;준비 중&quot; 화면이 보여요.
        </p>
      )}
    </div>
  );
};

/** 큰 창으로 사이트 모습을 보여 준다. 짚은 섹션·상품은 칠하고 그 자리로 스크롤한다 */
const VisualDialog = ({
  visual,
  groups,
  onClose,
}: {
  visual: Visual;
  groups: ProgramCategoryGroup[];
  onClose: () => void;
}) => {
  const tag =
    'tagId' in visual
      ? tagsOf(groups).find((t) => t.tag.id === visual.tagId)?.tag
      : undefined;
  return (
    <Dialog open onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        {titleOf(visual, groups)}
        <IconButton aria-label="닫기" onClick={onClose}>
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {visual.kind === 'landing' && tag && (
          <TagLandingPreview
            tag={tag}
            groups={groups}
            highlight={visual.highlight}
          />
        )}
        {visual.kind === 'filter' && (
          <MiniProgramFilter
            groups={groups}
            tagId={visual.tagId}
            highlight={visual.highlight}
          />
        )}
        {visual.kind === 'menu' && (
          <MenuVisual slug={visual.slug} groups={groups} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VisualDialog;
