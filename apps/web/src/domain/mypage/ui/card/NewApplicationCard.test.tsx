jest.mock('@letscareer/api', () => ({
  createDefaultAxios: jest.fn(() => ({})),
  createV2Axios: jest.fn(() => ({})),
  fetchJson: jest.fn(),
}));

import { getDetailHref } from './NewApplicationCard';

describe('신청 카드 상세 경로', () => {
  it('LIVE_MENTORING은 라이브 멘토링 상세로 이동한다', () => {
    expect(
      getDetailHref({
        id: 1,
        programId: 1,
        programTypeKey: 'LIVE_MENTORING',
        thumbnail: '',
        title: '라이브 멘토링',
        description: '',
        statusLabel: '참여중',
        categoryLabel: 'LIVE 멘토링',
        dateLabel: '진행기간',
        dateText: '',
        isCompleted: false,
      }),
    ).toBe('/live-mentoring/1');
  });

  it('기존 LIVE는 기존 상세 경로를 유지한다', () => {
    expect(
      getDetailHref({
        id: 1,
        programId: 2,
        programTypeKey: 'LIVE',
        thumbnail: '',
        title: 'LIVE 클래스',
        description: '',
        statusLabel: '참여중',
        categoryLabel: 'LIVE 클래스',
        dateLabel: '진행기간',
        dateText: '',
        isCompleted: false,
      }),
    ).toBe('/program/live/2');
  });
});
