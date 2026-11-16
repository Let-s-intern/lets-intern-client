'use client';

import { QuestionItem } from '@/domain/challenge/api/challengeQuestion';
import { MessageCircle, Send } from 'lucide-react';
import PanelCloseButton from './PanelCloseButton';
import { isAnswered, isUnread } from './useInquiryReadState';

interface InquiryListProps {
  questions: QuestionItem[];
  isLoading: boolean;
  onClose: () => void;
  onStart: () => void;
  onOpenThread: (id: number) => void;
}

const InquiryList = ({
  questions,
  isLoading,
  onClose,
  onStart,
  onOpenThread,
}: InquiryListProps) => {
  const sorted = [...questions].sort((a, b) =>
    b.createDate.localeCompare(a.createDate),
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-static-100">
      <header className="flex shrink-0 items-center px-5 pb-4 pt-6">
        <h2 className="flex-1 text-medium22 font-bold text-neutral-0">대화</h2>
        <span className="md:hidden">
          <PanelCloseButton onClose={onClose} />
        </span>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto">
        {isLoading ? (
          <p className="py-10 text-center text-xsmall14 text-neutral-40">
            불러오는 중...
          </p>
        ) : sorted.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <MessageCircle
              className="h-24 w-24 text-neutral-80"
              strokeWidth={1.5}
            />
            <p className="text-small18 font-medium text-neutral-45">
              대화를 시작해보세요
            </p>
          </div>
        ) : (
          <ul className="flex-1">
            {sorted.map((item) => {
              const answered = isAnswered(item);
              const unread = isUnread(item);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onOpenThread(item.id)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-neutral-95"
                  >
                    <img
                      src="/logo/logo-simple.svg"
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-sm bg-neutral-95 p-1.5"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={
                          unread
                            ? 'truncate text-xsmall16 font-bold text-neutral-0'
                            : 'truncate text-xsmall16 font-medium text-neutral-0'
                        }
                      >
                        {item.title}
                      </p>
                      <p className="mt-0.5 truncate text-xsmall14 text-neutral-40">
                        {item.content}
                      </p>
                    </div>
                    {unread && (
                      <span
                        aria-label="읽지 않은 답변"
                        className="h-2 w-2 shrink-0 rounded-full bg-system-error"
                      />
                    )}
                    <span
                      className={
                        answered
                          ? 'rounded shrink-0 bg-primary-5 px-2 py-0.5 text-xxsmall12 font-medium text-primary'
                          : 'rounded shrink-0 bg-neutral-90 px-2 py-0.5 text-xxsmall12 font-medium text-neutral-40'
                      }
                    >
                      {answered ? '답변 완료' : '답변 대기'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="shrink-0 px-5 pb-5 pt-3">
        <button
          type="button"
          onClick={onStart}
          className="mx-auto flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-bold text-white hover:bg-primary-hover"
        >
          새 문의하기
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InquiryList;
