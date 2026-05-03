import { useRef, useState } from 'react';

interface ChatComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t border-neutral-80 px-4 py-3">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요 (Enter 전송, Shift+Enter 줄바꿈)"
        disabled={disabled}
        rows={2}
        className="flex-1 resize-none rounded-lg border border-neutral-80 bg-white px-3 py-2 text-sm text-neutral-10 placeholder:text-neutral-50 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-neutral-95"
        aria-label="메시지 입력"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="bg-primary hover:bg-primary-hover flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors disabled:cursor-not-allowed disabled:bg-neutral-80"
        aria-label="메시지 전송"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
