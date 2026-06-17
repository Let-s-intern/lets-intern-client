import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const title = '렛츠커리어 스토리';
const description =
  '커리어 성장, 이제 렛츠커리어가 취업준비생과 주니어의 길라잡이가 되겠습니다.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    type: 'website',
    title,
    url: '/about',
    description,
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
};

const AboutLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default AboutLayout;
