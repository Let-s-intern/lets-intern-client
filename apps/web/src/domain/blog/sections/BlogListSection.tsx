'use client';

import { blogTypeSchema } from '@/api/blog/blog';
import { blogCategory } from '@/utils/convert';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import FilterDropdown from '../../../common/dropdown/FilterDropdown';
import { BlogGridSection } from './BlogGridSection';

const filterList = Object.entries(blogCategory).map(([key, value]) => ({
  caption: value,
  value: key,
}));

export function BlogListSection() {
  const params = useSearchParams();
  const typeRaw = params.get('type');
  const types = typeRaw
    ? typeRaw.split(',').map((name) => blogTypeSchema.parse(name.toUpperCase()))
    : null;

  const [page, setPage] = useState(1);

  return (
    <>
      <section className="mb-6 flex flex-col gap-6 md:mb-8 md:flex-row md:items-center md:justify-between md:gap-0">
        <h2 className="text-small20 font-semibold">블로그 콘텐츠</h2>
        <FilterDropdown
          label="콘텐츠 카테고리"
          list={filterList}
          paramKey="type"
          multiSelect
          onChange={() => {
            setPage(1);
          }}
          dropdownClassName="max-w-fit right-0"
        />
      </section>

      <BlogGridSection
        types={types}
        page={page}
        onChangePage={(page) => {
          setPage(page);
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }}
      />
    </>
  );
}
