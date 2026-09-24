import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/*
 * LC-3266 회귀 테스트.
 *
 * 프로필 화면에는 저장 버튼이 하나뿐이어야 한다. 예전에는 해시태그와 상세페이지 제작이
 * 각자 저장 버튼을 갖고 있어서, 멘토가 "저장" 을 눌러도 그 둘이 빠진 채 저장됐다.
 */

/*
 * 해시태그 섹션이 쓰는 `CategoryTabs` 가 인디케이터 위치를 재려고 ResizeObserver 를 만든다.
 * jsdom 에는 없어서 마운트 자체가 실패한다. 관측 결과는 이 테스트와 무관하므로 빈 껍데기면 된다.
 */
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

const patchUserMock = vi.fn();
const putHashTagsMock = vi.fn();

/** 참조 고정. 이유는 아래 ALL_TAGS 주석과 같다. */
const BASE_USER = {
  userId: 500,
  name: '임성빈',
  nickname: '쥬디',
  email: 'mentor@example.com',
  phoneNum: '01000000000',
  sns: null,
  profileImgUrl: null,
  introduction: '한마디',
  description: null,
};

/** 테스트마다 갈아끼운다. 참조는 렌더 사이에 고정돼야 한다(위 주석 참고). */
let USER: typeof BASE_USER = BASE_USER;

vi.mock('@/api/user/user', () => ({
  useUserQuery: () => ({ data: USER }),
  usePatchUser: () => ({ mutateAsync: patchUserMock }),
}));

/*
 * 참조가 매 렌더 바뀌면 안 된다. 페이지는 `myTags` 를 의존성으로 둔 effect 에서 선택 상태를
 * 초기화하는데, 렌더마다 새 배열이 오면 그 effect 가 끝없이 다시 돈다. react-query 는
 * 데이터가 그대로면 같은 참조를 주므로, 목도 같은 성질을 지켜야 실제와 같은 조건이 된다.
 */
const ALL_TAGS = [
  { id: 1, type: 'JOB', title: '기획' },
  { id: 2, type: 'JOB', title: '마케팅' },
];
const MY_TAGS = [ALL_TAGS[0]];

vi.mock('@/api/mentor-hash-tag/mentorHashTag', () => ({
  useMentorHashTagListQuery: () => ({ data: ALL_TAGS, isLoading: false }),
  useMyMentorHashTagListQuery: () => ({ data: MY_TAGS, isLoading: false }),
  usePutMyMentorHashTag: () => ({ mutateAsync: putHashTagsMock }),
}));

// 경력은 이 화면의 관심사가 아니다. 자체 API 를 타므로 통째로 비운다.
vi.mock('../ui/CareerSection', () => ({
  default: () => <div />,
}));

/*
 * Lexical 에디터는 마운트 비용이 크고 이 테스트의 관심사가 아니다.
 * 저장 payload 에 `description` 이 실리는지만 보면 되므로 본문을 바꾸는 버튼 하나로 대신한다.
 */
vi.mock('@/common/lexical/EditorApp', () => ({
  default: ({
    initialEditorStateJsonString,
    onChange,
  }: {
    initialEditorStateJsonString: string;
    onChange: (json: string) => void;
  }) => (
    <div>
      {/* 마운트 시 받은 초기값. 저장한 내용이 다시 보이는지 확인하는 창구다. */}
      <span data-testid="editor-initial">{initialEditorStateJsonString}</span>
      <button
        type="button"
        onClick={() => onChange('{"root":{"edited":true}}')}
      >
        본문 수정
      </button>
    </div>
  ),
  emptyEditorState: '{"root":{"children":[]}}',
}));

import ProfilePage from '../ProfilePage';

const renderPage = () =>
  render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>,
  );

const saveButton = () => screen.getByRole('button', { name: '저장' });

beforeEach(() => {
  patchUserMock.mockReset().mockResolvedValue(undefined);
  putHashTagsMock.mockReset().mockResolvedValue(undefined);
  USER = BASE_USER;
});

