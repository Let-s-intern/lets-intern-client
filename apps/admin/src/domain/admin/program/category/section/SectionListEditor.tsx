import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { CARD_STYLE_LABEL, cardStyleOf } from '../constants/cardStyle';
import {
  useCreateDefaultSections,
  useProgramCategorySectionsQuery,
  useReplaceProgramCategorySections,
  type ProgramCategory,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import CompactRow from '../ui/CompactRow';
import { tagLabelOf } from '../utils/tagUtils';
import SectionForm from './SectionForm';
import {
  describeCondition,
  fromSection,
  moveItem,
  newSection,
  sectionError,
  toSectionInput,
  type SectionDraft,
} from './sectionDraft';

/**
 * 분류 페이지의 섹션들. 위에서부터 화면 순서다. 고친 내용은 모아 두었다가 "변경 사항 저장"으로 한 번에 보낸다
 * (서버는 섹션을 통째로 바꾼다)
 */
const SectionListEditor = ({
  tag,
  groups,
}: {
  tag: ProgramCategory;
  groups: ProgramCategoryGroup[];
}) => {
  const { snackbar } = useAdminSnackbar();
  const { data: saved, isLoading } = useProgramCategorySectionsQuery(tag.id);
  const replace = useReplaceProgramCategorySections();
  const createDefaults = useCreateDefaultSections();
  const [drafts, setDrafts] = useState<SectionDraft[]>([]);
  const [dirty, setDirty] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const labelOf = tagLabelOf(groups);

  const reset = () => {
    setDrafts((saved ?? []).map(fromSection));
    setDirty(false);
    setSubmitted(false);
  };
  // 저장된 값이 바뀌면(처음 받음·저장 뒤) 초안을 다시 맞춘다
  useEffect(reset, [saved]);

  const update = (next: SectionDraft[]) => {
    setDrafts(next);
    setDirty(true);
  };
  const patchAt = (index: number, d: SectionDraft) =>
    update(drafts.map((x, i) => (i === index ? d : x)));
  const errors = drafts.map(sectionError);

  const save = async () => {
    setSubmitted(true);
    const firstError = errors.findIndex(Boolean);
    if (firstError >= 0) {
      setOpenKey(drafts[firstError].key);
      return;
    }
    try {
      await replace.mutateAsync({
        id: tag.id,
        sectionList: drafts.map(toSectionInput),
      });
      snackbar('저장했습니다.');
    } catch {
      snackbar('저장에 실패했습니다.');
    }
  };

  if (isLoading)
    return <p className="text-xsmall14 text-neutral-40">불러오는 중…</p>;

  if (drafts.length === 0 && !dirty)
    return (
      <div className="flex flex-col items-start gap-2 rounded-xs bg-neutral-95 p-4">
        <p className="text-xsmall14 text-neutral-20">
          아직 섹션이 없어요. 기본 섹션(대표 챌린지 · LIVE·VOD · 자료집 · 1:1
          멘토링 · 블로그)으로 시작하거나 직접 추가하세요.
        </p>
        <div className="flex gap-2">
          <Button
            variant="contained"
            size="small"
            disabled={createDefaults.isPending}
            onClick={() =>
              createDefaults
                .mutateAsync(tag.id)
                .catch(() => snackbar('만들지 못했습니다.'))
            }
          >
            기본 섹션 만들기
          </Button>
          <Button size="small" onClick={() => update([newSection(tag.id)])}>
            + 섹션 추가
          </Button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-1">
      <ul className="flex flex-col">
        {drafts.map((d, index) => (
          <li key={d.key}>
            <CompactRow
              title={d.title || '(제목 없음)'}
              caption={[
                CARD_STYLE_LABEL[cardStyleOf(d.displayType)],
                describeCondition(
                  d,
                  (id) => labelOf.get(id)?.split(' > ').pop() ?? `#${id}`,
                ),
                d.targetList.length > 0
                  ? `직접 ${d.targetList.length}개`
                  : null,
              ]
                .filter(Boolean)
                .join(' · ')}
              active={openKey === d.key}
              onClick={() => setOpenKey((k) => (k === d.key ? null : d.key))}
              isVisible={d.isVisible}
              isFirst={index === 0}
              isLast={index === drafts.length - 1}
              renameLabel="섹션 제목"
              onRename={(title) => patchAt(index, { ...d, title })}
              onToggleVisible={(isVisible) =>
                patchAt(index, { ...d, isVisible })
              }
              onMove={(direction) => update(moveItem(drafts, index, direction))}
              menuItems={[
                {
                  label: '섹션 삭제',
                  danger: true,
                  onClick: () => update(drafts.filter((_, i) => i !== index)),
                },
              ]}
            />
            {submitted && errors[index] && (
              <p className="ml-3 text-xxsmall12 text-red-500">
                {errors[index]}
              </p>
            )}
            {openKey === d.key && (
              <SectionForm
                value={d}
                onChange={(next) => patchAt(index, next)}
                groups={groups}
              />
            )}
          </li>
        ))}
      </ul>
      <div>
        <Button
          size="small"
          onClick={() => {
            const d = newSection(tag.id);
            update([...drafts, d]);
            setOpenKey(d.key);
          }}
        >
          + 섹션 추가
        </Button>
      </div>
      {dirty && (
        <div className="sticky bottom-0 mt-2 flex items-center gap-2 border-t border-neutral-90 bg-white py-2">
          <span className="text-xsmall14 text-neutral-30">
            저장하지 않은 변경이 있어요.
          </span>
          <Button
            variant="contained"
            size="small"
            disabled={replace.isPending}
            onClick={save}
          >
            변경 사항 저장
          </Button>
          <Button size="small" onClick={reset}>
            되돌리기
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectionListEditor;
