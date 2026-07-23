import SeminarLandingPage from '@/domain/seminar/SeminarLandingPage';
import { getCanonicalSiteUrl } from '@/utils/url';
import { Metadata } from 'next';

const SEMINAR_TITLE = '무료 세미나 | 렛츠커리어';
const SEMINAR_DESCRIPTION =
  '매월 2회 이상 진행되는 무료 세미나에서, 내가 원하는 기업·직무 현직자의 실무 이야기와 합격 전략을 직접 들어보세요.';

export function generateMetadata(): Metadata {
  const url = getCanonicalSiteUrl() + '/seminar';

  return {
    title: SEMINAR_TITLE,
    description: SEMINAR_DESCRIPTION,
    openGraph: {
      title: SEMINAR_TITLE,
      description: SEMINAR_DESCRIPTION,
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}

const Page = () => {
  return <SeminarLandingPage />;
};

export default Page;
