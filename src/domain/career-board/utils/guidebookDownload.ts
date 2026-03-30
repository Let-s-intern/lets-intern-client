import { patchApplicationDownload } from '@/api/application';

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

function downloadS3File(url: string): void {
  const rawName = url.split('/').pop()?.split('?')[0] || '가이드북.pdf';
  let fileName: string;
  try {
    fileName = decodeURIComponent(rawName);
  } catch {
    fileName = rawName;
  }

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isIOS) {
    openInNewTab(url);
    return;
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      triggerFileDownload(blobUrl, fileName);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
    })
    .catch(() => {
      // CORS 등으로 fetch 실패 시 <a download>로 직접 시도
      triggerFileDownload(url, fileName);
    });
}

interface DownloadGuidebookParams {
  applicationId: number;
  contentFileUrl?: string;
  contentUrl?: string;
}

/** 가이드북 다운로드 실행 + 다운로드 기록 PATCH (동기적으로 다운로드 시작, PATCH promise 반환) */
export function downloadGuidebookAndTrack({
  applicationId,
  contentFileUrl,
  contentUrl,
}: DownloadGuidebookParams): Promise<void> {
  if (contentFileUrl) {
    downloadS3File(contentFileUrl);
  } else if (contentUrl) {
    openInNewTab(contentUrl);
  } else {
    return Promise.resolve();
  }

  return patchApplicationDownload({
    applicationId,
    type: 'GUIDEBOOK',
  }).catch(() => {});
}
