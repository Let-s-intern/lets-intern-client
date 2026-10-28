import { STATUS_LABEL, STATUS_STEPS } from './status';

describe('STATUS_LABEL', () => {
  it('서버 상태를 PRD 의 표시 이름으로 바꾼다', () => {
    expect(STATUS_STEPS.map((s) => STATUS_LABEL[s])).toEqual([
      '확인 중',
      '검토 중',
      '회신 완료',
    ]);
  });
});
