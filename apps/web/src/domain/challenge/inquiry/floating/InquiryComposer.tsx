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
    <div className="flex flex-1 flex-col overflow-hidden bg-static-100">
      <header className="flex shrink-0 items-center gap-2 border-b border-neutral-85 px-4 py-4">
        <button
          type="button"
          aria-label="뒤로"
          onClick={onCancel}
          className="shrink-0 text-neutral-40 hover:text-neutral-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="flex-1 text-xsmall16 font-bold text-neutral-0">
          새 문의하기
        </p>
        <span className="md:hidden">
          <PanelCloseButton onClose={onClose} />
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-xsmall14 font-medium text-neutral-30">
            제목
          </span>
          <input
            className="rounded-xxs border border-neutral-85 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="문의 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-xsmall14 font-medium text-neutral-30">
            내용
            <span className="ml-1 font-normal text-neutral-45">
              이미지를 복사해서 붙여넣을 수 있어요
            </span>
          </span>
          <textarea
            className="min-h-[160px] flex-1 resize-none rounded-xxs border border-neutral-85 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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
                    className="h-16 w-16 rounded-xxs border border-neutral-85 object-cover"
                  />
                </a>
                <button
                  type="button"
                  aria-label="이미지 삭제"
                  onClick={() => removeImage(url)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-0/70 text-static-100"
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
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-bold text-white hover:bg-primary-hover disabled:opacity-40"
        >
          {isPending ? '보내는 중...' : '문의 보내기'}
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InquiryComposer;
