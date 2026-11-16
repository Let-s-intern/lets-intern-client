'use client';

import { useState } from 'react';

interface InquiryFormProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (data: { title: string; content: string }) => void;
  onCancel: () => void;
  isPending?: boolean;
  className?: string;
}

const InquiryForm = ({
  initialTitle = '',
  initialContent = '',
  onSubmit,
  onCancel,
  isPending,
  className = '',
}: InquiryFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  return (
    <div
      className={`flex flex-col gap-3 rounded-xxs border border-neutral-90 p-4 ${className}`}
    >
      <label className="flex flex-col gap-1">
        <p className="text-xsmall14 font-medium text-neutral-30">제목</p>
        <input
          className="rounded-xxs border border-neutral-90 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="문의 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <p className="text-xsmall14 font-medium text-neutral-30">내용</p>
        <textarea
          className="min-h-[120px] rounded-xxs border border-neutral-90 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="문의 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <div className="flex gap-2">
        <button
          className="flex-1 rounded-xxs border border-primary-90 py-2 text-sm text-primary-90"
          onClick={() => {
            setTitle(initialTitle);
            setContent(initialContent);
            onCancel();
          }}
        >
          취소하기
        </button>
        <button
          className="flex-1 rounded-xxs bg-primary py-2 text-sm text-white disabled:opacity-50"
          disabled={
            !title.trim() ||
            !content.trim() ||
            (title === initialTitle && content === initialContent) ||
            isPending
          }
          onClick={() => onSubmit({ title, content })}
        >
          입력완료
        </button>
      </div>
    </div>
  );
};

export default InquiryForm;
