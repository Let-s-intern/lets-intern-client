import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  LiveMentoringSettings,
  LiveMentoringSettingsUpdate,
  LiveMentoringSubmit,
  OpeningHistoryItem,
} from '@/api/live-mentoring/liveMentoringSchema';

const saveMock = vi.fn();
const submitMock = vi.fn();
const reopenMock = vi.fn();
const closeOpeningMock = vi.fn();
const startEditMock = vi.fn();
const setRepresentativeCareerMock = vi.fn();
let settingsData: LiveMentoringSettings | undefined;
let openingsData: OpeningHistoryItem[] = [];

// 공개 페이지 미리보기 링크가 mentorId 를 필요로 한다.
vi.mock('@/api/user/user', () => ({
  useUserQuery: () => ({ data: { userId: 500 } }),
}));

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringSettingsQuery: () => ({
    data: settingsData,
    refetch: vi.fn(),
  }),
  useLiveMentoringOpenStatusQuery: () => ({ data: openingsData }),
  useUpdateLiveMentoringSettingsMutation: () => ({
    mutate: saveMock,
    isPending: false,
  }),
  useSubmitLiveMentoringMutation: () => ({
    mutate: submitMock,
    isPending: false,
  }),
  useCreateLiveMentoringOpeningMutation: () => ({
    mutate: reopenMock,
    isPending: false,
  }),
  useCloseLiveMentoringOpeningMutation: () => ({
    mutate: closeOpeningMock,
    isPending: false,
  }),
  useStartEditLiveMentoringMutation: () => ({
    mutate: startEditMock,
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

/**
 * 검토 제출은 "종료일이 오늘 이상"을 요구한다. 고정 날짜를 쓰면 시간이 지나면서
 * 테스트가 저절로 깨지므로 오늘 기준 상대 날짜를 만든다.
 */
const dateFromToday = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

const FUTURE_START = dateFromToday(-1);
const FUTURE_END = dateFromToday(20);

const baseSettings: LiveMentoringSettings = {
  liveMentoringId: 1,
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
  status: 'DRAFT',
  categories: ['PERSONAL_STATEMENT'],
  durations: [30],
  feedbackStartDate: FUTURE_START,
  feedbackEndDate: FUTURE_END,
};

const openOpening: OpeningHistoryItem = {
  openingId: 100,
  status: 'OPEN',
  durationPrices: [{ duration: 30, price: 35000 }],
  feedbackStartDate: FUTURE_START,
  feedbackEndDate: FUTURE_END,
  openedAt: '2026-08-01T10:00:00',
  closedAt: null,
  closeReason: null,
};

/**
 * 오픈 전 확인 모달을 통과한다.
 * 체크 없이는 진행 버튼이 열리지 않는다 — 확인 절차 자체가 요구사항이다.
 */
const passPreOpenCheck = (confirmLabel: '오픈 신청하기' | '오픈하기') => {
  const dialog = screen.getByRole('dialog', {
    name: '오픈 전 상세 페이지 확인',
  });
  fireEvent.click(within(dialog).getByRole('checkbox'));
  fireEvent.click(within(dialog).getByRole('button', { name: confirmLabel }));
};

const renderPage = (
  overrides: Partial<LiveMentoringSettings> = {},
  openings: OpeningHistoryItem[] = [],
) => {
  settingsData = { ...baseSettings, ...overrides };
  openingsData = openings;
  return render(
    <MemoryRouter>
      <OpenSettingsPage />
    </MemoryRouter>,
  );
};

afterEach(() => {
  saveMock.mockReset();
  submitMock.mockReset();
  reopenMock.mockReset();
  closeOpeningMock.mockReset();
  startEditMock.mockReset();
  setRepresentativeCareerMock.mockReset();
  settingsData = undefined;
  openingsData = [];
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
});

describe('OpenSettingsPage — 대표 경력 지정(전용 API 로 즉시 저장)', () => {
  it('서버가 내려준 isRepresentative 경력이 선택된 상태로 보인다', () => {
    renderPage();
    expect(screen.getByRole('radio', { name: /네이버/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /카카오/ })).not.toBeChecked();
  });

  it('대표 경력이 없으면 아무것도 선택되지 않고 안내를 노출한다', () => {
    renderPage({
      careers: baseSettings.careers.map((career) => ({
        ...career,
        isRepresentative: false,
      })),
    });

    expect(screen.getByRole('radio', { name: /네이버/ })).not.toBeChecked();
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
});

describe('OpenSettingsPage — 진행시간(다중) → 최저가', () => {
  it('초기 30분이면 35,000원을 표기한다', () => {
    renderPage({ durations: [30] });
    expect(screen.getAllByText('35,000원').length).toBeGreaterThan(0);
  });

  it('여러 진행시간이면 최저가, 하나만 남기면 그 가격으로 갱신된다', () => {
    renderPage({ durations: [30] });

    fireEvent.click(screen.getByRole('button', { name: '60분' }));
    expect(screen.getAllByText('35,000원').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: '30분' }));
    expect(screen.getAllByText('60,000원').length).toBeGreaterThan(0);
  });

  it('가격 입력 UI(number/text 가격 필드)가 없다', () => {
    renderPage();
    expect(screen.queryByLabelText('가격')).not.toBeInTheDocument();
  });
});

describe('OpenSettingsPage — 저장 payload(제목·타입만)', () => {
  it('저장은 title/categories 두 필드만 담아 mutate 를 호출한다', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
      target: { value: '이력서 클리닉' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(saveMock).toHaveBeenCalledTimes(1);
    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload).toEqual({
      title: '이력서 클리닉',
      categories: baseSettings.categories,
    });
  });

  it('타입을 여러 개 선택하면 payload categories 에 담긴다', () => {
    renderPage({ categories: ['PERSONAL_STATEMENT'] });

    fireEvent.click(screen.getByRole('button', { name: '이력서' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload.categories).toEqual(['PERSONAL_STATEMENT', 'RESUME']);
  });

  it('진행시간·기간만 바꾸면 저장은 비활성이다(저장 대상이 아니다)', () => {
    renderPage({ durations: [30] });

    fireEvent.click(screen.getByRole('button', { name: '60분' }));

    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });
});

describe('OpenSettingsPage — 검토 제출', () => {
  it('진행시간·기간을 담아 제출한다(가격은 보내지 않는다)', () => {
    renderPage({ durations: [30, 60] });

    fireEvent.click(screen.getByRole('button', { name: '오픈 신청하기' }));
    passPreOpenCheck('오픈 신청하기');

    expect(submitMock).toHaveBeenCalledTimes(1);
    const payload = submitMock.mock.calls[0][0] as LiveMentoringSubmit;
    expect(payload).toEqual({
      durations: [30, 60],
      feedbackStartDate: FUTURE_START,
      feedbackEndDate: FUTURE_END,
    });
  });

  it('제목·타입에 변경사항이 있으면 먼저 저장하라고 알리고 제출을 막는다', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
      target: { value: '이력서 클리닉' },
    });

    expect(
      screen.getByRole('button', { name: '오픈 신청하기' }),
    ).toBeDisabled();
    expect(
      screen.getByText(/먼저 저장해야 오픈을 신청할 수 있어요/),
    ).toBeInTheDocument();
  });

  it('진행시간이 0개면 경고와 함께 제출이 비활성화된다', () => {
    renderPage({ durations: [30] });

    fireEvent.click(screen.getByRole('button', { name: '30분' }));

    expect(
      screen.getByText(
        '진행시간을 최소 1개 이상 선택해야 오픈을 신청할 수 있어요.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '오픈 신청하기' }),
    ).toBeDisabled();
  });

  it('종료일이 지났으면 경고와 함께 제출이 비활성화된다', () => {
    renderPage({
      feedbackStartDate: dateFromToday(-30),
      feedbackEndDate: dateFromToday(-1),
    });

    expect(screen.getByText(/종료일이 이미 지났어요/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '오픈 신청하기' }),
    ).toBeDisabled();
  });

  it('시작일이 종료일보다 늦으면 제출이 비활성화된다', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('피드백 시작일'), {
      target: { value: dateFromToday(30) },
    });

    expect(
      screen.getByText('시작일은 종료일보다 늦을 수 없어요.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '오픈 신청하기' }),
    ).toBeDisabled();
  });

  it('타이틀이 비면 저장도 제출도 비활성화된다', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
      target: { value: '' },
    });

    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: '오픈 신청하기' }),
    ).toBeDisabled();
  });

  // 시작일이 미래면 오픈해도 그날까지 모집이 시작되지 않는다(서버 노출 조건).
  it('시작일이 미래일 때만 모집이 시작되지 않는다고 경고한다', () => {
    renderPage();
    expect(
      screen.queryByText(/시작일 전까지는 공개 리스트에 노출되지 않아/),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('피드백 시작일'), {
      target: { value: dateFromToday(3) },
    });

    expect(
      screen.getByText(/시작일 전까지는 공개 리스트에 노출되지 않아/),
    ).toBeInTheDocument();
  });
});

