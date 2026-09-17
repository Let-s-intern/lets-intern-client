import { PassBenefit } from '@/domain/all-in-one-pass/types';
import BenefitModal from '@/domain/all-in-one-pass/ui/benefit/BenefitModal';
import { CategoryTabs } from '@letscareer/ui';
import { Button, Switch } from '@mui/material';
import { Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';
import { FiImage } from 'react-icons/fi';

export const createEmptyBenefit = (): PassBenefit => ({
  id: crypto.randomUUID(),
  isVisible: true,
  category: '',
  thumbnailUrl: null,
  title: '',
  description: '',
});

const ALL = '';

interface Props {
  benefits: PassBenefit[];
  onChange: (benefits: PassBenefit[]) => void;
}

/** 1.6 혜택: 카테고리 탭 + 리스트(노출 토글·썸네일·제목·설명·수정/삭제) + 추가/수정 모달 */
export default function BenefitSection({ benefits, onChange }: Props) {
  const [editing, setEditing] = useState<{
    benefit: PassBenefit;
    isEdit: boolean;
  } | null>(null);
  const [tab, setTab] = useState<string>(ALL);

  const categories = useMemo(
    () => Array.from(new Set(benefits.map((b) => b.category).filter(Boolean))),
    [benefits],
  );
  const tabOptions = [
    { value: ALL, label: '전체' },
    ...categories.map((c) => ({ value: c, label: c })),
  ];
  const visibleTab = categories.includes(tab) ? tab : ALL;
  const filtered =
    visibleTab === ALL
      ? benefits
      : benefits.filter((b) => b.category === visibleTab);

  const update = (id: string, partial: Partial<PassBenefit>) =>
    onChange(benefits.map((b) => (b.id === id ? { ...b, ...partial } : b)));

  const handleSave = (saved: PassBenefit) => {
    onChange(
      benefits.some((b) => b.id === saved.id)
        ? benefits.map((b) => (b.id === saved.id ? saved : b))
        : [...benefits, saved],
    );
    setEditing(null);
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-small20 text-neutral-0 font-semibold">기타 혜택</h2>

      <div className="flex items-center justify-between gap-3">
        <CategoryTabs
          options={tabOptions}
          selected={visibleTab}
          onChange={setTab}
        />
        <Button
          variant="outlined"
          size="medium"
          className="shrink-0"
          sx={{ borderStyle: 'dashed' }}
          startIcon={<FaPlus size={12} />}
          onClick={() =>
            setEditing({ benefit: createEmptyBenefit(), isEdit: false })
          }
        >
          혜택 추가
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xsmall14 text-neutral-40 py-20 text-center">
          기타 혜택이 존재하지 않습니다.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((benefit) => (
            <div
              key={benefit.id}
              className="border-neutral-80 flex overflow-hidden rounded-md border"
            >
              <div className="flex flex-1 gap-3 p-4">
                <div className="bg-neutral-95 flex aspect-[4/3] w-32 shrink-0 items-center justify-center overflow-hidden rounded">
                  {benefit.thumbnailUrl ? (
                    <img
                      src={benefit.thumbnailUrl}
                      alt="썸네일"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <FiImage className="text-neutral-40 text-2xl" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <span className="text-xsmall16 text-neutral-0 truncate font-medium">
                      {benefit.title || '(제목 없음)'}
                    </span>
                    {benefit.description && (
                      <span className="text-xsmall14 text-neutral-40 line-clamp-2">
                        {benefit.description}
                      </span>
                    )}
                  </div>
                  <Switch
                    size="small"
                    className="-mr-1.5 self-end"
                    checked={benefit.isVisible}
                    onChange={(e) =>
                      update(benefit.id, { isVisible: e.target.checked })
                    }
                  />
                </div>
              </div>

              {/* 오른쪽 세로 스트립: 위 수정 · 아래 삭제 */}
              <div className="divide-neutral-80 border-neutral-80 flex w-11 shrink-0 flex-col divide-y border-l">
                <button
                  type="button"
                  aria-label="수정"
                  onClick={() => setEditing({ benefit, isEdit: true })}
                  className="text-neutral-40 hover:bg-neutral-95 hover:text-neutral-0 flex flex-1 items-center justify-center transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  aria-label="삭제"
                  onClick={() =>
                    onChange(benefits.filter((b) => b.id !== benefit.id))
                  }
                  className="text-neutral-40 hover:bg-system-error/10 hover:text-system-error flex flex-1 items-center justify-center transition-colors"
                >
                  <FaTrashCan size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BenefitModal
        benefit={editing?.benefit ?? null}
        isEdit={editing?.isEdit ?? false}
        existingCategories={benefits.map((b) => b.category)}
        onSave={handleSave}
        onClose={() => setEditing(null)}
      />
    </section>
  );
}
