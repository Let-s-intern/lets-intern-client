import type { ReactNode } from 'react';

interface DetailSectionHeaderProps {
  /** 시안의 파란 원 배지 숫자. 탭 순서와 같다. */
  step: number;
  /** 섹션 이름. 탭 라벨과 같은 문구를 쓴다. */
  name: string;
  required: boolean;
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
 * 번호 배지와 필수·선택 칩은 **탭이 아니라 여기**에 있다. 탭 줄에 다 넣으면 6개가
 * 두 줄로 넘치고, 정작 지금 편집 중인 섹션이 무엇인지가 흐려진다.
 *
 * 번호는 순서를 보여주는 장식이라 `aria-hidden` 이다. 필수 여부는 칩이 글자로
 * 전하므로 따로 숨기지 않는다.
 */
const DetailSectionHeader = ({
  step,
  name,
  required,
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
      <span
        className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
          required ? 'bg-primary-10 text-primary' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {required ? '필수' : '선택'}
      </span>
      {action ? <div className="ml-auto">{action}</div> : null}
    </div>
    <p className="text-lg font-bold text-gray-900">{heading}</p>
    {description ? (
      <p className="mt-1.5 text-xs text-gray-500">{description}</p>
    ) : null}
  </header>
);

export default DetailSectionHeader;
