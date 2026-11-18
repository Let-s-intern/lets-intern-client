import CategoryLanding from '@/domain/category-landing/CategoryLanding';
import { LANDING_CONTENT } from '@/domain/category-landing/landingContent';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = LANDING_CONTENT[slug];
  const title = content
    ? `${content.heroTitle.replace(/\n/g, ' ')} - 렛츠커리어`
    : '렛츠커리어';
  return {
    title,
    description: content?.heroDescription,
    alternates: { canonical: `/category/${slug}` },
  };
}

/** 취준 여정 카테고리 랜딩 (PRD prd-취준여정-카테고리-랜딩.md 5.3) */
export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CategoryLanding slug={slug} />;
}
