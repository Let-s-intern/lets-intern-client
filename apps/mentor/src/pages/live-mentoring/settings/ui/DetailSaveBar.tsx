import { FLOATING_BAR_BODY, FLOATING_BAR_WRAP } from '../../constants';

interface DetailSaveBarProps {
  /** 공개 상세 페이지 주소. 사용자 정보를 아직 못 받았으면 null. */
  publicDetailHref: string | null;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onRevert: () => void;
}

/**
 * 상태 아이콘 2종 (시안 기준). 뜻은 옆 문구가 전하므로 그림은 낭독에서 숨긴다.
 * 저장됨=체크, 미저장 변경=경고.
 */
const iconProps = {
  'aria-hidden': true,
  viewBox: '0 0 20 20',
  className: 'h-4 w-4 shrink-0',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const CheckIcon = () => (
  <svg {...iconProps}>
    <path d="m4.5 10.5 3.5 3.5 7.5-8" />
  </svg>
);

const AlertIcon = () => (
  <svg {...iconProps}>
    <circle cx="10" cy="10" r="7.5" />
    <path d="M10 6v4.5" />
    <path d="M10 13.6h.01" />
  </svg>
);

const barClass = FLOATING_BAR_BODY;
/*
 * 사이드바(296px)를 뺀 콘텐츠 영역의 **가운데**에 둔다.
 *
 * 편집 카드 폭에 맞추면 미리보기 컬럼 비율이 바뀔 때마다 여기도 따라 고쳐야 하고,
 * 화면 전체 기준 중앙정렬은 사이드바 때문에 왼쪽으로 치우쳐 보인다.
 * 오픈 설정의 하단 바도 같은 규칙을 쓴다(`live-mentoring/constants.ts`).
 */
const wrapClass = FLOATING_BAR_WRAP;

/**
 * 하단 고정 저장 바 (PRD §7).
 *
 * 저장·되돌리기를 화면 아래 한 자리에 고정한다. 탭마다 저장 버튼을 두면 멘토가
 * "이 탭만 저장되는 건가"를 판단해야 하는데, 저장은 항상 상세 페이지 전체다.
 *
 * 편집 진입점(탭 이동·미리보기)은 이 컴포넌트가 관여하지 않는다 — 이 바는 저장과
 * 상태를 알리는 자리다.
 */
const DetailSaveBar = ({
  publicDetailHref,
  isDirty,
  isSaving,
  onSave,
  onRevert,
}: DetailSaveBarProps) => {
  return (
    <div className={wrapClass}>
      <div className={barClass}>
        <p
          role="status"
          className={`flex min-w-0 items-center gap-2 text-sm font-medium ${
            isDirty ? 'text-system-error' : 'text-gray-500'
          }`}
        >
          {isDirty ? <AlertIcon /> : <CheckIcon />}
          <span className="truncate">
            {isDirty ? '저장하지 않은 변경사항이 있어요.' : '저장된 상태예요.'}
          </span>
        </p>

        <div className="flex shrink-0 items-center gap-2">
          {/* 잠금 안내가 있던 시절 그 자리에만 있던 보기 경로다. 잠금이 사라져도
              자기 페이지를 확인하는 길은 남긴다. */}
          {publicDetailHref === null ? null : (
            <a
              href={publicDetailHref}
              target="_blank"
              rel="noopener noreferrer"
              className="border-primary text-primary hover:bg-primary shrink-0 whitespace-nowrap rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold transition-colors hover:text-white"
            >
              멘토링 상세 페이지 보기
            </a>
          )}
          <button
            type="button"
            onClick={onRevert}
            disabled={!isDirty || isSaving}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
          >
            변경사항 되돌리기
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isSaving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailSaveBar;
