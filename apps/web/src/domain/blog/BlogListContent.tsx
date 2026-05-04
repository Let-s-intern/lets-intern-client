'use client';

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import { BlogListSection } from './sections/BlogListSection';

export default function BlogListContent() {
  return (
    <AsyncBoundary>
      <BlogListSection />
    </AsyncBoundary>
  );
}
