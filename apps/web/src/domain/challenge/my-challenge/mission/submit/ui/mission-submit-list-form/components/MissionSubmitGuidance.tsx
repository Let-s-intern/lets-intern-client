'use client';

import { useChallengeChatLink } from '@/domain/challenge/hooks/useChallengeChatLink';
import ChatEnterButton from '../../ChatEnterButton';

export const MissionSubmitGuidance = () => {
  const { chatLink, chatPassword, placeName } = useChallengeChatLink();

  return (
    <section>
      <h3 className="mb-3 text-small18 font-semibold text-neutral-0">
        미션 제출 안내사항
      </h3>
      <div className="rounded-xxs bg-neutral-95 p-3">
        <ul className="text-xsmall14 text-neutral-10">
          <li className="flex items-start">
            <span className="mr-2 text-neutral-10">-</span>
            <span>
              아직 경험을 작성하지 않았거나 삭제, 수정이 필요하다면,{' '}
              <a
                href="/mypage/career/experience"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                [커리어 관리 &gt; 경험 정리]
              </a>
              에서 진행해주세요.
            </span>
          </li>
          <li className="flex items-start justify-between gap-3">
            <span className="flex items-start">
              <span className="mr-2 text-neutral-10">-</span>
              <span>
                제출 후, 미션과 소감을 {placeName}에 공유해야 제출이 인정됩니다.
              </span>
            </span>
            {chatLink && (
              <ChatEnterButton
                link={chatLink}
                password={chatPassword}
                className="mt-0 shrink-0"
              />
            )}
          </li>
        </ul>
      </div>
    </section>
  );
};
