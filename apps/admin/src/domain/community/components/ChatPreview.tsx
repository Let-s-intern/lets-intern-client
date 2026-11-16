import { motion, AnimatePresence } from 'motion/react';
import Image from '@/common/ui/Image';
import { useState, useCallback, useEffect } from 'react';
import chatHr from '../images/chat-hr.jpg';
import chatInfo from '../images/chat-info.jpg';
import chatJob from '../images/chat-job.jpg';
import chatTip from '../images/chat-tip.jpg';

const CHAT_PREVIEWS = [
  { src: chatTip, alt: '취준 꿀팁 공유', label: '취준 꿀팁' },
  { src: chatJob, alt: '채용공고 큐레이션', label: '채용공고 공유' },
  { src: chatHr, alt: 'HR 공고 추천', label: '공고 추천' },
  { src: chatInfo, alt: '취준 콘텐츠 추천', label: '취준 콘텐츠 추천' },
] as const;

export default function ChatPreview() {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const closeModal = useCallback(() => setModalIndex(null), []);

  useEffect(() => {
    if (modalIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [modalIndex, closeModal]);

  return (
    <>
      {/* 4-column square cards, bottom-cropped */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {CHAT_PREVIEWS.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setModalIndex(i)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xs bg-white shadow-sm ring-1 ring-neutral-80 transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-primary-40"
          >
            <Image
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              placeholder="blur"
              sizes="(max-width: 768px) 45vw, 22vw"
            />
            {/* Bottom gradient + label */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-3 pb-2.5 pt-8">
              <span className="text-xxsmall12 font-bold text-white md:text-xsmall14">
                {item.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Modal overlay */}
      <AnimatePresence>
        {modalIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={CHAT_PREVIEWS[modalIndex].alt}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal content */}
            <motion.div
              className="relative max-h-[85vh] w-full max-w-[400px] overflow-hidden rounded-sm shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="max-h-[85vh] overflow-y-auto">
                <Image
                  src={CHAT_PREVIEWS[modalIndex].src}
                  alt={CHAT_PREVIEWS[modalIndex].alt}
                  className="h-auto w-full object-contain"
                  placeholder="blur"
                  priority
                />
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                aria-label="닫기"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
