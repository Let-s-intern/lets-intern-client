import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  LiveMentoringSettings,
  LiveMentoringSettingsUpdate,
  OpeningHistoryItem,
} from '@/api/live-mentoring/liveMentoringSchema';

const saveMock = vi.fn();
const createOpeningMock = vi.fn();
const submitMock = vi.fn();
const setRepresentativeCareerMock = vi.fn();
let settingsData: LiveMentoringSettings | undefined;
let openings: OpeningHistoryItem[] | undefined;

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringSettingsQuery: () => ({ data: settingsData }),
  useLiveMentoringOpenStatusQuery: () => ({ data: openings }),
  useUpdateLiveMentoringSettingsMutation: () => ({
    mutate: saveMock,
    isPending: false,
  }),
  useCreateLiveMentoringOpeningMutation: () => ({
    mutate: createOpeningMock,
    isPending: false,
  }),
  useSubmitLiveMentoringMutation: () => ({
    mutate: submitMock,
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
};

const opening = (status: OpeningHistoryItem['status']): OpeningHistoryItem => ({
  openingId: 1,
  status,
  durationPrices: [{ duration: 30, price: 35000 }],
  feedbackStartDate: '2026-07-14',
  feedbackEndDate: '2026-07-28',
  openedAt: '2026-07-10T09:00:00',
  closedAt: status === 'CLOSED' ? '2026-07-29T00:05:00' : null,
  closeReason: status === 'CLOSED' ? 'PERIOD_EXPIRED' : null,
});

const renderPage = (
  overrides: Partial<LiveMentoringSettings> = {},
  openingHistory: OpeningHistoryItem[] = [],
) => {
  settingsData = { ...baseSettings, ...overrides };
  openings = openingHistory;
  return render(
    <MemoryRouter>
      <OpenSettingsPage />
    </MemoryRouter>,
  );
};

/** 개설이 가능한 상태(승인·활성 개설 없음)로 렌더한다. */
const renderApproved = () => renderPage({ status: 'APPROVED' });

/**
 * 진행시간·피드백 기간은 상품 설정이 아니라 개설 입력값이라 서버가 내려주지 않는다.
 * 화면 진입 시 항상 비어 있으므로 개설 관련 단언은 이 헬퍼로 채운 뒤에 한다.
 */
const fillOpeningForm = ({
  duration = '30분',
  startDate = '2026-07-14',
  endDate = '2026-07-28',
}: { duration?: string; startDate?: string; endDate?: string } = {}) => {
  fireEvent.click(screen.getByRole('button', { name: duration }));
  fireEvent.change(screen.getByLabelText('피드백 시작일'), {
    target: { value: startDate },
  });
  fireEvent.change(screen.getByLabelText('피드백 종료일'), {
    target: { value: endDate },
  });
};

/** 타이틀을 바꿔 저장(PUT) 대상 필드에 변경사항을 만든다. */
const makeDirty = (title = '이력서 클리닉') =>
  fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
    target: { value: title },
  });

/** 오픈하기를 누르고 확인 모달까지 통과시킨다 — 어느 요청이든 확인을 한 번 받는다. */
const confirmOpen = (confirmText: string) => {
  fireEvent.click(screen.getByRole('button', { name: '오픈하기' }));
  fireEvent.click(screen.getByRole('button', { name: confirmText }));
};

afterEach(() => {
  saveMock.mockReset();
  createOpeningMock.mockReset();
  submitMock.mockReset();
  settingsData = undefined;
  openings = undefined;
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
    makeDirty();
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(saveMock).toHaveBeenCalledTimes(1);
    const payload = saveMock.mock.calls[0][0];
    expect(payload).not.toHaveProperty('careers');
  });
});

