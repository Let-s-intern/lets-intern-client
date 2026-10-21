import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const userDetailQuery = vi.fn();

vi.mock('@/api/user/user', () => ({
  useAdminUserDetailQuery: (id: number) => userDetailQuery(id),
}));

import ReviewMentorBar from './ReviewMentorBar';

describe('ReviewMentorBar', () => {
  it('멘토 닉네임과 이름으로 누구의 후기인지 알린다', () => {
    userDetailQuery.mockReturnValue({
      data: {
        userInfo: { name: '김멘토', nickname: '렛츠멘토', profileImgUrl: null },
      },
    });

    render(<ReviewMentorBar mentorId={21} onChangeMentor={vi.fn()} />);

    expect(userDetailQuery).toHaveBeenCalledWith(21);
    expect(screen.getByText('렛츠멘토 (김멘토)')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '멘토 필터' })).toHaveTextContent(
      '멘토의 후기를 보고 있습니다.',
    );
  });

  it('닉네임이 없으면 이름만, 불러오기 전이면 번호로 적는다', () => {
    userDetailQuery.mockReturnValue({
      data: {
        userInfo: { name: '김멘토', nickname: null, profileImgUrl: null },
      },
    });
    const { rerender } = render(
      <ReviewMentorBar mentorId={21} onChangeMentor={vi.fn()} />,
    );
    expect(screen.getByText('김멘토')).toBeInTheDocument();

    userDetailQuery.mockReturnValue({ data: undefined });
    rerender(<ReviewMentorBar mentorId={21} onChangeMentor={vi.fn()} />);
    expect(screen.getByText('멘토 #21')).toBeInTheDocument();
  });

  it('다른 멘토 고르기를 누르면 onChangeMentor 를 부른다', () => {
    userDetailQuery.mockReturnValue({ data: undefined });
    const onChangeMentor = vi.fn();
    render(<ReviewMentorBar mentorId={21} onChangeMentor={onChangeMentor} />);

    fireEvent.click(screen.getByRole('button', { name: '다른 멘토 고르기' }));

    expect(onChangeMentor).toHaveBeenCalledTimes(1);
  });
});
