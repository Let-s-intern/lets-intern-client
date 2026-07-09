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
  durationMin: 30,
  price: 35000,
  category: 'PERSONAL_STATEMENT',
};

const renderPage = (overrides: Partial<LiveMentoringSettings> = {}) => {
  settingsData = { ...baseSettings, ...overrides };
  return render(<OpenSettingsPage />);
};

afterEach(() => {
  saveMock.mockReset();
  settingsData = undefined;
});

describe('OpenSettingsPage — 진행시간 → 가격 매핑', () => {
  it('초기 30분이면 35,000원을 표기한다', () => {
    renderPage({ durationMin: 30, price: 35000 });
    expect(screen.getAllByText('35,000원').length).toBeGreaterThan(0);
  });

  it('50분 선택 시 60,000원으로 자동 갱신된다', () => {
    renderPage({ durationMin: 30, price: 35000 });

    fireEvent.click(screen.getByRole('button', { name: '50분' }));

    expect(screen.getAllByText('60,000원').length).toBeGreaterThan(0);
    expect(screen.queryByText('35,000원')).not.toBeInTheDocument();
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
  it('저장 시 갱신된 진행시간/가격/모자이크 강도를 담아 mutate 를 호출한다', () => {
    renderPage({ durationMin: 30, price: 35000, mosaicEnabled: true });

    fireEvent.click(screen.getByRole('button', { name: '50분' }));
    fireEvent.change(screen.getByLabelText('블러 강도'), {
      target: { value: '12' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(saveMock).toHaveBeenCalledTimes(1);
    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettings;
    expect(payload.durationMin).toBe(50);
    expect(payload.price).toBe(60000);
    expect(payload.mosaicBlur).toBe(12);
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