describe('OpenSettingsPage — 진행시간(다중) → 최저가', () => {
  it('30분을 고르면 35,000원을 표기한다', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '30분' }));

    expect(screen.getAllByText('35,000원').length).toBeGreaterThan(0);
  });

  it('여러 진행시간이면 최저가, 하나만 남기면 그 가격으로 갱신된다', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '30분' }));
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
  // 3.1.T1 — 상품 1 : 개설 N 분리로 PUT /settings 바디가 2개 필드로 줄었다.
  it('저장 시 title/categories 2개 필드만 담아 mutate 를 호출한다', () => {
    renderPage();

    makeDirty('이력서 클리닉');
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(saveMock).toHaveBeenCalledTimes(1);
    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload).toEqual({
      title: '이력서 클리닉',
      categories: baseSettings.categories,
    });
  });

  // 3.1.T1 — 개설로 옮겨간 4개 필드가 저장 요청에 남아 있으면 서버가 무시하거나 400 이다.
  it('개설로 옮겨간 isOpen·durations·피드백 기간은 저장 요청에 싣지 않는다', () => {
    renderPage();

    fillOpeningForm();
    makeDirty();
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const payload = saveMock.mock.calls[0][0];
    expect(payload).not.toHaveProperty('isOpen');
    expect(payload).not.toHaveProperty('durations');
    expect(payload).not.toHaveProperty('feedbackStartDate');
    expect(payload).not.toHaveProperty('feedbackEndDate');
  });

  it('진행시간·피드백 기간만 바꾸면 저장할 것이 없으므로 저장 버튼이 뜨지 않는다', () => {
    renderPage();

    fillOpeningForm();

    expect(
      screen.queryByRole('button', { name: '저장' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '오픈하기' }),
    ).toBeInTheDocument();
  });

  it('타입 선택이 payload categories 에 담긴다', () => {
    renderPage({ categories: ['PERSONAL_STATEMENT'] });

    fireEvent.click(screen.getByRole('button', { name: '이력서' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload.categories).toEqual(['RESUME']);
  });

  it('타이틀을 입력하면 payload 에 반영된다', () => {
    renderPage();

    makeDirty('이력서 클리닉');
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload.title).toBe('이력서 클리닉');
  });
});

