import {
  getApplicationDownloadStatus,
  type ApplicationDownloadType,
} from '@/api/application';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

type UseDownloadActionParams = {
  applicationId: number;
  type: ApplicationDownloadType;
  executeDownload: () => Promise<void>;
  onComplete?: () => void;
};

export function useDownloadAction({
  applicationId,
  type,
  executeDownload,
  onComplete,
}: UseDownloadActionParams) {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    void (async () => {
      const data = await queryClient.fetchQuery({
        queryKey: ['applicationDownload', applicationId, type],
        queryFn: () => getApplicationDownloadStatus({ applicationId, type }),
      });
      if (data.isDownloaded) {
        await executeDownload();
        onComplete?.();
      } else {
        setShowConfirm(true);
      }
    })();
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    await executeDownload();
    onComplete?.();
    await queryClient.invalidateQueries({
      queryKey: ['applicationDownload', applicationId, type],
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
