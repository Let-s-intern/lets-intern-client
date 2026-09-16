'use client';

import AlertModal from '@/common/alert/AlertModal';
import { isSlackChatLink } from '@/domain/challenge/utils/chatLink';
import { useState } from 'react';

interface ChatEnterButtonProps {
  link: string;
  /** 참여코드. 없으면 새 탭으로 바로 보낸다. */
  password?: string;
}

/**
 * 챌린지 오픈채팅방(또는 슬랙 채널) 입장 버튼.
 *
 * 참여코드가 있으면 모달로 한 번 끊어 코드를 복사하게 한다 — 카카오톡·슬랙이 코드를
 * 요구하는 시점에는 이미 이 페이지를 벗어난 뒤라, 코드를 보러 돌아와야 한다.
 */
const ChatEnterButton = ({ link, password }: ChatEnterButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isSlack = isSlackChatLink(link);
  const label = isSlack ? '슬랙 채널 입장하기' : '오픈채팅방 입장하기';

  const enter = () => window.open(link, '_blank', 'noopener,noreferrer');

  const handleClick = () => {
    if (password) {
      setIsModalOpen(true);
      return;
    }
    enter();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password ?? '');
      setCopied(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="rounded-xxs border-neutral-80 text-xxsmall12 text-neutral-0 mt-2 inline-flex items-center gap-1 border bg-white px-3 py-1.5 font-medium"
      >
        <img
          src={
            isSlack ? '/icons/slack-channel.png' : '/icons/kakao-channel.svg'
          }
          alt=""
          aria-hidden="true"
          className="h-3.5 w-3.5"
        />
        {label}
      </button>

      {isModalOpen && password && (
        <AlertModal
          className="m-5 md:m-0"
          title={isSlack ? '슬랙 채널 참여코드' : '오픈채팅방 참여코드'}
          confirmText="입장하기"
          cancelText="닫기"
          onConfirm={() => {
            enter();
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        >
          <div className="flex flex-col gap-3">
            <p className="text-xsmall14 text-neutral-20">
              {isSlack ? '슬랙에서' : '카카오톡에서'} 참여코드를 입력해야 입장할
              수 있어요.
              <br />
              코드를 복사한 뒤 입장하기를 눌러주세요.
            </p>
            <div className="rounded-xs bg-neutral-95 flex items-center justify-between gap-2 px-3 py-2.5">
              <span className="text-xsmall16 text-neutral-0 break-all font-semibold">
                {password}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-xxs border-primary text-primary text-xsmall14 shrink-0 border bg-white px-2.5 py-1 font-normal"
              >
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
          </div>
        </AlertModal>
      )}
    </>
  );
};

export default ChatEnterButton;
