import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MissionContentsReq } from '@/schema';

import MissionContentsVersionDialog from '../MissionContentsVersionDialog';

const versions = [
  { challengeVersionId: 10, title: '대학생' },
  { challengeVersionId: 20, title: '직장인' },
];

const contentsOptions = [
  { id: 1, title: '자료A' },
  { id: 2, title: '자료B' },
];

type User = ReturnType<typeof userEvent.setup>;

const renderDialog = (initialValue: MissionContentsReq[]) => {
  const onSave = vi.fn();
  render(
    <MissionContentsVersionDialog
      open
      th={3}
      type="ESSENTIAL"
      versions={versions}
      contentsOptions={contentsOptions}
      initialValue={initialValue}
      onClose={vi.fn()}
      onSave={onSave}
    />,
  );
  return { onSave, user: userEvent.setup() };
};

const choose = async (user: User, combobox: HTMLElement, option: string) => {
  await user.click(combobox);
  await user.click(
    within(screen.getByRole('listbox')).getByRole('option', { name: option }),
  );
};

const versionBoxes = () => screen.getAllByRole('combobox', { name: '버전' });
const contentsBoxes = () => screen.getAllByRole('combobox', { name: '자료' });

describe('MissionContentsVersionDialog', () => {
  it('회차와 자료 종류로 제목을 만들고 초기 값을 행으로 보여준다', () => {
    renderDialog([
      { contentsId: 1, challengeVersionId: null },
      { contentsId: 2, challengeVersionId: 10 },
    ]);

    expect(screen.getByText('3회차 필수 자료')).toBeInTheDocument();
    expect(versionBoxes()[0]).toHaveTextContent('공통');
    expect(contentsBoxes()[0]).toHaveTextContent('(1) 자료A');
    expect(versionBoxes()[1]).toHaveTextContent('대학생');
    expect(contentsBoxes()[1]).toHaveTextContent('(2) 자료B');
  });

  it('행을 추가해 버전과 자료를 고르면 저장 값에 들어간다', async () => {
    const { onSave, user } = renderDialog([
      { contentsId: 1, challengeVersionId: null },
    ]);

    await user.click(screen.getByRole('button', { name: '행 추가' }));
    expect(versionBoxes()).toHaveLength(2);
    expect(versionBoxes()[1]).toHaveTextContent('공통');

    await choose(user, versionBoxes()[1], '직장인');
    await choose(user, contentsBoxes()[1], '(2) 자료B');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(onSave).toHaveBeenCalledWith([
      { contentsId: 1, challengeVersionId: null },
      { contentsId: 2, challengeVersionId: 20 },
    ]);
  });

  it('삭제한 행과 자료를 고르지 않은 행은 저장 값에서 빠진다', async () => {
    const { onSave, user } = renderDialog([
      { contentsId: 1, challengeVersionId: null },
      { contentsId: 2, challengeVersionId: 10 },
    ]);

    await user.click(screen.getAllByRole('button', { name: '삭제' })[0]);
    await user.click(screen.getByRole('button', { name: '행 추가' }));
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(onSave).toHaveBeenCalledWith([
      { contentsId: 2, challengeVersionId: 10 },
    ]);
  });

  it('같은 버전에 같은 자료인 행이 두 개면 저장을 막고, 버전을 바꾸면 두 행으로 저장한다', async () => {
    const { onSave, user } = renderDialog([
      { contentsId: 1, challengeVersionId: null },
    ]);

    await user.click(screen.getByRole('button', { name: '행 추가' }));
    await choose(user, contentsBoxes()[1], '(1) 자료A');

    expect(
      screen.getByText('같은 버전에 같은 자료가 두 번 걸려 있습니다'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();

    await choose(user, versionBoxes()[1], '대학생');

    expect(
      screen.queryByText('같은 버전에 같은 자료가 두 번 걸려 있습니다'),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '저장' }));
    expect(onSave).toHaveBeenCalledWith([
      { contentsId: 1, challengeVersionId: null },
      { contentsId: 1, challengeVersionId: 10 },
    ]);
  });
});
