import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { LiveMentoringSettings } from '@/api/live-mentoring/liveMentoringSchema';

const saveMock = vi.fn();
let settingsData: LiveMentoringSettings | undefined;

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringSettingsQuery: () => ({ data: settingsData }),
  useUpdateLiveMentoringSettingsMutation: () => ({
    mutate: saveMock,
    isPending: false,
  }),
}));

import OpenSettingsPage from '../OpenSettingsPage';

const baseSettings: LiveMentoringSettings = {
  profileVisible: true,
  mosaicEnabled: false,
  mosaicBlur: 8,
  nickname: '자소서장인',
  profileImage: 'https://example.test/p.png',
  introduction: '소개',
  careers: [
    { company: '네이버', position: '기획', period: '2019-2026', visible: true },
    { company: '카카오', position: 'PM', period: '2016-2019', visible: false },
  ],
  categories: ['PERSONAL_STATEMENT'],
  durations: [30],
  feedbackStartDate: '2026-07-14',
  feedbackEndDate: '2026-07-28',
};

const renderPage = (overrides: Partial<LiveMentoringSettings> = {}) => {
  settingsData = { ...baseSettings, ...overrides };
  return render(<OpenSettingsPage />);
};

afterEach(() => {
  saveMock.mockReset();
  settingsData = undefined;
});

describe('OpenSettingsPage — 진행시간(다중) → 최저가', () => {
  it('초기 30분이면 35,000원을 표기한다', () => {
    renderPage({ durations: [30] });
    expect(screen.getAllByText('35,000원').length).toBeGreaterThan(0);
  });

  it('여러 진행시간이면 최저가, 하나만 남기면 그 가격으로 갱신된다', () => {
    renderPage({ durations: [30] });

    // 50분 추가 → [30,50] → 최저가 35,000 유지
    fireEvent.click(screen.getByRole('button', { name: '50분' }));
    expect(screen.getAllByText('35,000원').length).toBeGreaterThan(0);

    // 30분 해제 → [50] 만 남아 60,000
    fireEvent.click(screen.getByRole('button', { name: '30분' }));
    expect(screen.getAllByText('60,000원').length).toBeGreaterThan(0);
  });

  it('가격 입력 UI(number/text 가격 필드)가 없다', () => {
    renderPage();
    expect(screen.queryByLabelText('가격')).not.toBeInTheDocument();
  });
});

describe('OpenSettingsPage — 모자이크 강도 반영', () => {
  it('모자이크 ON + 강도 조절이 미리보기 블러에 반영된다', () => {
    renderPage({ mosaicEnabled: false });

    // 모자이크 켜기
    fireEvent.click(
      screen.getByRole('switch', { name: '프로필 자동 모자이크' }),
    );

    const slider = screen.getByLabelText('블러 강도');
    fireEvent.change(slider, { target: { value: '15' } });

    const image = screen.getByTestId('preview-profile-image');
    expect(image).toHaveStyle({ filter: 'blur(15px)' });
  });

  it('profileVisible=false 초기값은 익명 타이틀을 렌더한다', () => {
    renderPage({ profileVisible: false });
    expect(screen.getByTestId('preview-anonymous-title')).toHaveTextContent(
      '자소서장인의 1대1 라이브 멘토링',
    );
  });
});

describe('OpenSettingsPage — 저장 payload', () => {
  it('저장 시 갱신된 진행시간(다중)/모자이크 강도를 담아 mutate 를 호출한다', () => {
    renderPage({ durations: [30], mosaicEnabled: true });

    fireEvent.click(screen.getByRole('button', { name: '50분' })); // [30,50]
    fireEvent.change(screen.getByLabelText('블러 강도'), {
      target: { value: '12' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(saveMock).toHaveBeenCalledTimes(1);
    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettings;
    expect(payload.durations).toEqual([30, 50]);
    expect(payload.mosaicBlur).toBe(12);
  });

  it('타입을 여러 개 선택하면 payload categories 에 담긴다', () => {
    renderPage({ categories: ['PERSONAL_STATEMENT'] });

    fireEvent.click(screen.getByRole('button', { name: '이력서' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettings;
    expect(payload.categories).toEqual(['PERSONAL_STATEMENT', 'RESUME']);
  });

  it('피드백 기간 입력이 payload 에 반영된다', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('피드백 시작일'), {
      target: { value: '2026-08-01' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettings;
    expect(payload.feedbackStartDate).toBe('2026-08-01');
  });

  it('경력 노출 체크 토글이 payload 에 반영된다', () => {
    renderPage();

    // 두 번째 경력(카카오, 초기 visible=false)을 체크
    const kakao = screen.getByRole('checkbox', {
      name: /카카오/,
    });
    fireEvent.click(kakao);
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettings;
    expect(payload.careers[1].visible).toBe(true);
  });
});
