import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  LiveMentoringOpeningCreate,
  LiveMentoringSettings,
  LiveMentoringSettingsUpdate,
  OpeningHistoryItem,
} from '@/api/live-mentoring/liveMentoringSchema';

const saveMock = vi.fn();
const openMock = vi.fn();
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
  useCreateLiveMentoringOpeningMutation: () => ({
    mutate: openMock,
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

// 슬롯 편집 모달은 이 단위 테스트 대상이 아니므로 스텁 처리
// (실 컴포넌트는 슬롯·피드백 query 훅을 호출해 QueryClient 가 필요하다).
// 모달 자체는 `ui/__tests__/LiveMentoringSlotModal.test.tsx` 에서 따로 검증한다.
const slotModalOpenSpy = vi.fn();
vi.mock('../ui/LiveMentoringSlotModal', () => ({
  default: ({ isOpen }: { isOpen: boolean }) => {
    if (isOpen) slotModalOpenSpy();
    return null;
  },
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
  durations: [30],
};

const openOpening: OpeningHistoryItem = {
  openingId: 100,
  status: 'OPEN',
  durationPrices: [{ duration: 30, price: 35000 }],
  openedAt: '2026-08-01T10:00:00',
  closedAt: null,
  closeReason: null,
};

const closedOpening: OpeningHistoryItem = {
  ...openOpening,
  status: 'CLOSED',
  closeReason: 'MENTOR_CANCELED',
};

/**
 * 오픈 전 확인 모달을 통과한다.
 * 체크 없이는 진행 버튼이 열리지 않는다 — 확인 절차 자체가 요구사항이다.
 */
const passPreOpenCheck = (confirmLabel = '오픈하기') => {
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
  openMock.mockReset();
  closeOpeningMock.mockReset();
  startEditMock.mockReset();
  setRepresentativeCareerMock.mockReset();
  slotModalOpenSpy.mockReset();
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

describe('OpenSettingsPage — 피드백 진행 일정이 화면에서 사라졌다', () => {
  it('기간 입력이 없다', () => {
    // 계약에서 기간 필드가 사라졌다. 남겨 두면 입력해도 서버에 가지 않는다.
    renderPage();
    expect(screen.queryByLabelText('피드백 시작일')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('피드백 종료일')).not.toBeInTheDocument();
  });

  it('기간 기반 문구가 남아 있지 않다', () => {
    renderPage();
    expect(screen.queryByText(/피드백 진행 일정/)).not.toBeInTheDocument();
    expect(screen.queryByText(/진행기간/)).not.toBeInTheDocument();
    expect(screen.queryByText(/시작일/)).not.toBeInTheDocument();
    expect(screen.queryByText(/종료일/)).not.toBeInTheDocument();
  });

  it('예약 가능 일정은 슬롯 등록으로 안내한다', () => {
    renderPage();
    expect(
      screen.getByRole('button', { name: '일정 등록하기' }),
    ).toBeInTheDocument();
  });
});

describe('OpenSettingsPage — 상태 충돌 안내 문구', () => {
  // 회귀 케이스: LOCKED 와 INVALID_STATE 를 한데 묶어 "다른 곳에서 상태가
  // 바뀌었습니다"로 안내하던 시절, 멘토가 다른 창을 의심하며 새로고침만 반복했다.
  // LOCKED 는 개설이 열려 있다는 뜻이고 할 일은 "오픈 종료"다.
  const failSaveWith = (code: string) =>
    saveMock.mockImplementation((_body, options) =>
      options?.onError?.({ code, message: '서버 메시지' }),
    );

  it('LOCKED 면 오픈을 종료하라고 안내한다', () => {
    failSaveWith('LIVE_MENTORING_LOCKED');
    renderPage();

    // 저장 버튼은 변경이 있어야 활성된다.
    fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
      target: { value: '이력서 클리닉' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(
      screen.getByText('오픈 중에는 설정을 수정할 수 없습니다.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('다른 곳에서 상태가 바뀌었습니다.'),
    ).not.toBeInTheDocument();
  });

  it('INVALID_STATE 면 상태가 바뀌었다고 안내한다', () => {
    failSaveWith('LIVE_MENTORING_INVALID_STATE');
    renderPage();

    // 저장 버튼은 변경이 있어야 활성된다.
    fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
      target: { value: '이력서 클리닉' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(
      screen.getByText('다른 곳에서 상태가 바뀌었습니다.'),
    ).toBeInTheDocument();
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

  it('진행시간만 바꿔도 저장이 활성화된다', () => {
    // 회귀 케이스: PUT이 실제로 반영하는 건 제목·타입뿐이지만, 저장 버튼의
    // 활성화 여부는 화면에서 뭐든 하나라도 바뀌면 켜져야 한다 — 아니면
    // "저장이 안 된다"는 잘못된 인상을 준다.
    renderPage({ durations: [30] });

    fireEvent.click(screen.getByRole('button', { name: '60분' }));

    expect(screen.getByRole('button', { name: '저장' })).toBeEnabled();
  });

  it('저장 버튼은 변경사항이 있을 때만 파란색(primary)으로 바뀐다', () => {
    renderPage({ durations: [30] });

    const saveButton = screen.getByRole('button', { name: '저장' });
    expect(saveButton.className).not.toContain('bg-primary');

    fireEvent.click(screen.getByRole('button', { name: '60분' }));

    expect(saveButton.className).toContain('bg-primary');
  });
});

describe('OpenSettingsPage — 개설은 상태와 무관하게 한 경로다', () => {
  it('초안에서 제목·타입·진행시간을 한 요청에 담아 개설한다', () => {
    renderPage({ status: 'DRAFT', durations: [30, 60] });

    fireEvent.click(screen.getByRole('button', { name: '오픈하기' }));
    passPreOpenCheck();

    expect(openMock).toHaveBeenCalledTimes(1);
    const payload = openMock.mock.calls[0][0] as LiveMentoringOpeningCreate;
    // 날짜는 담지 않는다 — 예약 가능 일정은 슬롯으로 따로 등록한다.
    expect(payload).toEqual({
      title: baseSettings.title,
      categories: baseSettings.categories,
      durations: [30, 60],
    });
  });

  it('승인 후 재개설도 같은 요청을 쓴다', () => {
    renderPage({ status: 'APPROVED' }, [closedOpening]);

    fireEvent.click(screen.getByRole('button', { name: '다시 오픈하기' }));
    passPreOpenCheck();

    expect(openMock).toHaveBeenCalledTimes(1);
    expect(openMock.mock.calls[0][0]).toEqual({
      title: baseSettings.title,
      categories: baseSettings.categories,
      durations: baseSettings.durations,
    });
  });

  it('제목·타입을 바꿔도 저장 없이 바로 오픈할 수 있다', () => {
    // 개설 요청이 제목·타입까지 함께 보내므로 저장을 선행할 이유가 없다.
    renderPage({ status: 'DRAFT' });

    fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
      target: { value: '이력서 클리닉' },
    });

    const openButton = screen.getByRole('button', { name: '오픈하기' });
    expect(openButton).toBeEnabled();

    fireEvent.click(openButton);
    passPreOpenCheck();

    expect(openMock.mock.calls[0][0]).toMatchObject({
      title: '이력서 클리닉',
    });
  });

  it('개설 성공 직후에는 리페치를 기다리지 않고 바로 편집을 잠근다', () => {
    // 회귀 케이스: 성공 후 설정 쿼리가 리페치되기 전까지 화면이 그대로 초안
    // 모드로 남아 있으면, 그 사이 한 번 더 누를 때 서버는 이미 잠근 상태라
    // "다른 곳에서 상태가 바뀌었습니다" 에러가 났다.
    openMock.mockImplementation((_body, options) =>
      options?.onSuccess?.({ liveMentoringId: 1, openings: [] }),
    );
    renderPage({ status: 'DRAFT' });

    fireEvent.click(screen.getByRole('button', { name: '오픈하기' }));
    passPreOpenCheck();

    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: '저장' }),
    ).not.toBeInTheDocument();
  });

  it('진행시간이 0개면 경고와 함께 오픈이 비활성화된다', () => {
    renderPage({ durations: [30] });

    fireEvent.click(screen.getByRole('button', { name: '30분' }));

    expect(
      screen.getByText('진행시간을 최소 1개 이상 선택해야 오픈할 수 있어요.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '오픈하기' })).toBeDisabled();
  });

  it('타이틀이 비면 저장도 오픈도 비활성화된다', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
      target: { value: '' },
    });

    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '오픈하기' })).toBeDisabled();
  });

  // 슬롯이 하나도 없어도 서버는 개설을 허용한다(PRD §8-10).
  it('등록한 일정이 없어도 오픈을 막지 않는다', () => {
    renderPage({ status: 'DRAFT' });
    expect(screen.getByRole('button', { name: '오픈하기' })).toBeEnabled();
  });

  it('상품이 아직 없으면 먼저 저장하라고 알리고 오픈을 막는다', () => {
    // `POST /openings` 는 기존 상품을 찾아 갱신·개설한다 — 상품이 없으면 404 다.
    renderPage({ liveMentoringId: null, status: null });

    expect(screen.getByRole('button', { name: '오픈하기' })).toBeDisabled();
    expect(
      screen.getByText('먼저 저장해 상품을 만들어야 오픈할 수 있어요.'),
    ).toBeInTheDocument();
  });
});

describe('OpenSettingsPage — 상태별 잠금과 배너', () => {
  it('초안(DRAFT)이면 배너 없이 저장·오픈 버튼을 보인다', () => {
    renderPage({ status: 'DRAFT' });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '오픈하기' }),
    ).toBeInTheDocument();
    // 백엔드는 PENDING_REVIEW/REJECTED 상태를 더 이상 보내지 않는다 — 해당 배너도 없다.
    expect(screen.queryByText('검토 대기')).not.toBeInTheDocument();
    expect(screen.queryByText('반려됨')).not.toBeInTheDocument();
  });

  it('비활성(INACTIVE)이면 배너 없이 입력을 잠근다', () => {
    renderPage({ status: 'INACTIVE' });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: '저장' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '오픈하기' }),
    ).not.toBeInTheDocument();
  });

  it('승인 + 활성 개설이면 오픈 중으로 알리고, 배너에서 바로 오픈을 닫을 수 있다', () => {
    // 오픈 현황 화면이 폐지되면서, 종료도 이 배너에서 바로 한다.
    renderPage({ status: 'APPROVED' }, [openOpening]);

    const banner = screen.getByRole('status');
    expect(
      within(banner).getByText(
        '공개 리스트에 노출 중이에요. 설정을 수정할 수 없어요.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeDisabled();

    fireEvent.click(within(banner).getByRole('button', { name: '오픈 닫기' }));
    // 되돌릴 수 없는 동작이라 확인 절차를 한 번 거친다.
    expect(screen.getByText('이 오픈을 종료할까요?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '종료하기' }));
    expect(closeOpeningMock).toHaveBeenCalledTimes(1);
    expect(closeOpeningMock.mock.calls[0][0]).toBe(openOpening.openingId);
  });

  it('종료 확인에 일정 삭제 경고가 없고 일정이 남는다고 알린다', () => {
    // 슬롯이 챌린지 라이브 피드백과 공유되면서 종료는 더 이상 슬롯을 지우지
    // 않는다. 삭제 경고를 남겨 두면 멘토가 슬롯을 잃을까 봐 오픈을 못 닫는다.
    renderPage({ status: 'APPROVED' }, [openOpening]);

    fireEvent.click(screen.getByRole('button', { name: '오픈 닫기' }));

    expect(screen.queryByText(/일정이 모두 삭제/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/일정을 새로 등록해야 합니다/),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/등록한 일정은 그대로 남아요/)).toBeInTheDocument();
  });

  // 승인 상태에서도 멘토가 알아야 할 건 "지금 열려 있는지"다.
  // 내부 용어(승인됨)를 그대로 쓰면 닫힌 상태가 열린 것처럼 읽힌다.
  it('승인이지만 활성 개설이 없으면 오픈 종료됨으로 표시하고 재개설 버튼을 준다', () => {
    renderPage({ status: 'APPROVED' }, [closedOpening]);

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('오픈 종료됨')).toBeInTheDocument();
    expect(
      within(banner).queryByText(
        '공개 리스트에 노출 중이에요. 설정을 수정할 수 없어요.',
      ),
    ).not.toBeInTheDocument();
    // 종료 상태에서는 재개설·수정 버튼이 보이지만, 값을 바꾸려면 "수정"을
    // 먼저 눌러야 한다 — 상세 페이지 설정과 같은 규칙이다.
    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeDisabled();
    expect(
      screen.getByRole('button', { name: '다시 오픈하기' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정' })).toBeInTheDocument();
  });

  it('종료됨 배너가 일정이 그대로 남아 있다고 알린다', () => {
    renderPage({ status: 'APPROVED' }, [closedOpening]);

    const banner = within(screen.getByRole('status'));
    expect(banner.getByText(/등록해 둔 일정은 그대로/)).toBeInTheDocument();
    expect(banner.queryByText(/모두 삭제/)).not.toBeInTheDocument();
    expect(banner.queryByText(/다시 등록한 뒤/)).not.toBeInTheDocument();
  });

  // PRD §8-9 — 승인 이후에는 서버가 `PUT /settings` 를 409 로 잠근다.
  it('승인 상태에서는 저장 버튼을 아예 노출하지 않는다', () => {
    renderPage({ status: 'APPROVED' }, [closedOpening]);

    expect(
      screen.queryByRole('button', { name: '저장' }),
    ).not.toBeInTheDocument();
  });

  it('수정을 누르면 설정 필드가 바로 편집 가능해지고 저장하기가 나타난다', () => {
    // 회귀 케이스: start-edit 성공 직후 설정 쿼리가 아직 리페치 전이라
    // status 가 낡은 APPROVED 로 남는데, 그걸 그대로 따르면 수정을 눌러도
    // 화면이 재개설 지름길에 그대로 머물러 있어 "눌러도 반응이 없다"로 읽혔다.
    startEditMock.mockImplementation((_arg, options) => options?.onSuccess?.());
    renderPage({ status: 'APPROVED' }, [closedOpening]);

    fireEvent.click(screen.getByRole('button', { name: '수정' }));

    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeEnabled();
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '다시 오픈하기' }),
    ).not.toBeInTheDocument();
  });

  // 오픈은 되돌리기 번거로운 행동이라 "됐습니다" 한 줄로 끝내지 않는다.
  it('개설에 성공하면 공개 주소와 즉시 내리기를 안내한다', () => {
    openMock.mockImplementation((_body, options) =>
      options?.onSuccess?.({
        liveMentoringId: 1,
        openings: [{ ...openOpening, openingId: 777 }],
      }),
    );
    renderPage({ status: 'APPROVED' }, [closedOpening]);

    fireEvent.click(screen.getByRole('button', { name: '다시 오픈하기' }));
    passPreOpenCheck();

    const dialog = screen.getByRole('dialog', { name: '오픈 완료 안내' });
    // 지연 노출은 서버 기능이라 프론트가 흉내내지 않는다 — 지금 공개됐다고 적는다.
    expect(
      within(dialog).getByText('지금부터 모집이 시작됩니다'),
    ).toBeInTheDocument();
    expect(within(dialog).getByText(/live-mentoring\/500/)).toBeInTheDocument();
    expect(
      within(dialog).getByRole('link', { name: '상세 페이지 확인하기' }),
    ).toHaveAttribute('href', expect.stringContaining('/live-mentoring/500'));

    // 회귀 케이스: 서버는 이미 오픈을 잠갔는데(승인+개설) 설정 쿼리가 리페치되기
    // 전까지 화면이 재개설 지름길에 그대로 남아 있으면, 한 번 더 눌렀을 때
    // 서버가 막아(409) "다른 곳에서 상태가 바뀌었습니다" 에러가 났다.
    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: '수정' }),
    ).not.toBeInTheDocument();
  });

  it('안내에서 바로 종료하면 방금 만든 오픈을 종료한다', () => {
    openMock.mockImplementation((_body, options) =>
      options?.onSuccess?.({
        liveMentoringId: 1,
        openings: [{ ...openOpening, openingId: 777 }],
      }),
    );
    renderPage({ status: 'APPROVED' }, [closedOpening]);

    fireEvent.click(screen.getByRole('button', { name: '다시 오픈하기' }));
    passPreOpenCheck();
    fireEvent.click(screen.getByRole('button', { name: '바로 종료하기' }));

    expect(closeOpeningMock).toHaveBeenCalledTimes(1);
    expect(closeOpeningMock.mock.calls[0][0]).toBe(777);
  });

  // 오픈은 되돌리는 비용이 크고 잘못 나간 상세는 멘티에게 그대로 보인다.
  it('확인 체크 전에는 진행 버튼이 열리지 않는다', () => {
    renderPage({ status: 'APPROVED' }, [closedOpening]);

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
    expect(openMock).not.toHaveBeenCalled();
  });

  it('취소하면 아무것도 실행하지 않는다', () => {
    renderPage({ status: 'APPROVED' }, [closedOpening]);

    fireEvent.click(screen.getByRole('button', { name: '다시 오픈하기' }));
    fireEvent.click(
      within(
        screen.getByRole('dialog', { name: '오픈 전 상세 페이지 확인' }),
      ).getByRole('button', { name: '취소' }),
    );

    expect(openMock).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('dialog', { name: '오픈 전 상세 페이지 확인' }),
    ).not.toBeInTheDocument();
  });

  it('수정 후 아직 저장되지 않은 값이 있으면 확인 모달에서 짚어준다', () => {
    // 필드가 "수정"을 누르기 전까지 잠겨 있으므로, 재개설 지름길로는 값을
    // 바꿀 수 없다 — 이 시나리오는 수정을 눌러 초안 모드로 넘어간 뒤에만 일어난다.
    startEditMock.mockImplementation((_arg, options) => options?.onSuccess?.());
    renderPage({ status: 'APPROVED' }, [closedOpening]);
    fireEvent.click(screen.getByRole('button', { name: '수정' }));

    fireEvent.click(screen.getByRole('button', { name: '60분' }));
    fireEvent.click(screen.getByRole('button', { name: '오픈하기' }));

    expect(
      screen.getByText(
        /방금 바꾼 제목·타입·진행시간은 오픈할 때 함께 저장돼요/,
      ),
    ).toBeInTheDocument();
  });

  /*
   * 회귀 케이스 — 슬롯 편집 트리거가 잠금 fieldset 안에 있으면, 조상 fieldset 이
   * 자손 폼 컨트롤을 통째로 비활성화하면서 이 버튼까지 같이 죽는다. 그러면 멘토가
   * 슬롯을 하나 더 열 길이 "오픈 닫기"(등록한 일정을 전부 버린다) 밖에 없어진다.
   */
  it('오픈 중에도 일정 등록하기는 눌린다', () => {
    renderPage({ status: 'APPROVED' }, [openOpening]);

    const scheduleButton = screen.getByRole('button', {
      name: '일정 등록하기',
    });
    expect(scheduleButton).toBeEnabled();

    fireEvent.click(scheduleButton);
    expect(slotModalOpenSpy).toHaveBeenCalledTimes(1);
  });

  it('오픈 중에도 타이틀·타입·진행시간은 그대로 잠긴다', () => {
    // 슬롯 버튼만 푸는 것이지 설정 전체가 풀리는 게 아니다.
    renderPage({ status: 'APPROVED' }, [openOpening]);

    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeDisabled();
    expect(screen.getByRole('button', { name: '30분' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '자기소개서' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: /네이버/ })).toBeDisabled();
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
  // 멘토가 실제와 다른 화면을 보고 오픈하게 된다. 핵심 표기만 고정한다.
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

  it('공개 카드와 같이 진행기간 줄을 넣지 않는다', () => {
    // 목록 응답에 일정 정보가 없어 웹 카드에서도 기간을 표시하지 않는다.
    renderPage();
    expect(screen.queryByText('진행기간')).not.toBeInTheDocument();
    expect(screen.queryByText('미정 ~ 미정')).not.toBeInTheDocument();
  });
});
