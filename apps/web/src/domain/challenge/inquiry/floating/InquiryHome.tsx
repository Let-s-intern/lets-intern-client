'use client';

import { QuestionItem } from '@/domain/challenge/api/challengeQuestion';
import { ChevronRight, Send } from 'lucide-react';
import PanelCloseButton from './PanelCloseButton';
import { isAnswered, isUnread } from './useInquiryReadState';

interface InquiryHomeProps {
  questions: QuestionItem[];
  isLoading: boolean;
  onClose: () => void;
  onStart: () => void;
  onOpenThread: (id: number) => void;
  onRequestCancel: (item: QuestionItem) => void;
}

/** 답변은 Lexical JSON 이거나 일반 텍스트다. 미리보기는 글자만 뽑아 쓴다 */
const toPlainText = (answer: string): string => {
  try {
    const parsed = JSON.parse(answer);
    if (parsed?.root) {
      const walk = (node: unknown): string => {
        if (typeof node !== 'object' || node === null) return '';
        const n = node as { text?: unknown; children?: unknown };
        if (typeof n.text === 'string') return n.text;
        if (Array.isArray(n.children)) return n.children.map(walk).join(' ');
        return '';
      };
      return walk(parsed.root).trim();
    }
  } catch {
    // 일반 텍스트
  }
  return answer;
};

const newest = (list: QuestionItem[]) =>
  [...list].sort((a, b) => b.createDate.localeCompare(a.createDate))[0];

/**
 * 홈에 띄울 문의 하나를 고른다.
 * 안 읽은 답변이 있으면 그것부터, 없으면 가장 최근 문의를 보여준다.
 */
const pickHighlight = (questions: QuestionItem[]) => {
  const unreadAnswered = questions.filter(isUnread);
  return unreadAnswered.length > 0 ? newest(unreadAnswered) : newest(questions);
};

const InquiryHome = ({
  questions,
  isLoading,
  onClose,
  onStart,
  onOpenThread,
  onRequestCancel,
}: InquiryHomeProps) => {
  const highlight = isLoading ? undefined : pickHighlight(questions);
  const answered = highlight ? isAnswered(highlight) : false;
  const unread = !!highlight && isUnread(highlight);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <header className="flex items-start gap-4 px-5 pb-6 pt-6">
        <img
          src="/logo/logo-simple.svg"
          alt=""
          className="bg-static-100 h-14 w-14 shrink-0 rounded-md p-2"
        />
        <div className="flex-1 pt-1">
          <p className="text-medium22 text-neutral-0 font-bold">렛츠커리어</p>
          <p className="text-xsmall14 text-neutral-40 mt-1">챌린지 1:1 문의</p>
        </div>
        <div className="pt-2 md:hidden">
          <PanelCloseButton onClose={onClose} />
        </div>
      </header>

      <div className="flex-1 px-4 pb-6">
        <section className="bg-static-100 rounded-lg p-5">
          <div className="mb-3 flex items-center gap-2">
            <img src="/logo/logo-simple.svg" alt="" className="h-5 w-5" />
            <span className="text-xsmall14 text-neutral-0 font-bold">
              렛츠커리어
            </span>
          </div>
          <p className="text-xsmall16 text-neutral-0 font-medium">
            안녕하세요, 렛츠커리어입니다!
          </p>
          <p className="text-xsmall14 text-neutral-30 mt-3 leading-relaxed">
            챌린지를 진행하며 궁금한 점이 있으시면 언제든 문의해 주세요.
            미션·일정·환불 무엇이든 좋습니다.
          </p>

          <button
            type="button"
            onClick={onStart}
            className="bg-primary hover:bg-primary-hover mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-bold text-white"
          >
            문의하기
            <Send className="h-5 w-5" />
          </button>

          <p className="text-xsmall14 text-neutral-45 mt-3 text-center">
            운영시간 내 순차적으로 답변드려요
          </p>
        </section>

        {highlight && (
          <section className="mt-4">
            <p className="text-xsmall14 text-neutral-40 mb-2 px-1 font-medium">
              {unread
                ? '새 답변이 도착했어요'
                : answered
                  ? '최근 문의'
                  : '답변을 기다리는 문의'}
            </p>
            <div className="bg-static-100 rounded-lg p-4">
              <button
                type="button"
                onClick={() => onOpenThread(highlight.id)}
                className="flex w-full items-start gap-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={
                        unread
                          ? 'text-xsmall16 text-neutral-0 truncate font-bold'
                          : 'text-xsmall16 text-neutral-0 truncate font-medium'
                      }
                    >
                      {highlight.title}
                    </p>
                    {unread && (
                      <span
                        aria-label="읽지 않은 답변"
                        className="bg-system-error h-2 w-2 shrink-0 rounded-full"
                      />
                    )}
                  </div>

                  {answered && highlight.answer ? (
                    <p className="text-xsmall14 text-neutral-30 mt-2 line-clamp-2 leading-relaxed">
                      {toPlainText(highlight.answer)}
                    </p>
                  ) : (
                    <p className="text-xsmall14 text-neutral-40 mt-2 truncate">
                      {highlight.content}
                    </p>
                  )}
                </div>
                <ChevronRight className="text-neutral-45 mt-1 h-4 w-4 shrink-0" />
              </button>

              <div className="mt-3 flex items-center">
                <span
                  className={
                    answered
                      ? 'bg-primary-5 text-primary text-xxsmall12 rounded px-2 py-0.5 font-medium'
                      : 'bg-neutral-90 text-neutral-40 text-xxsmall12 rounded px-2 py-0.5 font-medium'
                  }
                >
                  {answered ? '답변 완료' : '답변 대기'}
                </span>
                {/* 서버는 답변 전인 문의만 취소를 허용한다 */}
                {!answered && (
                  <button
                    type="button"
                    onClick={() => onRequestCancel(highlight)}
                    className="text-xxsmall12 text-neutral-45 hover:text-neutral-30 ml-auto underline underline-offset-2"
                  >
                    문의 취소하기
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default InquiryHome;
