'use client';

import { XIcon } from 'lucide-react';

interface ExperienceFormProps {
  onClose: () => void;
}

export const ExperienceForm = ({ onClose }: ExperienceFormProps) => {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* 헤더 */}
      <header className="flex h-[72px] items-center justify-between px-4 py-5">
        <h1 className="text-small20 font-semibold">경험 작성</h1>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center"
        >
          <XIcon size={24} />
        </button>
      </header>

      {/* 스크롤 가능한 메인 컨텐츠 */}
      <div className="flex-1 overflow-y-auto px-7 py-2">
        {/* 가이드 텍스트 */}
        <div className="mb-6 rounded-sm bg-primary-5 px-4 py-3">
          <p className="text-xsmall14 font-normal leading-[1.375rem] text-neutral-30">
            활동이 다양할 수록 좋겠지만, 활동 내용 보다는 구체적인
            에피소드(직면한 문제, 내 역할, 역량, 배운점 등)을 중심으로 STAR
            양식을 정리해 주세요. 즉, 하나의 활동에도 여러 STAR 양식이 나올 수
            있습니다.
          </p>
          <span className="mt-1 flex items-center gap-1 text-sm text-primary-dark underline">
            <a
              href="https://letsintern.notion.site/28f5e77cbee180e6b9eff73282349c88"
              target="_blank"
              rel="noopener noreferrer"
            >
              👉다양한 경험 정리 우수 예시 보러가기👈
            </a>
          </span>
        </div>

        {/* 메인 폼 영역 - 추후 섹션들이 추가될 예정 */}
        <div className="flex flex-col gap-8">
          {/* TODO: 기본 정보 섹션 */}
          {/* TODO: 경험 상세 작성 섹션 */}
          {/* TODO: 핵심 역량 섹션 */}
        </div>
      </div>

      {/* 푸터 */}
      <footer className="flex h-[64px] items-center justify-end gap-4 px-5 py-3">
        {/* TODO: 자동 저장 시간 표시 */}
        <div className="text-xsmall14 leading-[1.375rem] text-neutral-50">
          자동 저장 완료 10.19 04:17
        </div>
        <button
          className="hover:bg-primary-hover w-[80px] rounded-sm bg-primary px-3 py-2 text-xsmall16 font-medium text-white disabled:bg-neutral-70 disabled:text-white"
          disabled
        >
          저장
        </button>
      </footer>
    </div>
  );
};
