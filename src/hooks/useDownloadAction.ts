import { useMypageApplicationsQueryKey } from '@/api/application';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

type UseDownloadActionParams = {
  isDownloaded: boolean;
  executeDownload: () => void | Promise<void>;
  onComplete?: () => void;
};

export function useDownloadAction({
  isDownloaded: initialIsDownloaded,
  executeDownload,
  onComplete,
}: UseDownloadActionParams) {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const handleClick = () => {
    if (initialIsDownloaded) {
      executeDownload();
      onComplete?.();
    } else {
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    const result = executeDownload();
    onComplete?.();
    // 첫 다운로드 시에만 PATCH 완료 후 목록 갱신 (다른 페이지 이동 시 최신 상태 반영)
    Promise.resolve(result).then(() => {
      queryClient.invalidateQueries({
        queryKey: [useMypageApplicationsQueryKey],
      });
    });
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return {
    showConfirm,
    handleClick,
    handleConfirm,
    handleCancel,
  };
}
