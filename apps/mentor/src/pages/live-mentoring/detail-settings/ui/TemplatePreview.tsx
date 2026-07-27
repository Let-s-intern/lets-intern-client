import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';
import { CATEGORY_LABELS } from '../../constants';

interface TemplatePreviewProps {
  template: LiveMentoringTemplate;
}

const blockTitle = 'text-sm font-semibold text-gray-900';
const bodyText = 'whitespace-pre-wrap text-sm text-gray-600';

/**
 * 상세 페이지 실시간 미리보기 (공개 상세 S2 근사).
 * 웹과 앱 렌더가 달라 공유하지 않고 mentor 내부에 둔다(중복 허용).
 * 편집 가능/불가 구분 없이 최종 노출 형태를 그대로 보여준다.
 */
const TemplatePreview = ({ template }: TemplatePreviewProps) => {
  const visibleCareers = template.careers.filter((c) => c.visible);
  const visibleChecklist = template.checklist.filter(
    (item) => item.mode !== 'HIDDEN',
  );

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">미리보기</h2>
        <span className="bg-primary-10 text-primary rounded px-2 py-0.5 text-xs font-medium">
          {CATEGORY_LABELS[template.category]}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {/* 자기소개 */}
        <div className="flex flex-col gap-1.5">
          <p className={blockTitle}>멘토 소개</p>
          <p className={bodyText}>{template.introduction || '소개 없음'}</p>
        </div>

        {/* 이력 */}
        {visibleCareers.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className={blockTitle}>이력</p>
            <ul className="flex flex-col gap-1">
              {visibleCareers.map((c, i) => (
                <li key={`${c.company}-${i}`} className="text-sm text-gray-600">
                  {c.company} · {c.position} ({c.period})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 멘토링 포인트 */}
        <div className="flex flex-col gap-1.5">
          <p className={blockTitle}>멘토링 포인트</p>
          <p className={bodyText}>{template.mentoringPoints || '내용 없음'}</p>
        </div>

        {/* 후기 */}
        {template.reviews.visible && (
          <div className="flex flex-col gap-1.5">
            <p className={blockTitle}>후기</p>
            <p className="text-sm text-gray-600">
              선택한 후기 {template.reviews.selectedReviewIds.length}개 노출
            </p>
          </div>
        )}

        {/* 피드백 과정 (편집 불가) */}
        <div className="flex flex-col gap-1.5">
          <p className={blockTitle}>피드백 과정</p>
          <ol className="flex flex-col gap-1">
            {template.process.map((step) => (
              <li key={step.step} className="text-sm text-gray-600">
                {step.step}. {step.title} — {step.desc}
              </li>
            ))}
          </ol>
        </div>

        {/* 제출물 + 체크리스트 (편집 불가 스펙 + 편집 가능 체크리스트) */}
        <div className="flex flex-col gap-1.5">
          <p className={blockTitle}>{template.submissionSpec.title}</p>
          <p className={bodyText}>{template.submissionSpec.desc}</p>
          {visibleChecklist.length > 0 && (
            <ul className="mt-1 flex flex-col gap-1">
              {visibleChecklist.map((item) => (
                <li key={item.id} className="text-sm text-gray-600">
                  ·{' '}
                  {item.mode === 'CUSTOM' && item.customText
                    ? item.customText
                    : item.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* FAQ (편집 불가) */}
        <div className="flex flex-col gap-1.5">
          <p className={blockTitle}>자주 묻는 질문</p>
          <ul className="flex flex-col gap-2">
            {template.faq.map((item, i) => (
              <li key={i} className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-gray-700">Q. {item.q}</p>
                <p className="text-sm text-gray-500">A. {item.a}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TemplatePreview;
