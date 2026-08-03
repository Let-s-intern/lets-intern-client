'use client';

import { twMerge } from '@/lib/twMerge';
import { useState } from 'react';
import OpenChatModal from './OpenChatModal';

interface OpenChatLinkProps {
  link: string;
  password?: string;
  className?: string;
}

/**
 * 카카오톡 오픈채팅방 입장 링크.
 *
 * 구매플랜과 같은 줄에 놓이는 부가 정보라 버튼 박스 없이 아이콘 + 텍스트로만 두고,
 * 밑줄로 누를 수 있다는 것만 표시한다.
 * 참여코드가 있으면 모달로 한 번 끊어 코드를 복사하게 하고, 없으면 새 탭으로 바로 보낸다.
 */
const OpenChatLink = ({ link, password, className }: OpenChatLinkProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (password) {
      setIsModalOpen(true);
      return;
    }
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={twMerge(
          'text-xxsmall12 text-neutral-20 hover:text-neutral-0 flex items-center gap-1 font-medium underline underline-offset-2 transition-colors',
          className,
        )}
      >
        <img
          src="/icons/kakao-channel.svg"
          alt=""
          aria-hidden="true"
          className="h-3.5 w-3.5 no-underline"
        />
        오픈채팅방 입장
      </button>

      {isModalOpen && password && (
        <OpenChatModal
          chatLink={link}
          chatPassword={password}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default OpenChatLink;
