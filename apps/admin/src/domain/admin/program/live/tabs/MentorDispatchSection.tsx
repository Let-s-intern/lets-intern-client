import { useGetLiveMentorPasswordQuery } from '@/api/program';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useState } from 'react';

import MentorContentModal from './MentorContentModal';

interface MentorDispatchSectionProps {
  liveId: number;
}

/**
 * PRD-서면라이브 분리 §5.4 — 어드민 라이브 상세 멘토 발송 섹션.
 *
 * 1) "멘토 발송 정보 조회" 버튼 → `useGetLiveMentorPasswordQuery` 호출 (lazy: enabled toggle)
 * 2) 비밀번호 표시 + 복사 버튼
 * 3) "멘토 전달 내용 미리보기" 버튼 → MentorContentModal 오픈
 *
 * 비밀번호는 민감 정보이므로 명시적 사용자 액션(버튼 클릭) 후에만 조회한다.
 */
const MentorDispatchSection = ({ liveId }: MentorDispatchSectionProps) => {
  const { snackbar } = useAdminSnackbar();
  const [enabled, setEnabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } =
    useGetLiveMentorPasswordQuery({
      liveId,
      enabled: enabled && Number.isFinite(liveId) && liveId > 0,
    });

  const password = data?.mentorPassword ?? '';

  const handleFetchPassword = () => {
    if (!enabled) {
      setEnabled(true);
      return;
    }
    refetch();
  };

  const handleCopyPassword = async () => {
    if (!password) return;
    try {
      await window.navigator.clipboard.writeText(password);
      snackbar('비밀번호를 복사했습니다.');
    } catch {
      snackbar('복사에 실패했습니다.');
    }
  };

  return (
    <section className="border-neutral-80 rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-medium16 text-neutral-0 font-semibold">
          멘토 발송 정보
        </h3>
        <button
          type="button"
          className="border-primary text-primary text-xsmall14 rounded border px-3 py-1.5"
          onClick={handleFetchPassword}
          disabled={isLoading}
        >
          {isLoading
            ? '조회 중...'
            : enabled
              ? '다시 조회'
              : '멘토 발송 정보 조회'}
        </button>
      </div>

      {isError ? (
        <div className="text-xsmall14 text-system-error py-2">
          멘토 비밀번호를 불러오지 못했습니다.
          {error instanceof Error ? ` (${error.message})` : null}
        </div>
      ) : null}

      {enabled && !isError ? (
        <div className="bg-neutral-95 mb-3 flex items-center justify-between rounded-md px-4 py-3">
          <div className="text-xsmall14 text-neutral-20">
            <span className="text-neutral-40 mr-2">비밀번호</span>
            <span className="font-mono">
              {isLoading ? '...' : password || '미발급'}
            </span>
          </div>
          <button
            type="button"
            className="border-neutral-70 text-xsmall14 rounded border px-3 py-1"
            onClick={handleCopyPassword}
            disabled={!password}
          >
            복사
          </button>
        </div>
      ) : null}

      <button
        type="button"
        className="bg-primary text-xsmall14 rounded px-3 py-1.5 text-white disabled:opacity-50"
        onClick={() => setModalOpen(true)}
        disabled={!password}
      >
        멘토 전달 내용 미리보기
      </button>
      {!password ? (
        <p className="text-xsmall12 text-neutral-40 mt-2">
          먼저 멘토 발송 정보를 조회해 주세요.
        </p>
      ) : null}

      {modalOpen && password ? (
        <MentorContentModal
          liveId={liveId}
          password={password}
          onClose={() => setModalOpen(false)}
        />
      ) : null}
    </section>
  );
};

export default MentorDispatchSection;
