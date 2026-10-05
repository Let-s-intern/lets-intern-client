import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getLiveIdSchema } from '@/schema';
import LiveMentorSelect from './LiveMentorSelect';

vi.mock('@/api/mentor/mentor', () => ({
  useAdminUserMentorListQuery: () => ({
    data: {
      mentorList: [
        {
          id: 21,
          name: '김멘토',
          email: 'kim@letscareer.test',
          hashTagList: [],
        },
        {
          id: 22,
          name: '김멘토',
          email: 'kim2@letscareer.test',
          hashTagList: [],
        },
      ],
    },
  }),
}));

/**
 * 라이브의 멘토 계정 연결(mentor_user_id)은 멘토 프로필 후기 집계 기준이다.
 * 표시용 mentorName 과 별개라 어드민에서 직접 고를 수 있어야 한다.
 */
describe('LiveMentorSelect', () => {
  it('이미 연결된 멘토를 선택된 상태로 보여준다', () => {
    render(<LiveMentorSelect value={22} onChange={vi.fn()} />);

    expect(screen.getByRole('combobox')).toHaveTextContent(
      '김멘토 (kim2@letscareer.test)',
    );
  });

  it('멘토를 고르면 그 멘토의 유저 id 를 넘긴다', () => {
    const onChange = vi.fn();
    render(<LiveMentorSelect onChange={onChange} />);

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(
      within(screen.getByRole('listbox')).getByText(
        '김멘토 (kim2@letscareer.test)',
      ),
    );

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
