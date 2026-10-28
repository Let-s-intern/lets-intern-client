import { documentLabel, isPdfDocument } from './isPdfDocument';

describe('isPdfDocument', () => {
  it.each([
    [{ fileName: '이력서.pdf', fileUrl: null }, true],
    [{ fileName: 'resume.PDF', fileUrl: null }, true],
    [{ fileName: null, fileUrl: 'https://cdn.example.com/a/b.pdf?v=1' }, true],
    [
      { fileName: '자소서.docx', fileUrl: 'https://cdn.example.com/a.docx' },
      false,
    ],
    [{ fileName: null, fileUrl: 'https://cdn.example.com/pdf/a.png' }, false],
    [{ fileName: null, fileUrl: null }, false],
  ])('%j -> %s', (document, expected) => {
    expect(isPdfDocument(document)).toBe(expected);
  });
});

describe('documentLabel', () => {
  it('파일 이름이 없으면 URL 의 마지막 조각을 쓴다', () => {
    expect(
      documentLabel({
        fileName: null,
        fileUrl:
          'https://cdn.example.com/a/%EC%9D%B4%EB%A0%A5%EC%84%9C.pdf?x=1',
      }),
    ).toBe('이력서.pdf');
    expect(documentLabel({ fileName: 'a.pdf', fileUrl: null })).toBe('a.pdf');
  });
});
