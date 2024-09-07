const getMimeType = (extension: string): string => {
  const mimeTypes: { [key: string]: string } = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // 필요에 따라 더 많은 MIME 타입을 추가할 수 있습니다.
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

export const handleDownload = (fileUrl: string) => {
  const fileName = fileUrl.split('/').pop() || 'download';
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  const mimeType = getMimeType(fileExtension);

  fetch(fileUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: mimeType }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    })
    // eslint-disable-next-line no-console
    .catch((error) => console.error('Download failed:', error));
};
