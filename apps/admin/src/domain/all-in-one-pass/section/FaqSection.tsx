import { useDeleteFaq, useGetFaq, usePatchFaq, usePostFaq } from '@/api/faq';
import { PassFaq } from '@/domain/all-in-one-pass/types';
import FaqModal from '@/domain/all-in-one-pass/ui/faq/FaqModal';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Faq, ProgramTypeEnum } from '@/schema';
import { CategoryTabs } from '@letscareer/ui';
import { Button, Checkbox } from '@mui/material';
import { Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';

const MEMBERSHIP = ProgramTypeEnum.enum.MEMBERSHIP;
const ALL = '';

interface Props {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

/**
 * 1.7 FAQ: 질문/답변은 전 멤버십 공통 풀(/faq, type=MEMBERSHIP)에서 CRUD 하고,
 * 각 항목의 체크박스로 "이 패스에 노출할" FAQ 를 고른다(챌린지 faqInfo 방식).
 * 선택된 faqId 는 폼(faqList)에 담겨 생성/수정 payload 로 전송된다.
 */
export default function FaqSection({ selectedIds, onChange }: Props) {
  const { snackbar } = useAdminSnackbar();

  const toggle = (id: number, checked: boolean) =>
    onChange(
      checked ? [...selectedIds, id] : selectedIds.filter((v) => v !== id),
    );

  const { data } = useGetFaq(MEMBERSHIP);
  const faqs = useMemo(() => data?.faqList ?? [], [data]);

  const postFaq = usePostFaq();
  const patchFaq = usePatchFaq();
  const deleteFaq = useDeleteFaq();

  const [editing, setEditing] = useState<{
    faq: PassFaq;
    isEdit: boolean;
  } | null>(null);
  const [tab, setTab] = useState<string>(ALL);

  const categories = useMemo(
    () =>
      Array.from(new Set(faqs.map((f) => f.category ?? '').filter(Boolean))),
    [faqs],
  );
  const tabOptions = [
    { value: ALL, label: '전체' },
    ...categories.map((c) => ({ value: c, label: c })),
  ];
  const visibleTab = categories.includes(tab) ? tab : ALL;
  const filtered =
    visibleTab === ALL ? faqs : faqs.filter((f) => f.category === visibleTab);

  const openEdit = (f: Faq) =>
    setEditing({
      faq: {
        id: String(f.id),
        category: f.category ?? '',
        question: f.question ?? '',
        answer: f.answer ?? '',
      },
      isEdit: true,
    });

  const handleSave = async (saved: PassFaq) => {
    try {
      if (editing?.isEdit) {
        await patchFaq.mutateAsync({
          id: Number(saved.id),
          question: saved.question,
          answer: saved.answer,
          category: saved.category,
          faqProgramType: MEMBERSHIP,
        });
        snackbar('수정되었습니다.');
      } else {
        await postFaq.mutateAsync({
          programType: MEMBERSHIP,
          question: saved.question,
          answer: saved.answer,
          category: saved.category,
        });
        snackbar('추가되었습니다.');
      }
      setEditing(null);
    } catch (e) {
      snackbar(e instanceof Error ? e.message : '저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    try {
      await deleteFaq.mutateAsync(id);
      // 삭제된 FAQ가 이 패스에 선택돼 있었다면 선택 목록에서도 제거
      if (selectedIds.includes(id))
        onChange(selectedIds.filter((v) => v !== id));
      snackbar('삭제되었습니다.');
    } catch (e) {
      snackbar(e instanceof Error ? e.message : '삭제에 실패했습니다.');
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-small20 text-neutral-0 font-semibold">FAQ</h2>
        <p className="text-xsmall14 text-neutral-40">
          질문은 전체 멤버십 공통 풀에서 관리하고, 체크한 항목만 이 패스에
          노출됩니다.
        </p>
      </div>

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
            setEditing({
              faq: { id: '', category: '', question: '', answer: '' },
              isEdit: false,
            })
          }
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
              <label className="border-neutral-80 hover:bg-neutral-95 flex shrink-0 cursor-pointer items-center justify-center border-r px-2 transition-colors">
                <Checkbox
                  size="small"
                  checked={selectedIds.includes(faq.id)}
                  onChange={(e) => toggle(faq.id, e.target.checked)}
                />
              </label>
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
                  onClick={() => openEdit(faq)}
                  className="text-neutral-40 hover:bg-neutral-95 hover:text-neutral-0 flex flex-1 items-center justify-center transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  aria-label="삭제"
                  onClick={() => handleDelete(faq.id)}
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
        existingCategories={faqs.map((f) => f.category ?? '')}
        onSave={handleSave}
        onClose={() => setEditing(null)}
      />
    </section>
  );
}
