'use client';

import OutlinedButton from '@/common/button/OutlinedButton';

const COMPLETE_LINES = [
  '제출해 주신 내용은 운영진 확인 후 합격 인증으로 등록돼요.',
  '인증이 완료되면 회사생활 TIP VOD와 PDF를 이메일로 보내드릴게요.',
  '매월 추첨을 통해 선정된 10분께는 1만원의 합격 축하금도 드려요.',
];

/** 제출 완료 화면 */
export default function StepComplete({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex w-full flex-1 flex-col items-start gap-5 text-center md:gap-6">
      <h2 className="text-medium24 text-neutral-0 font-bold">
        합격 소식이 제출 되었어요!
      </h2>
      <div className="flex w-full flex-1 flex-col justify-between gap-6 md:gap-5">
        {/* 모바일에서만 한 줄씩 순차 페이드인 · 데스크톱은 바로 노출 */}
        <p className="text-neutral-20 text-xsmall16 flex flex-col gap-2.5 text-left tracking-tight md:gap-1">
          {COMPLETE_LINES.map((line, i) => (
            <span
              key={i}
              className="animate-[fade-in-up_0.5s_ease-out_forwards] opacity-0 md:animate-none md:opacity-100"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {line}
            </span>
          ))}
        </p>
        <OutlinedButton
          type="button"
          size="xl"
          onClick={onReset}
          className="mt-4 w-full py-3 md:py-4"
        >
          다시 인증하기
        </OutlinedButton>
      </div>
    </div>
  );
}
