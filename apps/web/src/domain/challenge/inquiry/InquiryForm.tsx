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
      className={`border-neutral-90 rounded-xxs flex flex-col gap-3 border p-4 ${className}`}
    >
      <label className="flex flex-col gap-1">
        <p className="text-xsmall14 text-neutral-30 font-medium">제목</p>
        <input
          className="border-neutral-90 rounded-xxs focus:ring-primary border px-3 py-2 text-sm focus:outline-none focus:ring-1"
          placeholder="문의 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <p className="text-xsmall14 text-neutral-30 font-medium">내용</p>
        <textarea
          className="border-neutral-90 rounded-xxs focus:ring-primary min-h-[120px] border px-3 py-2 text-sm focus:outline-none focus:ring-1"
          placeholder="문의 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <div className="flex gap-2">
        <button
          className="text-primary-90 border-primary-90 rounded-xxs flex-1 border py-2 text-sm"
          onClick={() => {
            setTitle(initialTitle);
            setContent(initialContent);
            onCancel();
          }}
        >
          취소하기
        </button>
        <button
          className="bg-primary rounded-xxs flex-1 py-2 text-sm text-white disabled:opacity-50"
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
