import { PassFaq } from '@/domain/all-in-one-pass/types';
import FaqModal from '@/domain/all-in-one-pass/ui/faq/FaqModal';
import { CategoryTabs } from '@letscareer/ui';
import { Button } from '@mui/material';
import { Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';

export const createEmptyFaq = (): PassFaq => ({
  id: crypto.randomUUID(),
  category: '',
  question: '',
  answer: '',
});

const ALL = '';

interface Props {
  faqs: PassFaq[];
  onChange: (faqs: PassFaq[]) => void;
}

/** 1.7 FAQ: 카테고리 탭 + 리스트(질문·답변·수정/삭제) + 추가/수정 모달 */
export default function FaqSection({ faqs, onChange }: Props) {
  const [editing, setEditing] = useState<{
    faq: PassFaq;
    isEdit: boolean;
  } | null>(null);
  const [tab, setTab] = useState<string>(ALL);

  const categories = useMemo(
    () => Array.from(new Set(faqs.map((f) => f.category).filter(Boolean))),
    [faqs],
  );
  const tabOptions = [
    { value: ALL, label: '전체' },
    ...categories.map((c) => ({ value: c, label: c })),
  ];
  const visibleTab = categories.includes(tab) ? tab : ALL;
  const filtered =
    visibleTab === ALL ? faqs : faqs.filter((f) => f.category === visibleTab);

  const handleSave = (saved: PassFaq) => {
    onChange(
      faqs.some((f) => f.id === saved.id)
        ? faqs.map((f) => (f.id === saved.id ? saved : f))
        : [...faqs, saved],
    );
    setEditing(null);
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-small20 text-neutral-0 font-semibold">FAQ</h2>

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
          onClick={() => setEditing({ faq: createEmptyFaq(), isEdit: false })}
        >
          FAQ 추가
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xsmall14 text-neutral-40 py-20 text-center">
          등록된 FAQ가 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((faq) => (
            <div
              key={faq.id}
              className="border-neutral-80 flex overflow-hidden rounded-md border"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1 p-4">
                {faq.category && (
                  <span className="text-xxsmall12 text-primary font-medium">
                    {faq.category}
                  </span>
                )}
                <span className="text-xsmall16 text-neutral-0 font-medium">
                  Q. {faq.question || '(질문 없음)'}
                </span>
                {faq.answer && (
                  <span className="text-xsmall14 text-neutral-40 whitespace-pre-wrap">
                    A. {faq.answer}
                  </span>
                )}
              </div>

              {/* 오른쪽 세로 스트립: 위 수정 · 아래 삭제 */}
              <div className="divide-neutral-80 border-neutral-80 flex w-11 shrink-0 flex-col divide-y border-l">
                <button
                  type="button"
                  aria-label="수정"
                  onClick={() => setEditing({ faq, isEdit: true })}
                  className="text-neutral-40 hover:bg-neutral-95 hover:text-neutral-0 flex flex-1 items-center justify-center transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  aria-label="삭제"
                  onClick={() => onChange(faqs.filter((f) => f.id !== faq.id))}
                  className="text-neutral-40 hover:bg-system-error/10 hover:text-system-error flex flex-1 items-center justify-center transition-colors"
                >
                  <FaTrashCan size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FaqModal
        faq={editing?.faq ?? null}
        isEdit={editing?.isEdit ?? false}
        existingCategories={faqs.map((f) => f.category)}
        onSave={handleSave}
        onClose={() => setEditing(null)}
      />
    </section>
  );
}
