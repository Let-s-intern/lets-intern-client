'use client';

import { useMyQuestionsQuery } from '@/domain/challenge/api/challengeQuestion';
import { twMerge } from '@/lib/twMerge';
import { Send, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import InquiryPanel from './InquiryPanel';
import { useInquiryReadState } from './useInquiryReadState';

/**
 * 챌린지 대시보드 전용 플로팅 문의 버튼.
 * 이 경로에서는 채널톡 버튼 대신 이 버튼이 뜬다(ChannelTalkBtn 에서 숨김 처리).
 * 열려 있는 동안에는 채널톡과 같이 동그란 닫기 버튼으로 바뀐다.
 */
const ChallengeInquiryLauncher = () => {
  const params = useParams<{ programId: string }>();
  const challengeId = Number(params.programId);

  const [isOpen, setIsOpen] = useState(false);

  const { data: questions = [] } = useMyQuestionsQuery(challengeId);
  const { markAsRead, unreadCount } = useInquiryReadState(challengeId);

  const unread = unreadCount(questions);

  return (
    <>
      {isOpen ? (
        // 모바일에서는 패널이 전체화면이라 헤더의 닫기 버튼을 쓴다
        <button
          type="button"
          aria-label="문의 닫기"
          onClick={() => setIsOpen(false)}
          className="shadow-05 text-neutral-30 fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-white md:flex"
        >
          <X className="h-7 w-7" strokeWidth={2} />
        </button>
      ) : (
        <button
          type="button"
          aria-label={
            unread > 0
              ? `챌린지 문의하기, 새 답변 ${unread}개`
              : '챌린지 문의하기'
          }
          onClick={() => setIsOpen(true)}
          className={twMerge(
            'shadow-05 fixed bottom-20 right-4 z-30 flex w-40 items-center rounded-full bg-neutral-100 md:right-6 md:w-44',
          )}
        >
          <div className="text-xsmall14 md:text-xsmall16 flex flex-1 items-center justify-center pl-2 font-semibold">
            챌린지 문의하기
          </div>
          <div className="bg-primary flex h-12 w-12 translate-x-px items-center justify-center rounded-full sm:h-14 sm:w-14">
            <Send
              className="h-6 w-6 text-white sm:h-7 sm:w-7"
              strokeWidth={2}
            />
          </div>
          {unread > 0 && (
            <div className="text-xxsmall12 bg-system-error text-static-100 absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full font-medium sm:h-6 sm:w-6">
              {unread}
            </div>
          )}
        </button>
      )}

      {isOpen && (
        <InquiryPanel
          onMarkAsRead={markAsRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ChallengeInquiryLauncher;
