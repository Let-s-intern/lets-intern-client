/** 계약 A12. 서버가 검사하지 않으므로 올리기 전에 어드민이 거른다 */

export const THUMBNAIL_MAX_BYTES = 2 * 1024 * 1024;

export const THUMBNAIL_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

/** `<input accept>` 값 */
export const THUMBNAIL_ACCEPT = THUMBNAIL_EXTENSIONS.map(
  (ext) => `.${ext}`,
).join(',');

/** 올릴 수 없으면 이유, 올릴 수 있으면 null */
export const validateThumbnailFile = (file: File): string | null => {
  const dotIndex = file.name.lastIndexOf('.');
  const extension =
    dotIndex < 0 ? '' : file.name.slice(dotIndex + 1).toLowerCase();
  if (!(THUMBNAIL_EXTENSIONS as readonly string[]).includes(extension)) {
    return 'jpg, png, webp 이미지만 올릴 수 있습니다.';
  }
  if (file.size > THUMBNAIL_MAX_BYTES) {
    return '2MB 이하 이미지만 올릴 수 있습니다.';
  }
  return null;
};
