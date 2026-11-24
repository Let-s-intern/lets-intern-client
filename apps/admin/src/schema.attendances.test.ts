import { describe, expect, it } from 'vitest';

import { attendances } from './schema';

const attendance = {
  id: 1,
  result: 'PASS',
  createDate: null,
};

describe('제출 상세 응답 스키마 optionTitles', () => {
  it('optionTitles 를 optionCodes 와 함께 전달한다', () => {
    const parsed = attendances.parse({
      attendanceList: [
        {
          attendance,
          optionCodes: ['WFB1', 'BASIC'],
          optionTitles: ['서면 피드백', 'BASIC'],
        },
      ],
    });

    expect(parsed.attendanceList[0].optionCodes).toEqual(['WFB1', 'BASIC']);
    expect(parsed.attendanceList[0].optionTitles).toEqual([
      '서면 피드백',
      'BASIC',
    ]);
  });

  it('서버가 optionTitles 를 안 내려주면 빈 배열이 된다', () => {
    const parsed = attendances.parse({
      attendanceList: [{ attendance, optionCodes: ['WFB1'] }],
    });

    expect(parsed.attendanceList[0].optionTitles).toEqual([]);
  });
});
