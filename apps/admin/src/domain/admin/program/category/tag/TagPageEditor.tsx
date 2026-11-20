import { Button } from '@mui/material';
import { useState } from 'react';
import { siteUrl } from '../constants/webMenu';
import type {
  ProgramCategory,
  ProgramCategoryGroup,
} from '../programCategoryApi';
import TagLandingPreview from '../preview/ui/TagLandingPreview';
import SectionListEditor from '../section/SectionListEditor';
import { menuEntriesTo } from '../utils/tagUtils';
import PageSettingsDialog from './PageSettingsDialog';

const VIEWS = [
  { key: 'edit', label: '편집' },
  { key: 'preview', label: '미리보기' },
] as const;

/** 고른 분류의 페이지. 머리 한 줄, 그 아래 편집 | 미리보기 */
const TagPageEditor = ({
  tag,
  groups,
}: {
  tag: ProgramCategory;
  groups: ProgramCategoryGroup[];
}) => {
  const [view, setView] = useState<(typeof VIEWS)[number]['key']>('edit');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const entries = tag.slug ? menuEntriesTo(groups, tag.slug) : [];

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 className="text-small18 font-bold">{tag.title}</h3>
        {tag.slug ? (
          <a
            href={siteUrl(`/category/${tag.slug}`)}
            target="_blank"
            rel="noreferrer"
            className="text-xsmall14 text-primary hover:underline"
          >
            /category/{tag.slug}
          </a>
        ) : (
          <span className="text-xsmall14 text-neutral-50">주소 없음</span>
        )}
        <Button size="small" onClick={() => setSettingsOpen(true)}>
          페이지 설정
        </Button>
        <span className="text-xxsmall12 text-neutral-40">
          {entries.length > 0 ? `메뉴: ${entries.join(', ')}` : '메뉴에 없음'} ·
          상품 {tag.programCount}
        </span>
      </header>
      {settingsOpen && (
        <PageSettingsDialog
          tag={tag}
          groups={groups}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      <div className="flex gap-4 border-b border-neutral-90">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            className={`-mb-px border-b-2 pb-1.5 text-xsmall14 font-semibold ${
              view === v.key
                ? 'border-neutral-0 text-neutral-0'
                : 'border-transparent text-neutral-40'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      {view === 'edit' ? (
        <SectionListEditor tag={tag} groups={groups} />
      ) : (
        <TagLandingPreview tag={tag} groups={groups} />
      )}
    </section>
  );
};

export default TagPageEditor;
