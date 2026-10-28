import {
  formatFileSize,
  isRetryableUploadError,
  precheckAttachmentFile,
  uploadErrorMessage,
} from './attachmentUpload';

const MB = 1024 * 1024;

describe('precheckAttachmentFile', () => {
  it.each(['a.jpg', 'a.JPEG', 'a.png', 'a.webp'])(
    '이미지 %s 는 통과한다',
    (name) => {
      expect(precheckAttachmentFile('IMAGE', { name, size: MB })).toBeNull();
    },
  );

  it.each(['a.pdf', 'a.docx', 'a.PPTX', 'a.hwp', 'a.zip'])(
    '파일 %s 는 통과한다',
    (name) => {
      expect(precheckAttachmentFile('FILE', { name, size: MB })).toBeNull();
    },
  );

  it('형식에 맞지 않는 확장자는 허용 목록을 안내한다', () => {
    expect(precheckAttachmentFile('IMAGE', { name: 'a.pdf', size: 1 })).toBe(
      'jpg, jpeg, png, webp 파일만 올릴 수 있어요.',
    );
    expect(precheckAttachmentFile('FILE', { name: 'a.exe', size: 1 })).toBe(
      'pdf, docx, pptx, hwp, zip 파일만 올릴 수 있어요.',
    );
    expect(precheckAttachmentFile('FILE', { name: 'noext', size: 1 })).toBe(
      'pdf, docx, pptx, hwp, zip 파일만 올릴 수 있어요.',
    );
  });

  it('이미지는 10MB, 파일은 20MB 까지 받는다', () => {
    expect(
      precheckAttachmentFile('IMAGE', { name: 'a.png', size: 10 * MB }),
    ).toBeNull();
    expect(
      precheckAttachmentFile('IMAGE', { name: 'a.png', size: 10 * MB + 1 }),
    ).toBe('10MB 이하 파일만 올릴 수 있어요.');
    expect(
      precheckAttachmentFile('FILE', { name: 'a.pdf', size: 20 * MB }),
    ).toBeNull();
    expect(
      precheckAttachmentFile('FILE', { name: 'a.pdf', size: 20 * MB + 1 }),
    ).toBe('20MB 이하 파일만 올릴 수 있어요.');
  });

  it('파일 이름이 255자를 넘으면 막는다', () => {
    const name = `${'가'.repeat(252)}.pdf`;
    expect(precheckAttachmentFile('FILE', { name, size: 1 })).toBe(
      '파일 이름은 255자 이하여야 해요.',
    );
  });
});

describe('uploadErrorMessage / isRetryableUploadError', () => {
  it('U4 에러 코드를 문구로 바꾸고, 다시 해도 같은 실패는 재시도를 막는다', () => {
    expect(uploadErrorMessage('FILE', 'ONE_TIME_FORM_NOT_IN_PERIOD')).toBe(
      '신청 기간이 아니어서 올릴 수 없어요.',
    );
    expect(uploadErrorMessage('IMAGE', 'ONE_TIME_FORM_INVALID_ANSWER')).toBe(
      'jpg, jpeg, png, webp 파일만 올릴 수 있어요.',
    );
    expect(isRetryableUploadError('ONE_TIME_FORM_NOT_IN_PERIOD')).toBe(false);
    expect(isRetryableUploadError('ONE_TIME_FORM_UNKNOWN_QUESTION')).toBe(
      false,
    );
  });

  it('코드가 없는 실패(네트워크·PUT)는 다시 시도를 안내한다', () => {
    expect(uploadErrorMessage('FILE', undefined)).toBe(
      '업로드하지 못했어요. 다시 시도해 주세요.',
    );
    expect(isRetryableUploadError(undefined)).toBe(true);
  });
});

describe('formatFileSize', () => {
  it('1MB 를 넘으면 MB, 아니면 KB 로 적는다', () => {
    expect(formatFileSize(2.4 * MB)).toBe('2.4MB');
    expect(formatFileSize(300 * 1024)).toBe('300KB');
    expect(formatFileSize(10)).toBe('1KB');
  });
});