describe('ProfilePage 저장', () => {
  it('섹션별 저장 버튼이 없다', () => {
    renderPage();

    expect(screen.queryByRole('button', { name: '해시태그 저장' })).toBeNull();
    expect(
      screen.queryByRole('button', { name: '상세페이지 저장' }),
    ).toBeNull();
    expect(saveButton()).toBeTruthy();
  });

  it('해시태그만 바꿔도 한 번의 저장으로 반영된다', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '# 마케팅' }));
    fireEvent.click(saveButton());

    await waitFor(() => expect(putHashTagsMock).toHaveBeenCalledTimes(1));
    expect(putHashTagsMock).toHaveBeenCalledWith({
      mentorHashTagIdList: [1, 2],
    });
    // 프로필 쪽은 바뀐 게 없으므로 요청하지 않는다.
    expect(patchUserMock).not.toHaveBeenCalled();
  });

  it('상세페이지 본문은 프로필 저장 요청에 함께 실린다', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '본문 수정' }));
    fireEvent.click(saveButton());

    await waitFor(() => expect(patchUserMock).toHaveBeenCalledTimes(1));
    expect(patchUserMock.mock.calls[0][0]).toMatchObject({
      description: '{"root":{"edited":true}}',
    });
    expect(putHashTagsMock).not.toHaveBeenCalled();
  });

  it('둘 다 바뀌면 두 요청이 모두 나간다', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '# 마케팅' }));
    fireEvent.click(screen.getByRole('button', { name: '본문 수정' }));
    fireEvent.click(saveButton());

    await waitFor(() => expect(patchUserMock).toHaveBeenCalledTimes(1));
    expect(putHashTagsMock).toHaveBeenCalledTimes(1);
  });

  it('해시태그만 실패하면 실패한 쪽을 이름으로 알린다', async () => {
    putHashTagsMock.mockRejectedValue(new Error('boom'));
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '# 마케팅' }));
    fireEvent.click(screen.getByRole('button', { name: '본문 수정' }));
    fireEvent.click(saveButton());

    await waitFor(() =>
      expect(screen.getByText('해시태그 저장에 실패했습니다.')).toBeTruthy(),
    );
    // 프로필은 성공했으므로 "저장되었습니다" 를 함께 띄우지 않는다.
    expect(screen.queryByText('프로필이 저장되었습니다.')).toBeNull();
  });

  it('실패한 쪽만 변경사항으로 남아 다시 저장된다', async () => {
    putHashTagsMock.mockRejectedValueOnce(new Error('boom'));
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '# 마케팅' }));
    fireEvent.click(screen.getByRole('button', { name: '본문 수정' }));
    fireEvent.click(saveButton());

    await waitFor(() => expect(putHashTagsMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(patchUserMock).toHaveBeenCalledTimes(1));

    fireEvent.click(saveButton());

    // 해시태그는 다시 보내고, 이미 저장된 프로필은 다시 보내지 않는다.
    await waitFor(() => expect(putHashTagsMock).toHaveBeenCalledTimes(2));
    expect(patchUserMock).toHaveBeenCalledTimes(1);
  });

  it('둘 다 성공하면 저장 완료를 알린다', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '# 마케팅' }));
    fireEvent.click(saveButton());

    await waitFor(() =>
      expect(screen.getByText('프로필이 저장되었습니다.')).toBeTruthy(),
    );
  });
});

describe('ProfilePage SNS', () => {
  const snsInput = () => screen.getByPlaceholderText('https://...');

  // LC-3306 — 전부 지우고 저장하면 서버가 기존 값을 지워야 한다. null 은 "바꾸지 않음"이다.
  it('SNS 를 모두 지우고 저장하면 빈 문자열을 보낸다', async () => {
    USER = {
      ...BASE_USER,
      sns: '["https://instagram.com/a"]',
    } as unknown as typeof BASE_USER;
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'SNS 삭제' }));
    fireEvent.click(saveButton());

    await waitFor(() => expect(patchUserMock).toHaveBeenCalledTimes(1));
    expect(patchUserMock.mock.calls[0][0].sns).toBe('');
  });

  // LC-3307 — URL 이 아닌 값은 저장하지 않는다.
  it('주소 형식이 아니면 알리고 저장하지 않는다', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '+ 추가' }));
    fireEvent.change(snsInput(), { target: { value: 'instagram' } });

    expect(screen.getByRole('alert')).toHaveTextContent('주소 형식이 아니에요');

    fireEvent.click(saveButton());

    await waitFor(() =>
      expect(screen.getByText('SNS 주소를 확인해 주세요.')).toBeTruthy(),
    );
    expect(patchUserMock).not.toHaveBeenCalled();
    expect(putHashTagsMock).not.toHaveBeenCalled();
  });

  it('도메인만 쓰면 https:// 를 붙여 저장한다', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '+ 추가' }));
    fireEvent.change(snsInput(), { target: { value: 'instagram.com/a' } });
    fireEvent.click(saveButton());

    await waitFor(() => expect(patchUserMock).toHaveBeenCalledTimes(1));
    expect(patchUserMock.mock.calls[0][0].sns).toBe(
      '["https://instagram.com/a"]',
    );
  });
});

/*
  회귀 테스트 — 저장한 상세페이지 본문이 새로고침 후에도 보여야 한다.

  LC-3266 에서 에디터 초기값을 페이지 상태(savedDetailContent)로 넘기게 바꿨는데,
  그 상태는 effect 에서 채워진다. user 가 도착한 렌더에서 에디터가 먼저 마운트되고
  그 뒤에 값이 들어오므로, 비제어 EditorApp 은 늦게 온 값을 반영하지 않았다.
  결과적으로 저장한 내용이 새로고침 후 빈 화면으로 보였다.
*/
describe('ProfilePage 상세페이지 본문', () => {
  it('저장된 본문을 그대로 에디터에 넣는다', () => {
    const saved = '{"root":{"children":[{"text":"저장한 소개"}]}}';
    USER = { ...BASE_USER, description: saved } as typeof BASE_USER;

    renderPage();

    expect(screen.getByTestId('editor-initial')).toHaveTextContent(saved);
  });

  it('본문이 없으면 빈 에디터로 연다', () => {
    renderPage();

    expect(screen.getByTestId('editor-initial')).toHaveTextContent(
      '{"root":{"children":[]}}',
    );
  });
});
