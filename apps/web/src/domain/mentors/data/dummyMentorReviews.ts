export interface MentorReview {
  id: string;
  menteeName: string;
  score: number;
  content: string;
  programTitle: string;
  createdAt: string;
}

export const DUMMY_MENTOR_REVIEWS: MentorReview[] = [
  {
    id: '1',
    menteeName: '익명1',
    programTitle: '자기소개서 피드백 REPORT',
    content:
      '리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰 \n 리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰 \n 리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰 \n 리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰',
    score: 5,
    createdAt: '2026-07-20T09:12:00',
  },
  {
    id: '2',
    menteeName: '익명2',
    programTitle: '자기소개서 피드백 REPORT',
    content: '굳',
    score: 5,
    createdAt: '2026-07-18T14:30:00',
  },
  {
    id: '3',
    menteeName: '익명3',
    programTitle: '자기소개서 피드백 REPORT',
    content: '리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰',
    score: 5,
    createdAt: '2026-07-15T11:05:00',
  },
];
