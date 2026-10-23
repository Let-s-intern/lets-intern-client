import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const getV2 = vi.fn();

vi.mock('@/utils/axiosV2', () => ({
  default: { get: (...args: unknown[]) => getV2(...args) },
}));
vi.mock('@/utils/axios', () => ({ default: {} }));

import SearchPanel from '../SearchPanel';
import { maskEmail, toUserSearchParams } from '../useUserSearch';

const MENU = [
  {
    label: '멘토 목록',
    path: '/mentors',
    parents: ['멘토 관리'],
    keywords: [],
  },
];

const MENTORS = [
  { id: 7, name: '김멘토', nickname: '렛츠멘토', email: 'kim@letscareer.test' },
  {
    id: 8,
    name: '박선배',
    nickname: '커리어코치',
    email: 'park@letscareer.test',
  },
];

const userInfo = (
  id: number,
  name: string,
  email: string,
  isMentor = false,
) => ({
  userInfo: {
    id,
    careerType: null,
    name,
    email,
    contactEmail: null,
    university: null,
    wishField: null,
    wishJob: null,
    wishIndustry: null,
    wishEmploymentType: null,
    phoneNum: '010-0000-0000',
    marketingAgree: null,
    isMentor,
  },
  applicationInfos: [],
  documentInfos: [],
  experienceInfos: [],
  careerInfos: [],
});

let users: unknown[] = [];

const mockApi = () =>
  getV2.mockImplementation((url: string) => {
    if (url === '/admin/user/mentor')
      return Promise.resolve({ data: { data: { mentorList: MENTORS } } });
    return Promise.resolve({
      data: {
        data: {
          userAdminList: users,
          pageInfo: {
            pageNum: 0,
            pageSize: 5,
            totalElements: 0,
            totalPages: 0,
          },
        },
      },
    });
  });

const userCalls = () =>
  getV2.mock.calls.filter(([url]) => url === '/admin/user');

const renderPanel = () => {
  const onSelect = vi.fn();
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <SearchPanel
        entries={MENU}
        menuEntries={MENU}
        focusSignal={1}
        onSelect={onSelect}
        onClose={vi.fn()}
      />
    </QueryClientProvider>,
  );
  return onSelect;
};

const input = () => screen.getByRole('combobox', { name: '메뉴 검색어' });
const type = (value: string) =>
  fireEvent.change(input(), { target: { value } });
/** 유저 머리 줄(이름·배지·마스킹 이메일). 강조 때문에 글자가 쪼개져 있어 textContent 로 본다 */
const userHeaders = () =>
  [...document.querySelectorAll('li[role="presentation"]')]
    .map((item) => item.textContent ?? '')
    .filter((text) => text.includes('***'));
const findUserHeader = (text: string) =>
  waitFor(() => {
    const header = userHeaders().find((item) => item.includes(text));
    expect(header).toBeDefined();
    return header!;
  });

const optionLabels = () =>
  screen.getAllByRole('option').map((option) => option.firstChild?.textContent);

beforeEach(() => {
  users = [];
  mockApi();
});

afterEach(() => vi.clearAllMocks());

describe('검색어 → 유저 조회 파라미터', () => {
  it('@ 가 있으면 email, 숫자·하이픈만이면 phoneNum, 그 밖은 name', () => {
    expect(toUserSearchParams(' kim@test.com ')).toEqual({
      email: 'kim@test.com',
    });
    expect(toUserSearchParams('010-1234')).toEqual({ phoneNum: '010-1234' });
    expect(toUserSearchParams('김멘토')).toEqual({ name: '김멘토' });
  });

  it('이메일은 앞 한 글자와 도메인만 보인다', () => {
    expect(maskEmail('kim@letscareer.test')).toBe('k***@letscareer.test');
  });
});

