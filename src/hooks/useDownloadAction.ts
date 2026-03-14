import {
  useApplicationDownloadQuery,
  type ApplicationDownloadType,
} from '@/api/application';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

type UseDownloadActionParams = {
  applicationId: number;
  type: ApplicationDownloadType;
  executeDownload: () => Promise<void>;
  enabled: boolean;
};

export function useDownloadAction({
  applicationId,
  type,
  executeDownload,
  enabled,
}: UseDownloadActionParams) {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: downloadInfo } = useApplicationDownloadQuery({
    applicationId,
    type,
    enabled,
  });

  const hasDownloaded = downloadInfo?.isDownloaded === true;

  const handleClick = () => {
    if (hasDownloaded) {
      void executeDownload();
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    await executeDownload();
    await queryClient.invalidateQueries({
      queryKey: ['applicationDownload', applicationId, type],
    });
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return {
    hasDownloaded,
    showConfirm,
    handleClick,
    handleConfirm,
    handleCancel,
  };
}
