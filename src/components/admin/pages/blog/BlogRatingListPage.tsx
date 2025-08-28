import BlogRatingTable from '@/components/admin/blog/BlogRatingTable';

export default function BlogRatingListPage() {
  return (
    <div className="px-12 pt-12">
      <header className="flex items-center justify-between px-3">
        <h1 className="text-2xl font-semibold">블로그 후기</h1>
      </header>
      <main>
        <BlogRatingTable />
      </main>
    </div>
  );
}
