import { patchApplicationDownload } from '@/api/application';
import { getGuidebook } from '@/api/program';

interface ErrorWithStatus {
  response?: {
    status?: number;
  };
}

export async function downloadGuidebookAndTrack(
  applicationId: number,
  guidebookId: number,
): Promise<void> {
  const guidebook = await getGuidebook(guidebookId);
  const contentFileUrl = guidebook.contentFileUrl ?? undefined;
  const contentUrl = guidebook.contentUrl ?? undefined;

  const urlToOpen = contentFileUrl || contentUrl;
  if (!urlToOpen) {
    return;
  }

  window.open(urlToOpen, '_blank', 'noopener,noreferrer');

  try {
    await patchApplicationDownload({
      applicationId,
      type: 'GUIDEBOOK',
    });
  } catch (error: unknown) {
    const status = (error as ErrorWithStatus).response?.status;
    if (status === 409) {
      return;
    }
    alert(
      '가이드북 다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    );
  }
}
