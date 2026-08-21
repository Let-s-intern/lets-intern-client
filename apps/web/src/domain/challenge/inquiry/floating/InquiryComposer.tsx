'use client';

import { ChevronLeft, Send } from 'lucide-react';
import { useState } from 'react';
import PanelCloseButton from './PanelCloseButton';

interface InquiryComposerProps {
  isPending: boolean;
  onSubmit: (data: { title: string; content: string }) => void;
  onCancel: () => void;
  onClose: () => void;
}

const InquiryComposer = ({
  isPending,
  onSubmit,
  onCancel,
  onClose,
}: InquiryComposerProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const canSubmit = title.trim() !== '' && content.trim() !== '' && !isPending;

  return (
    <div className="bg-static-100 flex flex-1 flex-col overflow-hidden">
      <header className="border-neutral-85 flex shrink-0 items-center gap-2 border-b px-4 py-4">
        <button
          type="button"
          aria-label="뒤로"
          onClick={onCancel}
          className="text-neutral-40 hover:text-neutral-0 shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="text-xsmall16 text-neutral-0 flex-1 font-bold">
          새 문의하기
        </p>
        <span className="md:hidden">
          <PanelCloseButton onClose={onClose} />
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-xsmall14 text-neutral-30 font-medium">
            제목
          </span>
          <input
            className="rounded-xxs focus:ring-primary border-neutral-85 border px-3 py-2.5 text-sm focus:outline-none focus:ring-1"
            placeholder="문의 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-xsmall14 text-neutral-30 font-medium">
            내용
          </span>
          <textarea
            className="rounded-xxs focus:ring-primary border-neutral-85 min-h-[160px] flex-1 resize-none border px-3 py-2.5 text-sm focus:outline-none focus:ring-1"
            placeholder="문의 내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
      </div>

      <div className="shrink-0 px-5 pb-5">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => onSubmit({ title, content })}
          className="bg-primary hover:bg-primary-hover flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-bold text-white disabled:opacity-40"
        >
          {isPending ? '보내는 중...' : '문의 보내기'}
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InquiryComposer;