describe('OpenSettingsPage — 상태별 잠금과 배너', () => {
  it('초안이면 배너 없이 저장·제출 버튼을 보인다', () => {
    renderPage({ status: 'DRAFT' });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '오픈 신청하기' }),
    ).toBeInTheDocument();
  });

  it('검토 대기면 입력을 잠그고 버튼을 감춘다', () => {
    renderPage({ status: 'PENDING_REVIEW' });

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('검토 대기')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '오픈 신청하기' }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeDisabled();
  });

  it('반려면 다시 편집할 수 있다', () => {
    renderPage({ status: 'REJECTED' });

    expect(
      within(screen.getByRole('status')).getByText('반려됨'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeEnabled();
    expect(
      screen.getByRole('button', { name: '오픈 신청하기' }),
    ).toBeInTheDocument();
  });

  it('승인 + 활성 개설이면 오픈 중으로 알리고 오픈 현황으로 보낸다', () => {
    renderPage({ status: 'APPROVED' }, [openOpening]);

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('오픈 중')).toBeInTheDocument();
    expect(
      within(banner).getByRole('link', { name: '오픈 현황 보기' }),
    ).toHaveAttribute('href', '/live-mentoring/open-status');
    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeDisabled();
  });

  // 승인 상태에서도 멘토가 알아야 할 건 "지금 열려 있는지"다.
  // 내부 용어(승인됨)를 그대로 쓰면 닫힌 상태가 열린 것처럼 읽힌다.
  it('승인이지만 활성 개설이 없으면 오픈 종료됨으로 표시하고 재개설 버튼을 준다', () => {
    renderPage({ status: 'APPROVED' }, [
      { ...openOpening, status: 'CLOSED', closeReason: 'MENTOR_CANCELED' },
    ]);

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('오픈 종료됨')).toBeInTheDocument();
    expect(within(banner).queryByText('오픈 중')).not.toBeInTheDocument();
    // 종료 상태에서는 설정이 다시 열리고 재개설·상세수정 경로가 보인다.
    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeEnabled();
    expect(
      screen.getByRole('button', { name: '다시 오픈하기' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '상세 수정하기' }),
    ).toBeInTheDocument();
  });

  it('재개설은 제목·타입까지 한 요청에 담아 보낸다(저장 버튼 없음)', () => {
    renderPage({ status: 'APPROVED' }, [
      { ...openOpening, status: 'CLOSED', closeReason: 'MENTOR_CANCELED' },
    ]);

    expect(
      screen.queryByRole('button', { name: '저장' }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '다시 오픈하기' }));
    passPreOpenCheck('오픈하기');

    expect(reopenMock).toHaveBeenCalledTimes(1);
    expect(reopenMock.mock.calls[0][0]).toEqual({
      title: baseSettings.title,
      categories: baseSettings.categories,
      durations: baseSettings.durations,
      feedbackStartDate: FUTURE_START,
      feedbackEndDate: FUTURE_END,
    });
  });

  // 오픈은 되돌리기 번거로운 행동이라 "됐습니다" 한 줄로 끝내지 않는다.
  it('재개설에 성공하면 공개 주소와 즉시 내리기를 안내한다', () => {
    reopenMock.mockImplementation((_body, options) =>
      options?.onSuccess?.({
        liveMentoringId: 1,
        openings: [{ ...openOpening, openingId: 777 }],
      }),
    );
    renderPage({ status: 'APPROVED' }, [
      { ...openOpening, status: 'CLOSED', closeReason: 'MENTOR_CANCELED' },
    ]);

    fireEvent.click(screen.getByRole('button', { name: '다시 오픈하기' }));
    passPreOpenCheck('오픈하기');

    const dialog = screen.getByRole('dialog', { name: '오픈 완료 안내' });
    // 지연 노출은 서버 기능이라 프론트가 흉내내지 않는다 — 지금 공개됐다고 적는다.
    expect(
      within(dialog).getByText('지금부터 모집이 시작됩니다'),
    ).toBeInTheDocument();
    expect(within(dialog).getByText(/live-mentoring\/500/)).toBeInTheDocument();
    expect(
      within(dialog).getByRole('link', { name: '상세 페이지 확인하기' }),
    ).toHaveAttribute('href', expect.stringContaining('/live-mentoring/500'));
  });

  it('안내에서 바로 내리면 방금 만든 개설을 종료한다', () => {
    reopenMock.mockImplementation((_body, options) =>
      options?.onSuccess?.({
        liveMentoringId: 1,
        openings: [{ ...openOpening, openingId: 777 }],
      }),
    );
    renderPage({ status: 'APPROVED' }, [
      { ...openOpening, status: 'CLOSED', closeReason: 'MENTOR_CANCELED' },
    ]);

    fireEvent.click(screen.getByRole('button', { name: '다시 오픈하기' }));
    passPreOpenCheck('오픈하기');
    fireEvent.click(screen.getByRole('button', { name: '바로 내리기' }));

    expect(closeOpeningMock).toHaveBeenCalledTimes(1);
    expect(closeOpeningMock.mock.calls[0][0]).toBe(777);
  });

  // 오픈은 되돌리는 비용이 크고 잘못 나간 상세는 멘티에게 그대로 보인다.
  it('확인 체크 전에는 진행 버튼이 열리지 않는다', () => {
    renderPage({ status: 'APPROVED' }, [
      { ...openOpening, status: 'CLOSED', closeReason: 'MENTOR_CANCELED' },
    ]);

    fireEvent.click(screen.getByRole('button', { name: '다시 오픈하기' }));

    const dialog = screen.getByRole('dialog', {
      name: '오픈 전 상세 페이지 확인',
    });
    expect(
      within(dialog).getByRole('button', { name: '오픈하기' }),
    ).toBeDisabled();
    // 확인할 주소를 바로 열 수 있어야 확인이 형식적이지 않다.
    expect(
      within(dialog).getByRole('link', { name: '상세 페이지 열어보기' }),
    ).toHaveAttribute('href', expect.stringContaining('/live-mentoring/500'));

    fireEvent.click(within(dialog).getByRole('checkbox'));
    expect(
      within(dialog).getByRole('button', { name: '오픈하기' }),
    ).toBeEnabled();
    expect(reopenMock).not.toHaveBeenCalled();
  });

  it('취소하면 아무것도 실행하지 않는다', () => {
    renderPage({ status: 'APPROVED' }, [
      { ...openOpening, status: 'CLOSED', closeReason: 'MENTOR_CANCELED' },
    ]);

    fireEvent.click(screen.getByRole('button', { name: '다시 오픈하기' }));
    fireEvent.click(
      within(
        screen.getByRole('dialog', { name: '오픈 전 상세 페이지 확인' }),
      ).getByRole('button', { name: '취소' }),
    );

    expect(reopenMock).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('dialog', { name: '오픈 전 상세 페이지 확인' }),
    ).not.toBeInTheDocument();
  });

  // 저장 버튼을 없앤 채로 두면 "저장이 안 된다"로 읽힌다.
  it('재개설 모드에서는 저장이 함께 이뤄진다는 걸 알린다', () => {
    renderPage({ status: 'APPROVED' }, [
      { ...openOpening, status: 'CLOSED', closeReason: 'MENTOR_CANCELED' },
    ]);

    expect(
      screen.getByText('여기서 바꾼 내용은 다시 오픈할 때 함께 저장돼요.'),
    ).toBeInTheDocument();
  });

  it('아직 저장되지 않은 값이 있으면 확인 모달에서 짚어준다', () => {
    renderPage({ status: 'APPROVED' }, [
      { ...openOpening, status: 'CLOSED', closeReason: 'MENTOR_CANCELED' },
    ]);

    // 기간을 바꾸면 그 값은 아직 서버에 없다 — 지금 여는 페이지에는 안 보인다.
    fireEvent.change(screen.getByLabelText('피드백 종료일'), {
      target: { value: dateFromToday(40) },
    });
    fireEvent.click(screen.getByRole('button', { name: '다시 오픈하기' }));

    expect(
      screen.getByText(/방금 바꾼 제목·타입·기간은 오픈할 때 함께 저장돼요/),
    ).toBeInTheDocument();
  });

  it('오픈 중이면 재개설 버튼 없이 잠근다', () => {
    renderPage({ status: 'APPROVED' }, [openOpening]);

    expect(
      screen.queryByRole('button', { name: '다시 오픈하기' }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeDisabled();
  });
});

describe('OpenSettingsPage — 미리보기', () => {
  // 미리보기는 웹 공개 카드(MentorCard)를 복제한 것이라, 표기 규칙이 어긋나면
  // 멘토가 실제와 다른 화면을 보고 제출하게 된다. 핵심 표기만 고정한다.
  it('공개 카드와 같은 표기 규칙을 따른다', () => {
    renderPage({ durations: [30, 60] });

    expect(screen.getByText('30분 / 60분')).toBeInTheDocument();
    expect(screen.getByText(/^[\d,]+원~$/)).toBeInTheDocument();
    expect(screen.getByText('자소서 실전 첨삭 멘토링')).toBeInTheDocument();
  });

  it('카드 제목은 타이틀이 비면 닉네임 기반 문구로 폴백한다', () => {
    renderPage({ title: '' });
    expect(screen.getByText('자소서장인의 1:1 멘토링')).toBeInTheDocument();
  });

  it('진행기간은 날짜가 비면 미정으로 표시한다', () => {
    renderPage({ feedbackStartDate: null, feedbackEndDate: null });
    expect(screen.getByText('미정 ~ 미정')).toBeInTheDocument();
  });
});