describe('SearchPanel 유저 묶음', () => {
  it('2글자 미만이면 묻지 않고, 멈춘 뒤 300ms 지나 한 번만 묻는다', async () => {
    renderPanel();
    type('김');
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(userCalls()).toHaveLength(0);

    type('김멘');
    type('김멘토');
    expect(userCalls()).toHaveLength(0);
    await waitFor(() => expect(userCalls()).toHaveLength(1));
    expect(userCalls()[0][1].params).toEqual({
      name: '김멘토',
      page: 0,
      size: 5,
    });
    expect(userCalls()[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it.each([
    ['kim@letscareer.test', { email: 'kim@letscareer.test' }],
    ['010-1234', { phoneNum: '010-1234' }],
  ])('%s 는 %o 로 묻는다', async (query, expected) => {
    renderPanel();
    type(query);
    await waitFor(() => expect(userCalls()).toHaveLength(1));
    expect(userCalls()[0][1].params).toMatchObject(expected);
  });

  it('찾는 동안 안내하고, 없으면 없다고 한다', async () => {
    renderPanel();
    type('없는사람');
    expect(screen.getByText('유저 찾는 중…')).toBeInTheDocument();
    expect(
      await screen.findByText('일치하는 유저가 없습니다'),
    ).toBeInTheDocument();
  });

  it('조회가 실패하면 알린다. 메뉴 결과는 그대로다', async () => {
    getV2.mockImplementation((url: string) =>
      url === '/admin/user/mentor'
        ? Promise.resolve({ data: { data: { mentorList: [] } } })
        : Promise.reject(new Error('500')),
    );
    renderPanel();
    type('멘토 목');
    expect(optionLabels()).toEqual(['멘토 목록']);
    expect(
      await screen.findByText('유저를 불러오지 못했습니다'),
    ).toBeInTheDocument();
  });

  it('일반 유저는 마스킹한 이메일과 유저 상세·정보 수정을 하위 항목으로 둔다', async () => {
    users = [userInfo(21, '최유저', 'choi@test.com')];
    renderPanel();
    type('최유저');

    await findUserHeader('c***@test.com');
    expect(screen.queryByText('010-0000-0000')).not.toBeInTheDocument();
    expect(optionLabels()).toEqual(['유저 상세', '유저 정보 수정']);
    expect(screen.queryByText('멘토')).not.toBeInTheDocument();
  });

  it('멘토는 배지를 달고 멘토 상세까지 셋을 둔다. 키보드로 하위 항목을 골라 이동한다', async () => {
    users = [userInfo(30, '이멘토', 'lee@test.com', true)];
    const onSelect = renderPanel();
    type('이멘토');

    expect(await findUserHeader('l***@test.com')).toContain('멘토');
    expect(optionLabels()).toEqual([
      '멘토 상세',
      '유저 상세',
      '유저 정보 수정',
    ]);

    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/users/30' }),
    );
  });

  it('멘토 닉네임으로 바로 찾고 「닉네임 (이름)」 으로 보인다', async () => {
    renderPanel();
    type('렛츠멘');
    await findUserHeader('렛츠멘토 (김멘토)');
    expect(optionLabels().slice(0, 3)).toEqual([
      '멘토 상세',
      '유저 상세',
      '유저 정보 수정',
    ]);
  });

  it('닉네임과 이름으로 함께 걸린 같은 사람은 한 번만, 닉네임 일치를 앞에 둔다', async () => {
    users = [
      userInfo(7, '김멘토', 'kim@letscareer.test', true),
      userInfo(40, '김멘토스', 'other@test.com'),
    ];
    renderPanel();
    type('김멘토');

    await findUserHeader('o***@test.com');
    const titles = userHeaders();
    expect(titles).toHaveLength(2);
    expect(titles[0]).toContain('렛츠멘토 (김멘토)');
  });

  it('멘토 목록은 패널에서 한 번만 받아 둔다', async () => {
    renderPanel();
    type('렛츠');
    await findUserHeader('렛츠멘토 (김멘토)');
    type('커리어');
    await findUserHeader('커리어코치 (박선배)');
    expect(
      getV2.mock.calls.filter(([url]) => url === '/admin/user/mentor'),
    ).toHaveLength(1);
  });
});
