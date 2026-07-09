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

// 공유 라이브 슬롯/예약 모달은 이 단위 테스트 대상이 아니므로 스텁 처리
// (실 컴포넌트는 feedback query 훅을 호출해 QueryClient 가 필요하다).
vi.mock('@/pages/feedback-live-availability/FeedbackAvailabilityModal', () => ({
  default: () => null,
}));
vi.mock('@/pages/feedback-live-reservation/ui/ReservationListModal', () => ({
  default: () => null,
}));

import OpenSettingsPage from '../OpenSettingsPage';

const baseSettings: LiveMentoringSettings = {
  isOpen: false,
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

  it('profileVisible=false 면 이미지 자리에 "○○ 멘토님의 멘토링" 문구를 렌더한다', () => {
    renderPage({ profileVisible: false });
    expect(screen.getByTestId('preview-image-placeholder')).toHaveTextContent(
      '자소서장인 멘토님의 멘토링',
    );
  });

  it('프로필 노출이 꺼져 있으면 모자이크 설정이 보이지 않는다', () => {
    renderPage({ profileVisible: false, mosaicEnabled: true });
    expect(
      screen.queryByRole('switch', { name: '프로필 자동 모자이크' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText('블러 강도')).not.toBeInTheDocument();
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

  it('대표 경력은 하나만 선택되며 payload 에 반영된다(라디오)', () => {
    renderPage();

    // 두 번째 경력(카카오)을 대표로 선택 → 첫 경력은 해제
    const kakao = screen.getByRole('radio', { name: /카카오/ });
    fireEvent.click(kakao);
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettings;
    expect(payload.careers[1].visible).toBe(true);
    expect(payload.careers[0].visible).toBe(false);
  });

  it('경력이 여러 개 visible 로 들어와도 대표는 하나로 정규화되어 라디오가 동작한다', () => {
    // 두 경력 모두 visible=true 인 상태(실 목 데이터 케이스)
    renderPage({
      careers: [
        {
          company: '네이버',
          position: '기획',
          period: '2019-2026',
          visible: true,
        },
        {
          company: '카카오',
          position: 'PM',
          period: '2016-2019',
          visible: true,
        },
      ],
    });

    // 정규화로 첫 경력만 선택됨
    expect(screen.getByRole('radio', { name: /네이버/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /카카오/ })).not.toBeChecked();

    // 두 번째로 전환 가능
    fireEvent.click(screen.getByRole('radio', { name: /카카오/ }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettings;
    expect(payload.careers[0].visible).toBe(false);
    expect(payload.careers[1].visible).toBe(true);
  });
});

describe('OpenSettingsPage — 타입 필수', () => {
  it('타입을 모두 해제하면 경고문구가 뜨고 저장이 비활성화된다', () => {
    renderPage({ categories: ['PERSONAL_STATEMENT'] });

    // 유일 선택된 타입 해제 → 0개
    fireEvent.click(screen.getByRole('button', { name: '자기소개서' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      '타입을 최소 1개 이상 선택해야 저장할 수 있어요.',
    );
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });

  it('타입이 0개면(미변경) 오픈하기가 비활성이고 mutate 가 호출되지 않는다', () => {
    renderPage({ categories: [] });

    const openBtn = screen.getByRole('button', { name: '오픈하기' });
    expect(openBtn).toBeDisabled();
    fireEvent.click(openBtn);
    expect(saveMock).not.toHaveBeenCalled();
  });
});

describe('OpenSettingsPage — 오픈 상태/버튼', () => {
  it('변경사항이 없고 미오픈이면 오픈하기 버튼을 보인다(저장 없음)', () => {
    renderPage();
    expect(screen.getByRole('button', { name: '오픈하기' })).toBeEnabled();
    expect(screen.queryByRole('button', { name: '저장' })).not.toBeInTheDocument();
  });

  it('변경사항이 생기면 저장 버튼으로 바뀐다', () => {
    renderPage({ durations: [30] });
    fireEvent.click(screen.getByRole('button', { name: '50분' })); // dirty
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '오픈하기' }),
    ).not.toBeInTheDocument();
  });

  it('오픈하기 클릭 시 isOpen=true 로 저장을 호출한다', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: '오픈하기' }));
    expect(saveMock).toHaveBeenCalledTimes(1);
    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettings;
    expect(payload.isOpen).toBe(true);
  });

  it('오픈 중이면 설정을 잠그고 오픈 닫기 버튼만 노출한다', () => {
    renderPage({ isOpen: true });
    expect(screen.getByRole('button', { name: /오픈 닫기/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '저장' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '오픈하기' }),
    ).not.toBeInTheDocument();
  });
});
