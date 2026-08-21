'use client';

import {
  QuestionItem,
  useMarkQuestionReadMutation,
} from '@/domain/challenge/api/challengeQuestion';
import { useCallback } from 'react';

/** 답변이 공개된 문의만 읽음 대상이다 */
export const isAnswered = (item: QuestionItem) =>
  item.answerStatus === 'COMPLETED' && item.isVisible;

/** 답변이 공개됐는데 아직 확인하지 않은 문의 */
export const isUnread = (item: QuestionItem) =>
  isAnswered(item) && !item.isAnswerRead;

/**
 * 읽음 상태는 서버(challenge_question.answer_read_at)가 갖는다.
 * 답변이 수정되거나 다시 공개되면 서버가 읽음을 해제하므로 새 답변으로 다시 뜬다.
 */
export const useInquiryReadState = (challengeId: number) => {
  const { mutate } = useMarkQuestionReadMutation(challengeId);

  const markAsRead = useCallback(
    (item: QuestionItem) => {
      if (!isUnread(item)) return;
      mutate(item.id);
    },
    [mutate],
  );

  const unreadCount = useCallback(
    (questions: QuestionItem[]) => questions.filter(isUnread).length,
    [],
  );

  return { markAsRead, unreadCount };
};