// 3.2.T1 — 서버 `@Size(min = 1, max = 1)` 이라 2개를 보내면 400 이다.
describe('OpenSettingsPage — 타입은 단일 선택', () => {
  it('다른 타입을 누르면 이전 선택이 해제되고 1개만 남는다', () => {
    renderPage({ categories: ['PERSONAL_STATEMENT'] });

    fireEvent.click(screen.getByRole('button', { name: '이력서' }));

    expect(screen.getByRole('button', { name: '자기소개서' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: '이력서' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload.categories).toHaveLength(1);
  });

  it('이미 선택된 타입을 다시 눌러도 선택이 유지된다', () => {
    renderPage({ categories: ['PERSONAL_STATEMENT'] });

    fireEvent.click(screen.getByRole('button', { name: '자기소개서' }));

    expect(screen.getByRole('button', { name: '자기소개서' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(
      screen.queryByText('타입을 1개 선택해야 저장할 수 있어요.'),
    ).not.toBeInTheDocument();
  });

  it('타입이 비어 있으면 1개를 고르라는 안내를 노출하고 저장을 막는다', () => {
    renderPage({ categories: [] });

    expect(
      screen.getByText('타입을 1개 선택해야 저장할 수 있어요.'),
    ).toBeInTheDocument();

    makeDirty();
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });
});

describe('OpenSettingsPage — 필수 필드', () => {
  it('진행시간을 고르지 않으면 개설 안내 문구를 노출한다', () => {
    renderPage();

    expect(
      screen.getByText('진행시간을 최소 1개 이상 선택해야 개설할 수 있어요.'),
    ).toBeInTheDocument();
  });

  it('피드백 기간을 입력하지 않으면 개설 안내 문구를 노출한다', () => {
    renderPage();

    expect(
      screen.getByText('시작일과 종료일을 모두 입력해야 개설할 수 있어요.'),
    ).toBeInTheDocument();
  });

  it('타이틀을 비우면 경고문구가 뜨고 저장이 비활성화된다', () => {
    renderPage();

    makeDirty('');

    expect(
      screen.getByText('타이틀을 입력해야 저장할 수 있어요.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });
});

describe('OpenSettingsPage — 하단 버튼 2단 구조', () => {
  it('변경사항이 없으면 오픈하기 버튼을 보인다(저장 없음)', () => {
    renderPage();
    expect(
      screen.getByRole('button', { name: '오픈하기' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '저장' }),
    ).not.toBeInTheDocument();
  });

  it('저장 대상에 변경사항이 생기면 저장 버튼으로 바뀐다', () => {
    renderPage();

    makeDirty();

    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '오픈하기' }),
    ).not.toBeInTheDocument();
  });
});

// 3.3.T1 — 오픈하기는 PUT /settings 가 아니라 POST /openings 다.
describe('OpenSettingsPage — 오픈하기는 개설 생성', () => {
  it('개설 요청에 title/categories/durations/피드백 기간을 담아 보낸다', () => {
    renderApproved();

    fillOpeningForm({ duration: '60분' });
    confirmOpen('지금 오픈하기');

    expect(createOpeningMock).toHaveBeenCalledTimes(1);
    expect(createOpeningMock.mock.calls[0][0]).toEqual({
      title: baseSettings.title,
      categories: baseSettings.categories,
      durations: [60],
      feedbackStartDate: '2026-07-14',
      feedbackEndDate: '2026-07-28',
    });
    // 개설이 같은 트랜잭션에서 제목·카테고리를 갱신하므로 별도 저장은 보내지 않는다.
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('개설에 성공하면 종료 방법을 함께 안내한다', () => {
    createOpeningMock.mockImplementation((_payload, options) =>
      options.onSuccess(),
    );
    renderApproved();

    fillOpeningForm();
    confirmOpen('지금 오픈하기');

    expect(screen.getByText('개설되었습니다.')).toBeInTheDocument();
    expect(
      screen.getByText(/관리자 요청으로만 종료됩니다/),
    ).toBeInTheDocument();
  });

  it('409 로 막히면 사유 코드를 그대로 보여준다', () => {
    createOpeningMock.mockImplementation((_payload, options) =>
      options.onError({
        status: 409,
        code: 'LIVE_MENTORING_LOCKED',
        message: '이미 진행 중인 개설이 있습니다.',
      }),
    );
    renderApproved();

    fillOpeningForm();
    confirmOpen('지금 오픈하기');

    expect(screen.getByText('개설에 실패했습니다.')).toBeInTheDocument();
    expect(
      screen.getByText(
        '이미 진행 중인 개설이 있습니다. (LIVE_MENTORING_LOCKED)',
      ),
    ).toBeInTheDocument();
  });

  it('미지원 진행시간(400)도 코드를 구분해 보여준다', () => {
    createOpeningMock.mockImplementation((_payload, options) =>
      options.onError({
        status: 400,
        code: 'INVALID_LIVE_MENTORING_DURATION',
        message: '지원하지 않는 진행시간입니다.',
      }),
    );
    renderApproved();

    fillOpeningForm();
    confirmOpen('지금 오픈하기');

    expect(
      screen.getByText(
        '지원하지 않는 진행시간입니다. (INVALID_LIVE_MENTORING_DURATION)',
      ),
    ).toBeInTheDocument();
  });

  it('진행시간·기간이 비어 있으면 개설 요청을 보내지 않는다', () => {
    renderApproved();

    const openButton = screen.getByRole('button', { name: '오픈하기' });
    expect(openButton).toBeDisabled();
    fireEvent.click(openButton);
    expect(createOpeningMock).not.toHaveBeenCalled();
  });
});

/*
 * 멘토가 알아야 할 버튼은 `오픈하기` 하나다. 승인은 상품 단위로 최초 1회만 필요하므로
 * 같은 버튼이 승인 전에는 검토 요청(POST /submit)을, 승인 후에는 개설(POST /openings)을 보낸다.
 * 이 표가 어긋나면 멘토가 아무리 눌러도 오픈이 안 되거나, 승인도 없이 개설이 나간다.
 */
describe('OpenSettingsPage — 오픈하기 한 버튼이 상태에 따라 요청을 가른다', () => {
  const openButton = () => screen.getByRole('button', { name: '오픈하기' });

  it('DRAFT 는 검토 요청을 보낸다 — 개설 요청이 아니다', () => {
    renderPage({ status: 'DRAFT' });

    confirmOpen('검토 요청하기');

    expect(submitMock).toHaveBeenCalledTimes(1);
    expect(createOpeningMock).not.toHaveBeenCalled();
  });

  it('REJECTED 도 검토 요청을 보낸다', () => {
    renderPage({ status: 'REJECTED' });

    confirmOpen('검토 요청하기');

    expect(submitMock).toHaveBeenCalledTimes(1);
    expect(createOpeningMock).not.toHaveBeenCalled();
  });

  it('APPROVED 는 개설을 보낸다 — 검토 요청이 아니다', () => {
    renderApproved();

    fillOpeningForm();
    confirmOpen('지금 오픈하기');

    expect(createOpeningMock).toHaveBeenCalledTimes(1);
    expect(submitMock).not.toHaveBeenCalled();
  });

  // 서버 submit 은 바디가 없다 — 여기서 개설 입력을 요구하면 승인도 못 받은 멘토가 막힌다.
  it('검토 요청은 진행시간·피드백 기간이 비어 있어도 보낼 수 있다', () => {
    renderPage({ status: 'DRAFT' });

    expect(openButton()).toBeEnabled();
    confirmOpen('검토 요청하기');

    expect(submitMock).toHaveBeenCalledTimes(1);
  });

  it('타입이 비어 있으면 검토 요청도 막는다', () => {
    renderPage({ status: 'DRAFT', categories: [] });

    expect(openButton()).toBeDisabled();
  });

  it('타이틀이 비어 있으면 검토 요청도 막는다', () => {
    renderPage({ status: 'DRAFT', title: '' });

    expect(openButton()).toBeDisabled();
  });

  it('확인 전에는 어느 요청도 보내지 않는다', () => {
    renderPage({ status: 'DRAFT' });

    fireEvent.click(openButton());

    expect(submitMock).not.toHaveBeenCalled();
    expect(createOpeningMock).not.toHaveBeenCalled();
  });

  it('확인 모달은 승인 전에 관리자 확인과 재클릭 절차를 알린다', () => {
    renderPage({ status: 'DRAFT' });

    fireEvent.click(openButton());

    expect(screen.getByText('관리자 검토를 요청할까요?')).toBeVisible();
    expect(screen.getByText(/첫 오픈은 관리자 확인이 필요해요/)).toBeVisible();
    expect(
      screen.getByText(/승인되면 오픈하기를 다시 눌러 개설합니다/),
    ).toBeVisible();
  });

  it('확인 모달은 승인 후에 개설 조건과 공개 노출을 알린다', () => {
    renderApproved();

    fillOpeningForm({ duration: '60분' });
    fireEvent.click(openButton());

    expect(screen.getByText('지금 오픈할까요?')).toBeVisible();
    expect(
      screen.getByText(
        /진행시간 60분, 기간 2026-07-14 ~ 2026-07-28 으로 개설합니다/,
      ),
    ).toBeVisible();
    expect(screen.getByText(/공개 목록에 바로 노출돼요/)).toBeVisible();
  });

  it('검토 요청에 성공하면 승인 뒤 다시 누르라고 알린다', () => {
    submitMock.mockImplementation((_input, options) => options.onSuccess());
    renderPage({ status: 'DRAFT' });

    confirmOpen('검토 요청하기');

    expect(screen.getByText('검토를 요청했습니다.')).toBeInTheDocument();
    expect(
      screen.getByText(/오픈하기를 한 번 더 눌러 개설할 수 있어요/),
    ).toBeInTheDocument();
  });

  // 서버 submit 은 상세 페이지를 한 번도 저장하지 않아도 같은 409 를 던진다.
  // 이 화면에서는 상세를 손댈 수 없어 코드만 보여주면 다음 할 일을 알 수 없다.
  it('검토 요청 실패는 오류 코드와 상세 페이지 저장 안내를 함께 보여준다', () => {
    submitMock.mockImplementation((_input, options) =>
      options.onError({
        status: 409,
        code: 'LIVE_MENTORING_INVALID_STATE',
        message: '제출할 수 없는 상태입니다.',
      }),
    );
    renderPage({ status: 'DRAFT' });

    confirmOpen('검토 요청하기');

    expect(screen.getByText('검토 요청에 실패했습니다.')).toBeInTheDocument();
    expect(
      screen.getByText(/LIVE_MENTORING_INVALID_STATE/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/상세 페이지 설정을 한 번도 저장하지 않았다면/),
    ).toBeInTheDocument();
  });

  it('PENDING_REVIEW·INACTIVE·활성 개설에서는 아무 요청도 보내지 않는다', () => {
    const cases: Array<[Partial<LiveMentoringSettings>, OpeningHistoryItem[]]> =
      [
        [{ status: 'PENDING_REVIEW' }, []],
        [{ status: 'INACTIVE' }, []],
        [{ status: 'APPROVED' }, [opening('OPEN')]],
      ];

    for (const [overrides, history] of cases) {
      const { unmount } = renderPage(overrides, history);

      fireEvent.click(openButton());

      expect(submitMock).not.toHaveBeenCalled();
      expect(createOpeningMock).not.toHaveBeenCalled();
      unmount();
    }
  });
});

// 3.4.T1 — isOpen 불리언이 사라져 잠금·활성화는 상품 상태와 개설 이력에서만 나온다.
describe('OpenSettingsPage — 상태별 편집·개설 가능 여부', () => {
  const openButton = () => screen.getByRole('button', { name: '오픈하기' });
  const titleInput = () => screen.getByLabelText('1대1 멘토링 타이틀');
  const categoryButton = () =>
    screen.getByRole('button', { name: '자기소개서' });

  it('DRAFT — 상품을 고칠 수 있고, 오픈하기가 열려 있다', () => {
    renderPage({ status: 'DRAFT' });

    expect(titleInput()).toBeEnabled();
    expect(categoryButton()).toBeEnabled();
    expect(openButton()).toBeEnabled();
  });

  it('REJECTED — 상품을 고칠 수 있고, 오픈하기로 다시 검토를 요청한다', () => {
    renderPage({ status: 'REJECTED' });

    expect(titleInput()).toBeEnabled();
    expect(openButton()).toBeEnabled();
  });

  it('PENDING_REVIEW — 상품이 잠기고 검토 중 안내를 보여준다', () => {
    renderPage({ status: 'PENDING_REVIEW' });

    expect(titleInput()).toBeDisabled();
    expect(categoryButton()).toBeDisabled();
    expect(openButton()).toBeDisabled();
    expect(
      screen.getByText('관리자 검토 중이에요. 승인되면 오픈할 수 있어요'),
    ).toBeInTheDocument();
  });

  it('INACTIVE — 상품이 잠기고 비활성 안내를 보여준다', () => {
    renderPage({ status: 'INACTIVE' });

    expect(titleInput()).toBeDisabled();
    expect(openButton()).toBeDisabled();
    expect(screen.getByText('비활성 상품이에요')).toBeInTheDocument();
  });

  it('APPROVED — 상품은 잠기지만 개설 입력은 채울 수 있고 개설 버튼이 열린다', () => {
    renderApproved();

    // 상품 필드는 승인 이후 잠긴다
    expect(titleInput()).toBeDisabled();
    expect(categoryButton()).toBeDisabled();
    // 개설 입력은 잠기지 않는다 — 잠기면 개설 자체가 불가능해진다
    expect(screen.getByLabelText('피드백 시작일')).toBeEnabled();
    expect(screen.getByRole('button', { name: '30분' })).toBeEnabled();

    fillOpeningForm();

    expect(openButton()).toBeEnabled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('APPROVED + 활성 개설 — 입력이 잠기고 개설 버튼도 사유와 함께 막힌다', () => {
    renderPage({ status: 'APPROVED' }, [opening('OPEN')]);

    expect(screen.getByLabelText('피드백 시작일')).toBeDisabled();
    expect(screen.getByRole('button', { name: '30분' })).toBeDisabled();
    expect(openButton()).toBeDisabled();
    expect(
      screen.getByText(
        '이미 진행 중인 개설이 있어요. 종료된 뒤에 다시 개설할 수 있어요',
      ),
    ).toBeInTheDocument();
  });

  it('종료된 개설만 있으면 활성 개설로 보지 않는다', () => {
    renderPage({ status: 'APPROVED' }, [opening('CLOSED')]);

    fillOpeningForm();

    expect(openButton()).toBeEnabled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('OpenSettingsPage — 오픈 중 배너', () => {
  it('활성 개설이 있으면 오픈 중 배너에 종료 경로를 안내한다', () => {
    renderPage({ status: 'APPROVED' }, [opening('OPEN')]);

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('오픈 중')).toBeInTheDocument();
    expect(
      within(banner).getByText('관리자 종료 또는 기간 만료 시 종료됩니다.'),
    ).toBeInTheDocument();
  });

  it('멘토가 직접 종료하는 경로가 없으므로 오픈 닫기 버튼을 두지 않는다', () => {
    renderPage({ status: 'APPROVED' }, [opening('OPEN')]);

    expect(
      screen.queryByRole('button', { name: /오픈 닫기/ }),
    ).not.toBeInTheDocument();
  });

  it('활성 개설이 없으면 배너를 렌더하지 않는다', () => {
    renderPage();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('오픈 중에도 설정 값은 그대로 읽을 수 있다', () => {
    renderPage({ status: 'APPROVED', title: '자소서 실전 첨삭' }, [
      opening('OPEN'),
    ]);

    const input = screen.getByDisplayValue('자소서 실전 첨삭');
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
  });
});

describe('OpenSettingsPage — 미리보기', () => {
  // 미리보기는 웹 공개 카드(MentorCard)를 복제한 것이라, 표기 규칙이 어긋나면
  // 멘토가 실제와 다른 화면을 보고 개설하게 된다. 핵심 표기만 고정한다.
  // 3.6.T1 — 진행시간·기간은 이제 개설 폼 입력값으로 넘어온다.
  it('진행시간·기간 입력이 미리보기에 그대로 반영된다', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '30분' }));
    fireEvent.click(screen.getByRole('button', { name: '60분' }));
    fireEvent.change(screen.getByLabelText('피드백 시작일'), {
      target: { value: '2026-07-14' },
    });
    fireEvent.change(screen.getByLabelText('피드백 종료일'), {
      target: { value: '2026-07-28' },
    });

    // 진행시간은 "/"로 잇고, 여러 개면 최저가에 물결을 붙인다
    expect(screen.getByText('30분 / 60분')).toBeInTheDocument();
    expect(screen.getByText(/^[\d,]+원~$/)).toBeInTheDocument();
    // 진행기간은 YY.MM.DD 형식
    expect(screen.getByText('26.07.14 ~ 26.07.28')).toBeInTheDocument();
    // 카드 제목은 타이틀 그대로 (미입력 시에만 닉네임 기반 문구로 폴백)
    expect(screen.getByText('자소서 실전 첨삭 멘토링')).toBeInTheDocument();
  });

  it('미리보기 카드 제목은 타이틀이 비면 닉네임 기반 문구로 폴백한다', () => {
    renderPage({ title: '' });
    expect(screen.getByText('자소서장인의 1:1 멘토링')).toBeInTheDocument();
  });

  it('미리보기 진행기간은 날짜가 비면 미정으로 표시한다', () => {
    renderPage();
    expect(screen.getByText('미정 ~ 미정')).toBeInTheDocument();
  });
});
