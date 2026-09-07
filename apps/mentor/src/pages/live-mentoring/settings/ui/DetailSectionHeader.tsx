import type { ReactNode } from 'react';

interface DetailSectionHeaderProps {
  /** 시안의 파란 원 배지 숫자. 탭 순서와 같다. */
  step: number;
  /** 섹션 이름. 탭 라벨과 같은 문구를 쓴다. */
  name: string;
  /** 카드 본문 위에 오는 큰 제목. 시안의 "이 멘토링을 간단히 소개해 주세요" 자리. */
  heading: string;
  /** 큰 제목 아래 설명. 없으면 렌더하지 않는다. */
  description?: string;
  /** 헤더 우측. 선택 섹션의 `상세 페이지에 표시` 체크박스가 들어온다. */
  action?: ReactNode;
}

/**
 * 섹션 카드 헤더 (시안 1~5번 공통).
 *
 * 번호 배지만 여기에 둔다. 필수·선택 칩은 탭 줄(`DetailTabs`)로 옮겼다 — 무엇을
 * 반드시 채워야 하는지는 탭을 열기 전에 보여야 하는 정보다.
 *
 * 번호는 순서를 보여주는 장식이라 `aria-hidden` 이다.
 */
const DetailSectionHeader = ({
  step,
  name,
  heading,
  description,
  action,
}: DetailSectionHeaderProps) => (
  <header className="mb-5">
    <div className="mb-3 flex items-center gap-2">
      <span
        aria-hidden="true"
        className="bg-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
      >
        {step}
      </span>
      <h2 className="text-sm font-semibold text-gray-800">{name}</h2>
      {action ? <div className="ml-auto">{action}</div> : null}
    </div>
    <p className="text-lg font-bold text-gray-900">{heading}</p>
    {description ? (
      <p className="mt-1.5 text-xs text-gray-500">{description}</p>
    ) : null}
  </header>
);

export default DetailSectionHeader;
