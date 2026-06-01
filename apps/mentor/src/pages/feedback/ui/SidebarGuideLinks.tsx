import { mentorConfig } from '@/constants/config';

interface SidebarGuideLinksProps {
  /** 가이드 링크 라벨 목록 (위→아래 순서로 세로 정렬) */
  labels: ReadonlyArray<string>;
}

/**
 * 피드백 모달 좌측 멘티 리스트 하단의 가이드 링크 버튼들.
 * 전부 외부 가이드 문서(`mentorConfig.feedbackGuidelineUrl`)로 연결되며 세로로 정렬한다.
 */
const SidebarGuideLinks = ({ labels }: SidebarGuideLinksProps) => (
  <div className="flex shrink-0 flex-col gap-2">
    {labels.map((label) => (
      <a
        key={label}
        href={mentorConfig.feedbackGuidelineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-1 rounded-md border border-gray-300 px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-800"
      >
        <span>{label}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          className="shrink-0"
        >
          <path
            d="M6 3.5H3.5V12.5H12.5V10M9.5 3.5H12.5V6.5M12.5 3.5L7 9"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    ))}
  </div>
);

export default SidebarGuideLinks;
