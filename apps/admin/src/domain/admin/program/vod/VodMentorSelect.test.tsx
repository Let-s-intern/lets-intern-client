import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import VodMentorSelect from './VodMentorSelect';

vi.mock('@/api/mentor/mentor', () => ({
  useAdminUserMentorListQuery: () => ({
    data: {
      mentorList: [
        {
          id: 21,
          name: '김철수',
          nickname: '커리어코치',
          email: 'kim@letscareer.test',
          hashTagList: [],
        },
        {
          id: 22,
          name: '김철수',
          nickname: '렛츠멘토',
          email: 'kim2@letscareer.test',
          hashTagList: [],
        },
        {
          id: 23,
          name: '이영희',
          nickname: null,
          email: 'lee@letscareer.test',
          hashTagList: [],
        },
      ],
    },
  }),
}));

const optionTexts = () =>
  screen.queryAllByRole('option').map((option) => option.textContent);

/**
 * VOD 의 멘토 계정 연결(mentor_user_id)은 멘토 정산 기준이다.
 * 라이브와 같은 방식으로 닉네임·실명·이메일 어느 쪽으로도 찾을 수 있어야 한다.
 */
describe('VodMentorSelect', () => {
  it('멘토 목록을 닉네임 (실명) · 이메일 형식으로 보여준다', async () => {
    render(<VodMentorSelect onChange={vi.fn()} />);

    await userEvent.click(screen.getByRole('combobox'));

    expect(optionTexts()).toEqual([
      '커리어코치 (김철수) · kim@letscareer.test',
      '렛츠멘토 (김철수) · kim2@letscareer.test',
      '이영희 · lee@letscareer.test',
    ]);
  });

  it('이미 연결된 멘토를 선택된 상태로 보여준다', () => {
    render(<VodMentorSelect value={22} onChange={vi.fn()} />);

    expect(screen.getByRole('combobox')).toHaveValue(
      '렛츠멘토 (김철수) · kim2@letscareer.test',
    );
  });

  it('닉네임으로 검색할 수 있다', async () => {
    render(<VodMentorSelect onChange={vi.fn()} />);

    await userEvent.type(screen.getByRole('combobox'), '렛츠');

    expect(optionTexts()).toEqual(['렛츠멘토 (김철수) · kim2@letscareer.test']);
  });

  it('실명으로 검색하면 동명이인이 닉네임으로 구분돼 모두 나온다', async () => {
    render(<VodMentorSelect onChange={vi.fn()} />);

    await userEvent.type(screen.getByRole('combobox'), '김철수');

    expect(optionTexts()).toEqual([
      '커리어코치 (김철수) · kim@letscareer.test',
      '렛츠멘토 (김철수) · kim2@letscareer.test',
    ]);
  });

  it('이메일로 검색할 수 있다', async () => {
    render(<VodMentorSelect onChange={vi.fn()} />);

    await userEvent.type(screen.getByRole('combobox'), 'lee@');

    expect(optionTexts()).toEqual(['이영희 · lee@letscareer.test']);
  });

  it('멘토를 고르면 그 멘토의 유저 id 를 넘긴다', async () => {
    const onChange = vi.fn();
    render(<VodMentorSelect onChange={onChange} />);

    await userEvent.type(screen.getByRole('combobox'), '렛츠');
    await userEvent.click(screen.getByRole('option'));

    expect(onChange).toHaveBeenCalledWith(22);
  });

  it('서버가 연결 해제를 받지 않으므로 선택된 뒤에는 지우기 버튼이 없다', () => {
    render(<VodMentorSelect value={22} onChange={vi.fn()} />);

    expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument();
  });
});
