import Link from 'next/link';
import { LETSCAREER_CHAT_URL, LETSCAREER_MENTORING_URL } from '../data/links';

// 하단 플로팅 바 (letscareer.co.kr/mentor-join 플로팅 바 디자인)
export function MobileDock() {
  return (
    <div className="fixed inset-x-0 bottom-[calc(16px+env(safe-area-inset-bottom))] z-20 px-4 sm:bottom-6">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 rounded-sm border border-white/40 bg-[#27272d]/[0.64] px-4 py-3 backdrop-blur-[10px] sm:px-5 sm:py-4">
        <p className="hidden text-xl font-semibold leading-[1.4] text-[#fafafa] md:block">
          대기업 현직 멘토 기획전
        </p>
        <div className="flex flex-1 items-center gap-3 md:flex-none">
          <a
            href={LETSCAREER_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xs text-primary flex-1 bg-white px-5 py-3 text-center text-base font-medium hover:bg-[#eef0ff] md:flex-none"
          >
            문의하기
          </a>
          <Link
            href={LETSCAREER_MENTORING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xs bg-primary flex-[2] whitespace-nowrap px-5 py-3 text-center text-base font-medium text-white hover:bg-[#3a41d6] md:flex-none"
          >
            더 다양한 멘토 구경하기
          </Link>
        </div>
      </div>
    </div>
  );
}
