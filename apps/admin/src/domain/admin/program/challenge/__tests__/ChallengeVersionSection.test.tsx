import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ChallengeVersionSection, {
  ChallengeVersionDraft,
} from '../ChallengeVersionSection';

const versions: ChallengeVersionDraft[] = [
  { challengeVersionId: 1, title: '대학생' },
  { challengeVersionId: 2, title: '인턴 경력' },
  { challengeVersionId: null, title: '이직자' },
];

const renderSection = (initial: ChallengeVersionDraft[] = versions) => {
  const onChange = vi.fn();
  render(<ChallengeVersionSection versions={initial} onChange={onChange} />);
  return onChange;
};

describe('ChallengeVersionSection', () => {
  it('섹션 설명을 보여준다', () => {
    renderSection([]);

    expect(
      screen.getByText(
        '버전이 없으면 모든 참여자가 같은 자료를 봅니다. 참여자는 신청할 때 버전을 하나 고릅니다.',
      ),
    ).toBeInTheDocument();
  });

  it('버전 추가를 누르면 id 가 null 인 빈 버전을 끝에 붙인다', () => {
    const onChange = renderSection();

    fireEvent.click(screen.getByRole('button', { name: '버전 추가' }));

    expect(onChange).toHaveBeenCalledWith([
      ...versions,
      { challengeVersionId: null, title: '' },
    ]);
  });

  it('제목을 입력하면 그 행의 제목만 바꾼다', () => {
    const onChange = renderSection();

    fireEvent.change(screen.getAllByLabelText('버전 제목')[1], {
      target: { value: '직장인' },
    });

    expect(onChange).toHaveBeenCalledWith([
      versions[0],
      { challengeVersionId: 2, title: '직장인' },
      versions[2],
    ]);
  });

  it('제목 입력은 50자로 제한한다', () => {
    renderSection();

    expect(screen.getAllByLabelText('버전 제목')[0]).toHaveAttribute(
      'maxlength',
      '50',
    );
  });

  it('위로 이동하면 바로 위 행과 자리를 바꾼다', () => {
    const onChange = renderSection();

    fireEvent.click(screen.getByRole('button', { name: '2번 버전 위로 이동' }));

    expect(onChange).toHaveBeenCalledWith([
      versions[1],
      versions[0],
      versions[2],
    ]);
  });

  it('아래로 이동하면 바로 아래 행과 자리를 바꾼다', () => {
    const onChange = renderSection();

    fireEvent.click(
      screen.getByRole('button', { name: '2번 버전 아래로 이동' }),
    );

    expect(onChange).toHaveBeenCalledWith([
      versions[0],
      versions[2],
      versions[1],
    ]);
  });

  it('첫 행은 위로, 마지막 행은 아래로 이동할 수 없다', () => {
    renderSection();

    expect(
      screen.getByRole('button', { name: '1번 버전 위로 이동' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: '3번 버전 아래로 이동' }),
    ).toBeDisabled();
  });

  it('삭제하면 그 행을 뺀 목록을 넘긴다', () => {
    const onChange = renderSection();

    fireEvent.click(screen.getByRole('button', { name: '1번 버전 삭제' }));

    expect(onChange).toHaveBeenCalledWith([versions[1], versions[2]]);
  });

  it('제목이 비었거나 공백뿐인 행에만 에러를 표시한다', () => {
    renderSection([
      { challengeVersionId: 1, title: '대학생' },
      { challengeVersionId: null, title: '' },
      { challengeVersionId: null, title: '   ' },
    ]);

    const inputs = screen.getAllByLabelText('버전 제목');
    expect(inputs[0]).not.toHaveAttribute('aria-invalid', 'true');
    expect(inputs[1]).toHaveAttribute('aria-invalid', 'true');
    expect(inputs[2]).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getAllByText('버전 제목을 입력해주세요.')).toHaveLength(2);
  });
});
