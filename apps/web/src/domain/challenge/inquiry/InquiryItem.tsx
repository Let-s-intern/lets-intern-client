'use client';

import { QuestionItem } from '@/api/challenge-question/challengeQuestion';
import LexicalContent from '@/common/lexical/LexicalContent';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import InquiryForm from './InquiryForm';

const AnswerContent = ({ answer }: { answer: string }) => {
  try {
    const parsed = JSON.parse(answer);
    if (parsed?.root) {
      return <LexicalContent node={parsed.root} />;
    }
  } catch {
    // plain text fallback
  }
  return <span className="whitespace-pre-wrap">{answer}</span>;
};

interface InquiryItemProps {
  item: QuestionItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: (data: { title: string; content: string }) => void;
  onDelete: () => void;
  isEditPending?: boolean;
}

const InquiryItem = ({
  item,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  isEditPending,
}: InquiryItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const isCompleted = item.answerStatus === 'COMPLETED';

  return (
    <li className="border-neutral-90 border-b last:border-b-0">
      {/* 수정 폼 — isEditing일 때 fade-in */}
      <div
        className={`transition-all duration-300 ${
          isEditing
            ? 'pointer-events-auto max-h-[500px] opacity-100'
            : 'pointer-events-none max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <InquiryForm
          initialTitle={item.title}
          initialContent={item.content}
          isPending={isEditPending}
          className="mt-5"
          onSubmit={(data) => {
            onEdit(data);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>

      {/* 기본 행 — isEditing일 때 fade-out */}
      <div
        className={`flex items-center gap-3 py-4 transition-all duration-300 ${
          isEditing
            ? 'pointer-events-none max-h-0 overflow-hidden opacity-0'
            : 'max-h-20 opacity-100'
        }`}
      >
        <span
          className={`text-md shrink-0 rounded px-2 py-0.5 font-medium ${
            isCompleted
              ? 'bg-primary-5 text-primary'
              : 'bg-neutral-90 text-neutral-40'
          }`}
        >
          {isCompleted ? '답변 완료' : '답변 대기'}
        </span>

        <span className="text-md flex-1 truncate font-medium">
          {item.title}
        </span>

        {isCompleted ? (
          <button
            className="text-xsmall16 text-neutral-40 flex shrink-0 items-center gap-0.5"
            onClick={onToggleExpand}
          >
            답변 확인
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        ) : (
          <div className="text-xsmall16 text-neutral-40 flex shrink-0 items-center gap-2">
            <button
              className="hover:text-neutral-0"
              onClick={() => setIsEditing(true)}
            >
              수정
            </button>
            <span>|</span>
            <button className="hover:text-red-500" onClick={onDelete}>
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 답변 확인 영역 — grid-rows로 높이 애니메이션 */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded && isCompleted ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="rounded-xxs border-neutral-90 mb-5 flex flex-col gap-3 border p-4">
            <div>
              <p className="text-xsmall14 text-neutral-30 mb-1 font-medium">
                질문 내용
              </p>
              <div className="rounded-xxs bg-neutral-95 text-neutral-30 whitespace-pre-wrap px-4 py-3 text-sm">
                {item.content}
              </div>
            </div>
            {item.isVisible && item.answer && (
              <div>
                <p className="text-xsmall14 text-neutral-30 mb-1 font-medium">
                  질문 답변
                </p>
                <div className="rounded-xxs bg-primary-5 text-neutral-30 px-4 py-3 text-sm">
                  <AnswerContent answer={item.answer} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default InquiryItem;
