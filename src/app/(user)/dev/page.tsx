import { GetReview } from '@/api/review';
import ReviewCard from '@components/ReviewCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

const mock1: GetReview = {
  reviewInfo: {
    reviewId: 1,
    type: 'MISSION_REVIEW',
    programTitle: '기필코 챌린지',
    badPoint: 'Bad Point',
    challengeType: 'DOCUMENT_PREPARATION',
    createDate: '2021-09-01',
    goodPoint: 'Good Point',
    missionTh: 1,
    missionTitle:
      '미션명 미션명 미션명 미션명 미션명 미션명 미션명 미션명미션명',
    name: '임호정',
    programThumbnail: 'https://placehold.co/600x400',
    wishCompany: 'PM',
    wishJob: 'IT',
  },
  reviewItemList: [
    {
      reviewItemId: 1,
      answer:
        '진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 내인생에 이런 챌린지는 없다 내인생에 이런 챌린지는 없다',
      questionType: 'WORRY',
    },
  ],
};

const mock2: GetReview = {
  reviewInfo: {
    reviewId: 1,
    type: 'CHALLENGE_REVIEW',
    programTitle: '기필코 챌린지',
    badPoint: 'Bad Point',
    challengeType: 'DOCUMENT_PREPARATION',
    createDate: '2021-09-01',
    goodPoint: 'Good Point',
    missionTh: 1,
    missionTitle:
      '미션명 미션명 미션명 미션명 미션명 미션명 미션명 미션명미션명',
    name: '임호정',
    programThumbnail: 'https://placehold.co/600x400',
    wishCompany: 'PM',
    wishJob: 'IT',
  },
  reviewItemList: [
    {
      reviewItemId: 1,
      answer:
        '진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 내인생에 이런 챌린지는 없다 내인생에 이런 챌린지는 없다',
      questionType: 'WORRY',
    },
  ],
};

const mock3: GetReview = {
  reviewInfo: {
    reviewId: 1,
    type: 'LIVE_REVIEW',
    programTitle:
      '기필코 챌린지 aksd fasdf kalsdfk lsf akldf asldf jaksldfj laksd fk',
    badPoint: 'Bad Point',
    challengeType: 'DOCUMENT_PREPARATION',
    createDate: '2021-09-01',
    goodPoint: 'Good Point',
    missionTh: 1,
    missionTitle:
      '미션명 미션명 미션명 미션명 미션명 미션명 미션명 미션명미션명',
    name: '임호정',
    programThumbnail: 'https://placehold.co/600x400',
    wishCompany: 'PM',
    wishJob: 'IT',
  },
  reviewItemList: [
    {
      reviewItemId: 1,
      answer:
        '진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 내인생에 이런 챌린지는 없다 내인생에 이런 챌린지는 없다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 내인생에 이런 챌린지는 없다 내인생에 이런 챌린지는 없다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 내인생에 이런 챌린지는 없다 내인생에 이런 챌린지는 없다',
      questionType: 'WORRY',
    },
  ],
};

const mock4: GetReview = {
  reviewInfo: {
    reviewId: 1,
    type: 'REPORT_REVIEW',
    programTitle: '기필코 챌린지',
    badPoint: 'Bad Point',
    challengeType: 'DOCUMENT_PREPARATION',
    createDate: '2021-09-01',
    goodPoint: 'Good Point',
    missionTh: 1,
    missionTitle:
      '미션명 미션명 미션명 미션명 미션명 미션명 미션명 미션명미션명',
    name: '임호정',
    programThumbnail: 'https://placehold.co/600x400',
    wishCompany: 'IT',
    wishJob: 'PM',
  },
  reviewItemList: [
    {
      reviewItemId: 1,
      answer:
        '진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛',
      questionType: 'WORRY',
    },
  ],
};

const Page = () => {
  return (
    <div className="max-w-[844px] mx-auto my-20">
      <div className="grid grid-cols-3 gap-5">
        <ReviewCard review={mock1} missionTitleClamp={1} />
        {/* <ReviewCard review={mock2} missionTitleClamp={1} /> */}
        <ReviewCard expandable review={mock3} missionTitleClamp={1} />
        <ReviewCard expandable review={mock4} missionTitleClamp={1} />
      </div>
      <div>
        <ReviewCard
          expandable
          review={mock4}
          missionTitleClamp={1}
          reviewItemLineClamp={2}
          showThumbnail
        />
      </div>
    </div>
  );
};

export default Page;
