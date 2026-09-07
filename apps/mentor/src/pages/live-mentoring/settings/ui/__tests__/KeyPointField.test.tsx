import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import KeyPointField, { KEY_POINT_MAX } from '../KeyPointField';

/**
 * 탭 1 · 소개 문구 목록 (시안 `1-핵심소개.png`).
 *
 * 상한 3개와 60자는 시안 문구("최대 3개까지 등록할 수 있으며", "0/60")가 근거다.
 * 서버는 500자까지 받지만 상세 페이지 레이아웃이 감당하는 길이가 기준이다.
 */
describe('KeyPointField', () => {
  const renderField = (bullets: string[]) => {
    const onChange = vi.fn();
    render(<KeyPointField bullets={bullets} onChange={onChange} />);
    return onChange;
  };

  it('시안 문구로 라벨과 개수 안내를 보여준다', () => {
    renderField([]);

    expect(screen.getByText('소개 문구')).toBeInTheDocument();
    expect(
      screen.getByText(
        `최대 ${KEY_POINT_MAX}개까지 등록할 수 있으며, 작성한 순서대로 표시돼요.`,
      ),
    ).toBeInTheDocument();
  });

  it('추가 버튼을 누르면 빈 줄이 하나 늘어난다', () => {
    const onChange = renderField(['첫 줄']);

    fireEvent.click(screen.getByRole('button', { name: '소개 문구 추가 +' }));

    expect(onChange).toHaveBeenCalledWith(['첫 줄', '']);
  });

  it(`${KEY_POINT_MAX}개가 차면 추가 버튼이 비활성이다`, () => {
    renderField(['하나', '둘', '셋']);

    expect(
      screen.getByRole('button', { name: '소개 문구 추가 +' }),
    ).toBeDisabled();
  });

  it('60자를 넘겨 입력할 수 없다', () => {
    renderField(['']);

    expect(screen.getByLabelText('소개 문구 1')).toHaveAttribute(
      'maxLength',
      '60',
    );
  });

  it('입력한 글자수를 세어 보여준다', () => {
    renderField(['열두 글자입니다']);

    expect(screen.getByText('8/60')).toBeInTheDocument();
  });

  it('삭제를 누르면 그 줄만 빠진다', () => {
    const onChange = renderField(['하나', '둘', '셋']);

    fireEvent.click(screen.getByRole('button', { name: '2번 소개 문구 삭제' }));

    expect(onChange).toHaveBeenCalledWith(['하나', '셋']);
  });

  it('위로 옮기면 앞 줄과 자리가 바뀐다', () => {
    const onChange = renderField(['하나', '둘']);

    fireEvent.click(screen.getByRole('button', { name: '2번 소개 문구 위로' }));

    expect(onChange).toHaveBeenCalledWith(['둘', '하나']);
  });

  it('첫 줄은 더 올릴 수 없다', () => {
    renderField(['하나', '둘']);

    expect(
      screen.getByRole('button', { name: '1번 소개 문구 위로' }),
    ).toBeDisabled();
  });

  it('입력하면 그 줄만 바뀐다', () => {
    const onChange = renderField(['하나', '둘']);

    fireEvent.change(screen.getByLabelText('소개 문구 2'), {
      target: { value: '바뀐 둘' },
    });

    expect(onChange).toHaveBeenCalledWith(['하나', '바뀐 둘']);
  });
});
