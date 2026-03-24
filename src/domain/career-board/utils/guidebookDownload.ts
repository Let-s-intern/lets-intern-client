import { patchApplicationDownload } from '@/api/application';
import { getGuidebook } from '@/api/program';

interface ErrorWithStatus {
  response?: {
    status?: number;
  };
}

function openInNewTab(url: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function triggerFileDownload(url: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function downloadS3File(url: string): Promise<void> {
  const rawName = url.split('/').pop()?.split('?')[0] || '가이드북.pdf';
  let fileName: string;
  try {
    fileName = decodeURIComponent(rawName);
  } catch {
    fileName = rawName;
  }

  if (isIOS()) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    triggerFileDownload(blobUrl, fileName);
    // 인앱 브라우저에서 다운로드를 비동기 처리할 수 있으므로 즉시 해제하지 않음
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
  } catch {
    // CORS 등으로 fetch 실패 시 <a download>로 직접 시도
    triggerFileDownload(url, fileName);
  }
}

export async function downloadGuidebookAndTrack(
  applicationId: number,
  guidebookId: number,
): Promise<void> {
  // iOS Safari는 await 이후 window.open을 차단하므로 클릭 컨텍스트가 살아있는 지금 미리 열기
  const iosTab = isIOS()
    ? window.open('', '_blank', 'noopener,noreferrer')
    : null;

  const guidebook = await getGuidebook(guidebookId);
  const contentFileUrl = guidebook.contentFileUrl ?? undefined;
  const contentUrl = guidebook.contentUrl ?? undefined;

  if (isIOS()) {
    const url = contentFileUrl || contentUrl;
    if (iosTab && url) {
      iosTab.location.href = url;
    } else {
      iosTab?.close();
      return;
    }
  } else if (contentFileUrl) {
    await downloadS3File(contentFileUrl);
  } else if (contentUrl) {
    openInNewTab(contentUrl);
  } else {
    return;
  }

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
