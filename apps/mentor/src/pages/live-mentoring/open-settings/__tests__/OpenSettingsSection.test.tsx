import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  LiveMentoringSettings,
  LiveMentoringSettingsUpdate,
  OpeningHistoryItem,
} from '@/api/live-mentoring/liveMentoringSchema';

const saveMock = vi.fn().mockResolvedValue(undefined);
/**
 * 저장 버튼은 페이지가 한 자리에 그린다 — 이 본문은 「보낼 게 있는지」와 「보내면
 * 거절당할 이유」만 위로 올린다(LC-3288).
 */
const saveStateSpy = vi.fn();
/** 페이지가 저장 버튼을 눌렀을 때 부를 함수. 본문이 여기에 담아 둔다. */
const saveRef: {
  current: (() => Promise<{ ok: boolean; reason?: string }>) | null;
} = { current: null };
/** 저장 버튼을 누른 것과 같다. */
const 저장_버튼을_누른다 = async () => {
  let result: { ok: boolean; reason?: string } | undefined;
  await act(async () => {
    result = await saveRef.current?.();
  });
  return result;
};
const openMock = vi.fn();
const closeOpeningMock = vi.fn();
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
    mutateAsync: saveMock,
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

import OpenSettingsSection from '../OpenSettingsSection';

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

const renderPage = (
  overrides: Partial<LiveMentoringSettings> = {},
  openings: OpeningHistoryItem[] = [],
) => {
  settingsData = { ...baseSettings, ...overrides };
  openingsData = openings;
  return render(
    <MemoryRouter>
      <OpenSettingsSection onSaveStateChange={saveStateSpy} saveRef={saveRef} />
    </MemoryRouter>,
  );
};

afterEach(() => {
  saveMock.mockReset().mockResolvedValue(undefined);
  saveStateSpy.mockReset();
  saveRef.current = null;
  openMock.mockReset();
  closeOpeningMock.mockReset();
  setRepresentativeCareerMock.mockReset();
  slotModalOpenSpy.mockReset();
  settingsData = undefined;
  openingsData = [];
});

describe('OpenSettingsSection — 프로필은 읽기 전용', () => {
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

describe('OpenSettingsSection — 대표 경력 지정(전용 API 로 즉시 저장)', () => {
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

describe('OpenSettingsSection — 진행시간(다중) → 최저가', () => {
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

describe('OpenSettingsSection — 피드백 진행 일정이 화면에서 사라졌다', () => {
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

describe('OpenSettingsSection — 상태 충돌 안내 문구', () => {
  // 회귀 케이스: LOCKED 와 INVALID_STATE 를 한데 묶어 "다른 곳에서 상태가
  // 바뀌었습니다"로 안내하던 시절, 멘토가 다른 창을 의심하며 새로고침만 반복했다.
  // LOCKED 는 개설이 열려 있다는 뜻이고 할 일은 "오픈 종료"다.
  const 저장이_실패한다 = (code: string) =>
    saveMock.mockRejectedValueOnce({ code, message: '서버 메시지' });

  /** 제목을 고쳐 저장을 한 번 내보낸다. */
  const 저장을_내보낸다 = async () => {
    fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
      target: { value: '이력서 클리닉' },
    });
    return 저장_버튼을_누른다();
  };

  it('LOCKED 면 오픈을 종료하라고 안내한다', async () => {
    저장이_실패한다('LIVE_MENTORING_LOCKED');
    renderPage();

    expect(await 저장을_내보낸다()).toEqual({
      ok: false,
      reason: '오픈 중에는 설정을 수정할 수 없습니다.',
    });
  });

  it('INVALID_STATE 면 상태가 바뀌었다고 안내한다', async () => {
    저장이_실패한다('LIVE_MENTORING_INVALID_STATE');
    renderPage();

    expect(await 저장을_내보낸다()).toEqual({
      ok: false,
      reason: '다른 곳에서 상태가 바뀌었습니다.',
    });
  });
});

/*
 * LC-3288 — 실시간 저장을 걷어내고 멘토가 「저장하기」를 직접 누른다.
 *
 * 버튼은 스텝을 아는 페이지가 한 자리에 그리므로, 이 본문은 저장 함수를 `saveRef` 에
 * 담아 두고 「보낼 게 있는지」와 「보내면 거절당할 이유」만 위로 올린다.
 */
describe('OpenSettingsSection — 저장(제목·타입·진행시간)', () => {
  it('title/categories/durations 세 필드를 담아 보낸다', async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
      target: { value: '이력서 클리닉' },
    });
    await 저장_버튼을_누른다();

    expect(saveMock).toHaveBeenCalledTimes(1);
    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload).toEqual({
      title: '이력서 클리닉',
      categories: baseSettings.categories,
      durations: baseSettings.durations,
    });
  });

  it('타입을 여러 개 선택하면 payload categories 에 담긴다', async () => {
    renderPage({ categories: ['PERSONAL_STATEMENT'] });

    fireEvent.click(screen.getByRole('button', { name: '이력서' }));
    await 저장_버튼을_누른다();

    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload.categories).toEqual(['PERSONAL_STATEMENT', 'RESUME']);
    expect(payload.durations).toEqual(baseSettings.durations);
  });

  it('진행시간만 바꿔도 저장이 나간다', async () => {
    renderPage({ durations: [30] });

    fireEvent.click(screen.getByRole('button', { name: '60분' }));
    await 저장_버튼을_누른다();

    const payload = saveMock.mock.calls[0][0] as LiveMentoringSettingsUpdate;
    expect(payload.durations).toEqual([30, 60]);
  });

  /*
    서버가 거절할 값이면 버튼을 잠근다. 눌러서 400 을 받아 보고 알게 하면 무엇을 고쳐야
    하는지 화면에 남지 않는다 — 잠그는 이유를 함께 올려 버튼 위에 적는다.
  */
  it('타이틀이 비면 저장을 잠그고 무엇을 채우면 되는지 알린다', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('1대1 멘토링 타이틀'), {
      target: { value: '' },
    });

    expect(saveMock).not.toHaveBeenCalled();
    expect(saveStateSpy).toHaveBeenLastCalledWith({
      isDirty: true,
      blockedReason: '타이틀을 채우면 저장돼요',
    });
  });

  it('진행시간을 모두 지우면 저장을 잠근다', () => {
    renderPage({ durations: [30] });

    fireEvent.click(screen.getByRole('button', { name: '30분' }));

    expect(saveMock).not.toHaveBeenCalled();
    expect(saveStateSpy).toHaveBeenLastCalledWith({
      isDirty: true,
      blockedReason: '진행시간을 하나 이상 고르면 저장돼요',
    });
  });

  it('손댄 게 없으면 보낼 것도 없다고 알린다', () => {
    renderPage();

    expect(saveStateSpy).toHaveBeenLastCalledWith({
      isDirty: false,
      blockedReason: null,
    });
  });
});

