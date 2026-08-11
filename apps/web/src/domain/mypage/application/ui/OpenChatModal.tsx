'use client';

import AlertModal from '@/common/alert/AlertModal';
import { useEffect, useState } from 'react';

interface OpenChatModalProps {
  chatLink: string;
  chatPassword: string;
  isSlack?: boolean;
  onClose: () => void;
}

/**
 * 오픈채팅방(또는 슬랙 채널) 참여코드 안내 모달.
 *
 * 카카오톡/슬랙이 참여코드를 요구하는 시점에는 이미 우리 페이지를 벗어난 뒤라
 * 코드를 보러 돌아와야 한다. 그래서 입장 전에 한 번 끊어 코드를 복사하게 한다.
 */
const OpenChatModal = ({
  chatLink,
  chatPassword,
  isSlack = false,
  onClose,
}: OpenChatModalProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chatPassword);
      setCopied(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEnter = () => {
    window.open(chatLink, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AlertModal
      className="m-5 md:m-0"
      title={isSlack ? '슬랙 채널 참여코드' : '오픈채팅방 참여코드'}
      confirmText="입장하기"
      cancelText="닫기"
      onConfirm={handleEnter}
      onCancel={onClose}
    >
      <div className="flex flex-col gap-3">
        <p className="text-xsmall14 text-neutral-20">
          {isSlack ? '슬랙에서' : '카카오톡에서'} 참여코드를 입력해야 입장할 수
          있어요.
          <br />
          코드를 복사한 뒤 입장하기를 눌러주세요.
        </p>
        <div className="rounded-xs bg-neutral-95 flex items-center justify-between gap-2 px-3 py-2.5">
          <span className="text-xsmall16 text-neutral-0 break-all font-semibold">
            {chatPassword}
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
  );
};

export default OpenChatModal;
