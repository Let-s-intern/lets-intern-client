import ChallengeFeedbackScreen from '@/domain/challenge-feedback/ChallengeFeedbackScreen';
import { getCanonicalSiteUrl } from '@/utils/url';
import { Metadata } from 'next';

const PAGE_TITLE =
  '렛츠커리어 | 현직자 피드백 멘토링 상세 안내';
const PAGE_DESCRIPTION =
  '대기업 · IT 대기업 · 시리즈 B 이상 스타트업 현직자들이 여러분의 서류를 직접 진단합니다. 렛츠커리어 챌린지 피드백 멘토링을 확인하세요.';

export async function generateMetadata(): Promise<Metadata> {
  const url = getCanonicalSiteUrl() + '/challenge/feedback-mentoring';

  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url,
      images: [
        {
          url: 'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/banner/popup/%E1%84%85%E1%85%A6%E1%86%BA%E1%84%8E%E1%85%B3%E1%84%8F%E1%85%A5%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A5%20%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9%20og_image%201200_630.png',
        },
      ],
    },
    alternates: {
      canonical: url,
    },
  };
}

interface PageProps {
  searchParams: Promise<{ challenge?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { challenge } = await searchParams;

  return <ChallengeFeedbackScreen initialChallenge={challenge} />;
};

export default Page;
