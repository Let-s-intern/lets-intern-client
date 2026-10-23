import { Button } from '@mui/material';
import { ReactNode } from 'react';
import { FaSave } from 'react-icons/fa';

export interface ChallengeEditorSection {
  id: string;
  label: string;
}

/** 챌린지 개설·수정 화면의 섹션 이동 위치. 페이지는 같은 id 로 앵커를 둔다 */
export const CHALLENGE_EDITOR_SECTIONS: ChallengeEditorSection[] = [
  { id: 'challenge-section-basic', label: '기본 정보' },
  { id: 'challenge-section-price', label: '가격·일정' },
  { id: 'challenge-section-option', label: '옵션' },
  { id: 'challenge-section-version', label: '버전' },
  { id: 'challenge-section-description', label: '프로그램 소개' },
  { id: 'challenge-section-faq', label: 'FAQ' },
];

interface Props {
  onSave: () => void;
  saving: boolean;
  /** 저장을 더 받지 않을 때. 버튼 문구는 saveLabel */
  saveDisabled?: boolean;
  saveLabel?: string;
  sections?: ChallengeEditorSection[];
  /** 저장 버튼 앞에 둘 버튼 (미리보기 등) */
  extra?: ReactNode;
}

const scrollToSection = (id: string) =>
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/**
 * 챌린지 개설·수정 화면 하단 가운데에 떠 있는 바 (LC-3505).
 * 왼쪽은 섹션 바로가기, 오른쪽은 저장. 왼쪽 사이드바(w-48)를 뺀 본문 가운데에 둔다.
 */
function ChallengeEditorActionBar({
  onSave,
  saving,
  saveDisabled = false,
  saveLabel = '저장',
  sections = CHALLENGE_EDITOR_SECTIONS,
  extra,
}: Props) {
  return (
    <div className="fixed bottom-6 left-[calc(50%+6rem)] z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl border border-gray-200 bg-white/95 px-3 py-2 shadow-xl backdrop-blur">
      <nav aria-label="섹션 바로가기" className="flex items-center gap-1">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className="rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            onClick={() => scrollToSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>
      <span className="h-6 w-px bg-gray-200" aria-hidden />
      {extra}
      <Button
        variant="contained"
        color="primary"
        disabled={saving || saveDisabled}
        startIcon={<FaSave size={12} />}
        onClick={onSave}
        sx={{ borderRadius: '8px', px: 3, boxShadow: 'none' }}
      >
        {saving ? '저장 중' : saveLabel}
      </Button>
    </div>
  );
}

export default ChallengeEditorActionBar;
