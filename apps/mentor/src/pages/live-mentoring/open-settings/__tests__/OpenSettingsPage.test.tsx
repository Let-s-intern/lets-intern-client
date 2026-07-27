import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  LiveMentoringSettings,
  LiveMentoringSettingsUpdate,
} from '@/api/live-mentoring/liveMentoringSchema';

const saveMock = vi.fn();
const setRepresentativeCareerMock = vi.fn();
let settingsData: LiveMentoringSettings | undefined;

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringSettingsQuery: () => ({ data: settingsData }),
  useUpdateLiveMentoringSettingsMutation: () => ({
    mutate: saveMock,
    isPending: false,
  }),
}));

// 대표 경력은 오픈 설정 저장과 별개로 UserCareer 전용 API 로 즉시 저장된다.
vi.mock('@/api/career/career', () => ({
  useSetRepresentativeCareerMutation: () => ({
    mutate: setRepresentativeCareerMock,
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
  nickname: '자소서장인',
  profileImage: 'https://example.test/p.png',
  introduction: '소개',
  careers: [
    {
      id: 1,
      company: '네이버',
      field: '기획',
      job: '기획',
      position: '기획',
      department: null,
      employmentType: '정규직',
      startDate: '2019-01',
      endDate: null,
      isAddedByAdmin: false,
      isRepresentative: true,
    },
    {
      id: 2,
      company: '카카오',
      field: '기획',
      job: 'PM',
      position: 'PM',
      department: null,
      employmentType: '정규직',
      startDate: '2016-01',
      endDate: '2019-01',
      isAddedByAdmin: false,
      isRepresentative: false,
    },
  ],
  title: '자소서 실전 첨삭 멘토링',
  isOpen: false,
  categories: ['PERSONAL_STATEMENT'],
  durations: [30],
  feedbackStartDate: '2026-07-14',
  feedbackEndDate: '2026-07-28',
};

const renderPage = (overrides: Partial<LiveMentoringSettings> = {}) => {
  settingsData = { ...baseSettings, ...overrides };
  return render(
    <MemoryRouter>
      <OpenSettingsPage />
    </MemoryRouter>,
  );
};

afterEach(() => {
  saveMock.mockReset();
  settingsData = undefined;
});

describe('OpenSettingsPage — 프로필은 읽기 전용', () => {
  it('닉네임·소개·경력을 표시만 하고, 프로필 페이지로 이동하는 링크를 보여준다', () => {
    renderPage();
    // 프로필 섹션과 우측 미리보기 양쪽에 표시되므로 복수 매치를 허용한다.
    expect(screen.getAllByText('자소서장인').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/네이버/).length).toBeGreaterThan(0);
    expect(
      screen.getByRole('link', { name: '프로필 페이지에서 수정하기' }),
    ).toHaveAttribute('href', '/profile');
  });

  it('모자이크/프로필 노출 토글은 더 이상 렌더되지 않는다', () => {
    renderPage();
    expect(
      screen.queryByRole('switch', { name: '프로필 노출' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('switch', { name: '프로필 자동 모자이크' }),
    ).not.toBeInTheDocument();
  });
});

describe('OpenSettingsPage — 대표 경력 지정(전용 API 로 즉시 저장)', () => {
  it('서버가 내려준 isRepresentative 경력이 선택된 상태로 보인다', () => {
    renderPage();
    expect(screen.getByRole('radio', { name: /네이버/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /카카오/ })).not.toBeChecked();
  });

  it('첫 경력이 아니라 isRepresentative 가 true 인 경력을 따른다', () => {
    const settings = baseSettings;
    renderPage({
      careers: settings.careers.map((career) => ({
        ...career,
        isRepresentative: career.id === 2,
      })),
    });

    expect(screen.getByRole('radio', { name: /카카오/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /네이버/ })).not.toBeChecked();
  });

  it('대표 경력이 없으면 아무것도 선택되지 않고 안내를 노출한다', () => {
    renderPage({
      careers: baseSettings.careers.map((career) => ({
        ...career,
        isRepresentative: false,
      })),
    });

    expect(screen.getByRole('radio', { name: /네이버/ })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: /카카오/ })).not.toBeChecked();
    expect(screen.getByText(/대표 경력을 지정하지 않으면/)).toBeInTheDocument();
  });

  it('경력을 선택하면 대표 경력 지정 API 를 즉시 호출한다', () => {
    renderPage();

    fireEvent.click(screen.getByRole('radio', { name: /카카오/ }));

    expect(setRepresentativeCareerMock).toHaveBeenCalledTimes(1);
    expect(setRepresentativeCareerMock.mock.calls[0][0]).toBe(2);
    // 오픈 설정 저장(PUT)과는 무관한 별도 API 다.
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('대표 경력은 오픈 설정 저장 payload 에 포함되지 않는다', () => {
    renderPage();

    fireEvent.click(screen.getByRole('radio', { name: /카카오/ }));
    fireEvent.click(screen.getByRole('button', { name: '오픈하기' }));

    expect(saveMock).toHaveBeenCalledTimes(1);
    const payload = saveMock.mock.calls[0][0];
    expect(payload).not.toHaveProperty('careers');
  });
});

describe('OpenSettingsPage — 진행시간(다중) → 최저가', () => {
  it('초기 30분이면 35,000원을 표기한다', () => {
    renderPage({ durations: [30] });
    expect(screen.getAllByText('35,000원').length).toBeGreaterThan(0);
  });

  it('여러 진행시간이면 최저가, 하나만 남기면 그 가격으로 갱신된다', () => {
    renderPage({ durations: [30] });

    // 60분 추가 → [30,60] → 최저가 35,000 유지
    fireEvent.click(screen.getByRole('button', { name: '60분' }));
    expect(screen.getAllByText('35,000원').length).toBeGreaterThan(0);

    // 30분 해제 → [60] 만 남아 60,000
    fireEvent.click(screen.getByRole('button', { name: '30분' }));
    expect(screen.getAllByText('60,000원').length).toBeGreaterThan(0);
  });

  it('가격 입력 UI(number/text 가격 필드)가 없다', () => {
    renderPage();
    expect(screen.queryByLabelText('가격')).not.toBeInTheDocument();
  });
});

describe('OpenSettingsPage — 저장 payload', () => {
  it('저장 시 title/isOpen/categories/durations/feedbackDates 6개 필드만 담아 mutate 를 호출한다', () => {
    renderPage({ durations: [30] });

    fireEvent.click(screen.getByRole('button', { name: '60분' })); // [30,60]
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(saveMock).toHaveBeenCalledTimes(1);
    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload).toEqual({
      title: baseSettings.title,
      isOpen: false,
      categories: baseSettings.categories,
      durations: [30, 60],
      feedbackStartDate: baseSettings.feedbackStartDate,
      feedbackEndDate: baseSettings.feedbackEndDate,
    });
  });

  it('타입을 여러 개 선택하면 payload categories 에 담긴다', () => {
    renderPage({ categories: ['PERSONAL_STATEMENT'] });

    fireEvent.click(screen.getByRole('button', { name: '이력서' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload.categories).toEqual(['PERSONAL_STATEMENT', 'RESUME']);
  });

  it('피드백 기간 입력이 payload 에 반영된다', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('피드백 시작일'), {
      target: { value: '2026-08-01' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload.feedbackStartDate).toBe('2026-08-01');
  });

  it('타이틀을 입력하면 payload 에 반영된다', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
      target: { value: '이력서 클리닉' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload.title).toBe('이력서 클리닉');
  });
});

describe('OpenSettingsPage — 필수 필드', () => {
  it('타입을 모두 해제하면 경고문구가 뜨고 저장이 비활성화된다', () => {
    renderPage({ categories: ['PERSONAL_STATEMENT'] });

    fireEvent.click(screen.getByRole('button', { name: '자기소개서' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      '타입을 최소 1개 이상 선택해야 저장할 수 있어요.',
    );
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });

  it('진행시간을 모두 해제하면 경고문구가 뜨고 저장이 비활성화된다', () => {
    renderPage({ durations: [30] });

    fireEvent.click(screen.getByRole('button', { name: '30분' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      '진행시간을 최소 1개 이상 선택해야 저장할 수 있어요.',
    );
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });

  it('타이틀을 비우면 경고문구가 뜨고 저장이 비활성화된다', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
      target: { value: '' },
    });

    expect(
      screen.getByText('타이틀을 입력해야 저장할 수 있어요.'),
    ).toBeInTheDocument();
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
    expect(
      screen.queryByRole('button', { name: '저장' }),
    ).not.toBeInTheDocument();
  });

  it('변경사항이 생기면 저장 버튼으로 바뀐다', () => {
    renderPage({ durations: [30] });
    fireEvent.click(screen.getByRole('button', { name: '60분' })); // dirty
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '오픈하기' }),
    ).not.toBeInTheDocument();
  });

  it('오픈하기 클릭 시 isOpen=true 로 저장을 호출한다', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: '오픈하기' }));
    expect(saveMock).toHaveBeenCalledTimes(1);
    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload.isOpen).toBe(true);
  });

  it('오픈 중이면 설정을 잠그고 오픈 닫기 버튼만 노출한다', () => {
    renderPage({ isOpen: true });
    expect(
      screen.getByRole('button', { name: /오픈 닫기/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '저장' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '오픈하기' }),
    ).not.toBeInTheDocument();
  });
});
