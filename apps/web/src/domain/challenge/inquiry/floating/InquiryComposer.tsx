'use client';

import { ChevronLeft, Send, X } from 'lucide-react';
import { useState } from 'react';
import { useImagePaste } from './useImagePaste';
import PanelCloseButton from './PanelCloseButton';

interface InquiryComposerProps {
  isPending: boolean;
  onSubmit: (data: {
    title: string;
    content: string;
    imageUrls: string[];
  }) => void;
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
  const { imageUrls, isUploading, error, onPaste, onDrop, removeImage } =
    useImagePaste();

  const canSubmit =
    title.trim() !== '' && content.trim() !== '' && !isPending && !isUploading;

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
            <span className="text-neutral-45 ml-1 font-normal">
              이미지를 복사해서 붙여넣을 수 있어요
            </span>
          </span>
          <textarea
            className="rounded-xxs focus:ring-primary border-neutral-85 min-h-[160px] flex-1 resize-none border px-3 py-2.5 text-sm focus:outline-none focus:ring-1"
            placeholder="문의 내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onPaste={onPaste}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
          />
        </label>

        {isUploading && (
          <p className="text-xxsmall12 text-neutral-45">이미지 올리는 중...</p>
        )}
        {error && <p className="text-xxsmall12 text-system-error">{error}</p>}

        {imageUrls.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {imageUrls.map((url) => (
              <li key={url} className="relative">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  title="원본 보기"
                >
                  <img
                    src={url}
                    alt="첨부 이미지"
                    className="rounded-xxs border-neutral-85 h-16 w-16 border object-cover"
                  />
                </a>
                <button
                  type="button"
                  aria-label="이미지 삭제"
                  onClick={() => removeImage(url)}
                  className="bg-neutral-0/70 text-static-100 absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="shrink-0 px-5 pb-5">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => onSubmit({ title, content, imageUrls })}
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
