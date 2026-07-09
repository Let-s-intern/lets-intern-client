import type {
  ChecklistItem,
  LiveMentoringTemplate,
} from '@/api/live-mentoring/liveMentoringSchema';

interface TemplateEditFormProps {
  template: LiveMentoringTemplate;
  onChange: (partial: Partial<LiveMentoringTemplate>) => void;
}

const cardClass = 'rounded-xl border border-gray-200 bg-white p-5 md:p-6';
const titleClass = 'text-base font-semibold text-gray-900';
const textareaClass =
  'focus:border-primary w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-colors';

const CHECKLIST_MODES: { value: ChecklistItem['mode']; label: string }[] = [
  { value: 'SHOWN', label: '노출' },
  { value: 'HIDDEN', label: '비노출' },
  { value: 'CUSTOM', label: '멘토 커스텀' },
];

const ReadOnlyBadge = () => (
  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
    편집 불가
  </span>
);

/**
 * 상세 페이지 템플릿 편집 폼.
 * 편집 가능: 자기소개 / 이력(노출) / 멘토링 포인트 / 후기 노출 / 체크리스트(3모드).
 * 편집 불가(read-only 렌더): FAQ / 피드백 과정 / 제출물 설정.
 */
const TemplateEditForm = ({ template, onChange }: TemplateEditFormProps) => {
  const toggleCareer = (index: number) =>
    onChange({
      careers: template.careers.map((c, i) =>
        i === index ? { ...c, visible: !c.visible } : c,
      ),
    });

  const updateChecklist = (id: number, partial: Partial<ChecklistItem>) =>
    onChange({
      checklist: template.checklist.map((item) =>
        item.id === id ? { ...item, ...partial } : item,
      ),
    });

  const removeReview = (reviewId: number) =>
    onChange({
      reviews: {
        ...template.reviews,
        selectedReviewIds: template.reviews.selectedReviewIds.filter(
          (id) => id !== reviewId,
        ),
      },
    });

  return (
    <div className="flex flex-col gap-6">
      {/* 자기소개 (편집 가능) */}
      <section className={cardClass}>
        <h2 className={`mb-4 ${titleClass}`}>멘토 자기소개</h2>
        <textarea
          aria-label="멘토 자기소개"
          value={template.introduction}
          onChange={(e) => onChange({ introduction: e.target.value })}
          className={`h-28 ${textareaClass}`}
        />
      </section>

      {/* 이력 (편집 가능 — 노출 선택) */}
      <section className={cardClass}>
        <h2 className={`mb-4 ${titleClass}`}>이력 (노출 선택)</h2>
        {template.careers.length === 0 ? (
          <p className="text-sm text-gray-500">등록된 이력이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {template.careers.map((career, index) => (
              <li key={`${career.company}-${index}`}>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={career.visible}
                    onChange={() => toggleCareer(index)}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">
                    {career.company} · {career.position} ({career.period})
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 멘토링 포인트 (편집 가능) */}
      <section className={cardClass}>
        <h2 className={`mb-4 ${titleClass}`}>멘토링 포인트</h2>
        <textarea
          aria-label="멘토링 포인트"
          value={template.mentoringPoints}
          onChange={(e) => onChange({ mentoringPoints: e.target.value })}
          className={`h-24 ${textareaClass}`}
        />
      </section>

      {/* 후기 (편집 가능 — 노출 여부 + 선택) */}
      <section className={cardClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={titleClass}>후기</h2>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={template.reviews.visible}
              onChange={(e) =>
                onChange({
                  reviews: {
                    ...template.reviews,
                    visible: e.target.checked,
                  },
                })
              }
              className="accent-primary h-4 w-4"
            />
            <span className="text-sm text-gray-700">후기 노출</span>
          </label>
        </div>
        {template.reviews.selectedReviewIds.length === 0 ? (
          <p className="text-sm text-gray-500">선택된 후기가 없습니다.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {template.reviews.selectedReviewIds.map((reviewId) => (
              <li key={reviewId}>
                <button
                  type="button"
                  onClick={() => removeReview(reviewId)}
                  className="bg-primary-5 text-primary flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                  aria-label={`후기 ${reviewId} 선택 해제`}
                >
                  후기 #{reviewId}
                  <span aria-hidden>×</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 체크리스트 (편집 가능 — 3모드) */}
      <section className={cardClass}>
        <h2 className={`mb-4 ${titleClass}`}>멘티 제출물 체크리스트</h2>
        <ul className="flex flex-col gap-4">
          {template.checklist.map((item) => (
            <li key={item.id} className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
              <div
                role="radiogroup"
                aria-label={`${item.label} 노출 모드`}
                className="flex gap-2"
              >
                {CHECKLIST_MODES.map((mode) => {
                  const active = item.mode === mode.value;
                  return (
                    <button
                      key={mode.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => updateChecklist(item.id, { mode: mode.value })}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${active ? 'border-primary bg-primary-5 text-primary' : 'border-gray-200 text-gray-600'}`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
              {item.mode === 'CUSTOM' && (
                <input
                  type="text"
                  aria-label={`${item.label} 커스텀 문구`}
                  value={item.customText ?? ''}
                  onChange={(e) =>
                    updateChecklist(item.id, { customText: e.target.value })
                  }
                  placeholder="멘토가 직접 표시할 문구를 입력하세요"
                  className="focus:border-primary rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors"
                />
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* ── 편집 불가 영역 (read-only 렌더) ── */}
      <section className={cardClass}>
        <div className="mb-4 flex items-center gap-2">
          <h2 className={titleClass}>피드백 과정</h2>
          <ReadOnlyBadge />
        </div>
        <ol className="flex flex-col gap-2">
          {template.process.map((step) => (
            <li key={step.step} className="text-sm text-gray-600">
              {step.step}. {step.title} — {step.desc}
            </li>
          ))}
        </ol>
      </section>

      <section className={cardClass}>
        <div className="mb-4 flex items-center gap-2">
          <h2 className={titleClass}>제출물 설정</h2>
          <ReadOnlyBadge />
        </div>
        <p className="text-sm font-medium text-gray-800">
          {template.submissionSpec.title}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {template.submissionSpec.desc}
        </p>
      </section>

      <section className={cardClass}>
        <div className="mb-4 flex items-center gap-2">
          <h2 className={titleClass}>자주 묻는 질문</h2>
          <ReadOnlyBadge />
        </div>
        <ul className="flex flex-col gap-3">
          {template.faq.map((item, i) => (
            <li key={i} className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-gray-700">Q. {item.q}</p>
              <p className="text-sm text-gray-500">A. {item.a}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default TemplateEditForm;
