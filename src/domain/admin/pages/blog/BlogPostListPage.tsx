'use client';

import BlogTable from '@/domain/admin/blog/BlogTable';
import Link from 'next/link';

export default function BlogPostListPage() {
  return (
    <div className="px-12 pt-12">
      <header className="flex items-center justify-between px-3">
        <h1 className="text-2xl font-semibold">블로그</h1>
        <Link
          href="/admin/blog/create"
          className="rounded-xxs border border-zinc-600 bg-white px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
        >
          등록
        </Link>
      </header>
      <main>
        <BlogTable />
      </main>
    </div>
  );
}
