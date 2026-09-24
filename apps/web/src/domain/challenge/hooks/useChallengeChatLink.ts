'use client';

import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { isSlackChatLink, normalizeChatPassword } from '../utils/chatLink';

/**
 * 챌린지 오픈채팅방(또는 슬랙 채널) 정보.
 *
 * 공유 안내 문구와 입장 버튼이 미션 제출 화면 여러 곳에 흩어져 있다. 판정이 갈리면
 * 한 화면은 슬랙, 다른 화면은 카카오톡으로 안내하게 되므로 여기 한 곳에 모은다.
 */
export const useChallengeChatLink = () => {
  const { currentChallenge } = useCurrentChallenge();
  const chatLink = currentChallenge?.chatLink?.trim() || undefined;

  return {
    chatLink,
    chatPassword: normalizeChatPassword(currentChallenge?.chatPassword),
    /** 안내 문구에 들어갈 이름. 링크가 없으면 기존대로 카카오톡으로 안내한다. */
    placeName:
      chatLink && isSlackChatLink(chatLink)
        ? '슬랙 채널'
        : '카카오톡 오픈채팅방',
  };
};
