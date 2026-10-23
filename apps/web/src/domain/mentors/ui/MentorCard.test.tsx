import { render, screen } from '@testing-library/react';

import type { MentorListItem } from '@/api/mentor/mentorSchema';

import MentorCard from './MentorCard';

const mentor = (overrides: Partial<MentorListItem> = {}): MentorListItem => ({
  mentorId: 1,
  nickname: '멘토',
  profileImgUrl: null,
  corpImgUrl: null,
  company: '렛츠커리어',
  job: '마케터',
  hashTagList: [],
  challengeList: [],
  ...overrides,
});

describe('MentorCard 렛커 픽 라벨 (LC-3500)', () => {
  it('isPick 이면 「렛커 픽」 라벨을 단다', () => {
    render(<MentorCard mentor={mentor({ isPick: true })} />);
    expect(screen.getByText('렛커 픽')).toBeInTheDocument();
  });

  it.each([false, undefined])('isPick 이 %s 이면 라벨이 없다', (isPick) => {
    render(<MentorCard mentor={mentor({ isPick })} />);
    expect(screen.queryByText('렛커 픽')).not.toBeInTheDocument();
  });
});
