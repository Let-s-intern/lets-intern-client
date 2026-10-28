import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

import { isValidOneTimeFormSlug } from '@/domain/one-time-form/utils/isValidOneTimeFormSlug';

// /form/[slug] 아래 모든 경로가 API 를 부르기 전에 slug 를 검사한다
const Layout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  if (!isValidOneTimeFormSlug(slug)) notFound();

  return children;
};

export default Layout;
