import { describe, expect, it } from 'vitest';

import { guidebookImportSchema } from '@/schema';

import { getGuidebookImportErrorMessage } from './guidebookImportError';

const parseImport = (text: string) =>
  guidebookImportSchema.parse(JSON.parse(text));

const catchError = (fn: () => unknown) => {
  try {
    fn();
  } catch (error) {
    return error;
  }
  throw new Error('오류가 나지 않았다');
};

describe('getGuidebookImportErrorMessage', () => {
  it('JSON 문법 오류는 형식 오류로 알려 준다', () => {
    const error = catchError(() => parseImport('{ "title": '));
    expect(getGuidebookImportErrorMessage(error)).toBe(
      'Import 실패: JSON 형식이 올바르지 않습니다',
    );
  });

  it('스키마 위반은 첫 번째 필드 경로와 사유를 담는다', () => {
    const error = catchError(() => parseImport('{"price":"990"}'));
    expect(getGuidebookImportErrorMessage(error)).toBe(
      'Import 실패: price - Expected number, received string',
    );
  });

  it('중첩 필드는 점으로 이은 경로를 보여 준다', () => {
    const error = catchError(() =>
      parseImport('{"programTypeInfo":[{"programClassification":"서류"}]}'),
    );
    expect(getGuidebookImportErrorMessage(error)).toContain(
      'programTypeInfo.0.programClassification',
    );
  });

  it('위반이 여럿이면 첫 번째만 보여 준다', () => {
    const error = catchError(() =>
      parseImport('{"price":"990","discount":"1"}'),
    );
    const message = getGuidebookImportErrorMessage(error);
    expect(message).toContain('price');
    expect(message).not.toContain('discount');
  });

  it('최상위가 객체가 아니면 최상위 값으로 알려 준다', () => {
    const error = catchError(() => parseImport('null'));
    expect(getGuidebookImportErrorMessage(error)).toContain('최상위 값');
  });

  it('알 수 없는 오류는 이유 없는 기본 문구로 둔다', () => {
    expect(getGuidebookImportErrorMessage(new Error('x'))).toBe('Import 실패');
  });
});
