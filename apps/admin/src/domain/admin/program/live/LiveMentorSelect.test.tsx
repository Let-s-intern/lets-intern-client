import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { getLiveIdSchema } from '@/schema';
import LiveMentorSelect from './LiveMentorSelect';

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
 * 라이브의 멘토 계정 연결(mentor_user_id)은 멘토 프로필 후기 집계 기준이다.
 * 운영자는 멘토를 닉네임으로 알고 있어 닉네임·실명 어느 쪽으로도 찾을 수 있어야 한다.
 */
describe('LiveMentorSelect', () => {
  it('이미 연결된 멘토를 닉네임과 실명으로 보여준다', () => {
    render(<LiveMentorSelect value={22} onChange={vi.fn()} />);

    expect(screen.getByRole('combobox')).toHaveValue(
      '렛츠멘토 (김철수) · kim2@letscareer.test',
    );
  });

  it('닉네임으로 검색할 수 있다', async () => {
    render(<LiveMentorSelect onChange={vi.fn()} />);

    await userEvent.type(screen.getByRole('combobox'), '렛츠');

    expect(optionTexts()).toEqual(['렛츠멘토 (김철수) · kim2@letscareer.test']);
  });

  it('실명으로 검색하면 동명이인이 닉네임으로 구분돼 모두 나온다', async () => {
    render(<LiveMentorSelect onChange={vi.fn()} />);

    await userEvent.type(screen.getByRole('combobox'), '김철수');

    expect(optionTexts()).toEqual([
      '커리어코치 (김철수) · kim@letscareer.test',
      '렛츠멘토 (김철수) · kim2@letscareer.test',
    ]);
  });

  it('닉네임이 없는 멘토는 실명만 보여준다', async () => {
    render(<LiveMentorSelect onChange={vi.fn()} />);

    await userEvent.type(screen.getByRole('combobox'), '이영희');

    expect(optionTexts()).toEqual(['이영희 · lee@letscareer.test']);
  });

  it('멘토를 고르면 그 멘토의 유저 id 를 넘긴다', async () => {
    const onChange = vi.fn();
    render(<LiveMentorSelect onChange={onChange} />);

    await userEvent.type(screen.getByRole('combobox'), '렛츠');
    await userEvent.click(screen.getByRole('option'));

    expect(onChange).toHaveBeenCalledWith(22);
  });
});

describe('getLiveIdSchema', () => {
  const base = {
    classificationInfo: [],
    priceInfo: { priceId: 1 },
    faqInfo: [],
  };

  it('라이브 상세 응답의 mentorId 를 버리지 않는다', () => {
    expect(getLiveIdSchema.parse({ ...base, mentorId: 21 }).mentorId).toBe(21);
  });

  it('멘토가 연결되지 않은 라이브는 mentorId 가 null 이다', () => {
    expect(
      getLiveIdSchema.parse({ ...base, mentorId: null }).mentorId,
    ).toBeNull();
  });
});
