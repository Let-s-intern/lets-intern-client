'use client';

import AlertModal from '@/common/alert/AlertModal';
import { isSlackChatLink } from '@/domain/challenge/utils/chatLink';
import { twMerge } from '@/lib/twMerge';
import { useState } from 'react';

interface ChatEnterButtonProps {
  link: string;
  /** 참여코드. 없으면 새 탭으로 바로 보낸다. */
  password?: string;
  /** 문구를 바꿔 쓰는 자리가 있다(제출 후 "미션 공유하기"). 기본은 채팅방 종류를 따른다. */
  label?: string;
  /** 안내 옆의 작은 버튼과 제출 버튼 아래의 큰 버튼이 같은 컴포넌트를 쓴다. */
  className?: string;
}

/**
 * 챌린지 오픈채팅방(또는 슬랙 채널) 입장 버튼.
 *
 * 참여코드가 있으면 모달로 한 번 끊어 코드를 복사하게 한다 — 카카오톡·슬랙이 코드를
 * 요구하는 시점에는 이미 이 페이지를 벗어난 뒤라, 코드를 보러 돌아와야 한다.
 */
const ChatEnterButton = ({
  link,
  password,
  label,
  className,
}: ChatEnterButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isSlack = isSlackChatLink(link);
  const buttonLabel =
    label ?? (isSlack ? '슬랙 채널 입장하기' : '오픈채팅방 입장하기');

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
        className={twMerge(
          'mt-2 inline-flex items-center gap-1 rounded-xxs border border-neutral-80 bg-white px-3 py-1.5 text-xxsmall12 font-medium text-neutral-0',
          className,
        )}
      >
        <img
          src={
            isSlack ? '/icons/slack-channel.png' : '/icons/kakao-channel.svg'
          }
          alt=""
          aria-hidden="true"
          className="h-3.5 w-3.5"
        />
        {buttonLabel}
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
            <div className="flex items-center justify-between gap-2 rounded-xs bg-neutral-95 px-3 py-2.5">
              <span className="break-all text-xsmall16 font-semibold text-neutral-0">
                {password}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 rounded-xxs border border-primary bg-white px-2.5 py-1 text-xsmall14 font-normal text-primary"
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