describe('OpenSettingsSection — 상태별 배너와 잠금', () => {
  it('초안(DRAFT)이면 배너가 없다', () => {
    renderPage({ status: 'DRAFT' });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    // 백엔드는 PENDING_REVIEW/REJECTED 상태를 더 이상 보내지 않는다 — 해당 배너도 없다.
    expect(screen.queryByText('검토 대기')).not.toBeInTheDocument();
    expect(screen.queryByText('반려됨')).not.toBeInTheDocument();
  });

  it('진행시간이 0개면 경고를 보인다', () => {
    renderPage({ durations: [30] });

    fireEvent.click(screen.getByRole('button', { name: '30분' }));

    expect(
      screen.getByText('진행시간을 최소 1개 이상 선택해야 오픈할 수 있어요.'),
    ).toBeInTheDocument();
  });

  // 승인 상태에서도 멘토가 알아야 할 건 "지금 열려 있는지"다.
  // 내부 용어(승인됨)를 그대로 쓰면 닫힌 상태가 열린 것처럼 읽힌다.
  it('활성 개설이 없으면 오픈 종료됨으로 표시하고 공개 토글을 가리킨다', () => {
    renderPage({ status: 'APPROVED' }, [closedOpening]);

    const banner = screen.getByRole('status');
    expect(within(banner).getByText('오픈 종료됨')).toBeInTheDocument();
    expect(
      within(banner).getByText(/오른쪽 위의 공개 토글을 켜면/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeEnabled();
  });

  it('종료됨 배너가 일정이 그대로 남아 있다고 알린다', () => {
    renderPage({ status: 'APPROVED' }, [closedOpening]);

    const banner = within(screen.getByRole('status'));
    expect(banner.getByText(/등록해 둔 일정은 그대로/)).toBeInTheDocument();
    expect(banner.queryByText(/모두 삭제/)).not.toBeInTheDocument();
    expect(banner.queryByText(/다시 등록한 뒤/)).not.toBeInTheDocument();
  });

  it('오픈 중에는 배너를 띄우지 않는다', () => {
    renderPage({ status: 'APPROVED' }, [openOpening]);

    expect(screen.queryByText('오픈 종료됨')).not.toBeInTheDocument();
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

  it('오픈 중에도 타이틀·타입·진행시간을 고칠 수 있다', () => {
    renderPage({ status: 'APPROVED' }, [openOpening]);

    expect(screen.getByLabelText('1대1 멘토링 타이틀')).toBeEnabled();
    expect(screen.getByRole('button', { name: '30분' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '자기소개서' })).toBeEnabled();
    expect(screen.getByRole('radio', { name: /네이버/ })).toBeEnabled();
  });
});

describe('OpenSettingsSection — 미리보기', () => {
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
