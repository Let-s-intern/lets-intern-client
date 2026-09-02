import { useBlogListQuery } from '@/api/blog/blog';
import { BlogPopupTargetType } from '@/api/blog/blogPopupSchema';
import { blogCategory } from '@/utils/convert';
import {
  Checkbox,
  Chip,
  FormControlLabel,
  MenuItem,
  Pagination,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

/**
 * 서버 `GET /blog` 에는 제목 검색 파라미터가 없다. 그래서 목록을 한 번에 받아 두고
 * 카테고리·제목 필터와 페이지 넘김을 전부 화면에서 처리한다. 페이지마다 다시 받으면
 * 검색이 현재 페이지 안에서만 동작해 다른 페이지의 글을 영영 고를 수 없다.
 */
const BLOG_FETCH_SIZE = 500;
const ROWS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 300;

type BlogOption = {
  id: number;
  title: string;
  category: string;
};

interface BlogTargetSelectorProps {
  targetType: BlogPopupTargetType;
  blogIds: number[];
  onTargetTypeChange: (targetType: BlogPopupTargetType) => void;
  onBlogIdsChange: (blogIds: number[]) => void;
}

/** 타이핑마다 목록 전체를 다시 거르지 않도록 입력을 늦춰 반영한다. */
function useDebouncedValue(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function BlogTargetSelector({
  targetType,
  blogIds,
  onTargetTypeChange,
  onBlogIdsChange,
}: BlogTargetSelectorProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const { data, isLoading } = useBlogListQuery({
    pageable: { page: 1, size: BLOG_FETCH_SIZE },
    enabled: targetType === 'SELECTED',
  });

  const options: BlogOption[] = useMemo(
    () =>
      data?.blogInfos.map(({ blogThumbnailInfo }) => ({
        id: blogThumbnailInfo.id,
        title: blogThumbnailInfo.title ?? '',
        category: blogThumbnailInfo.category ?? '',
      })) ?? [],
    [data],
  );

  const filtered = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();

    return options.filter((option) => {
      if (category && option.category !== category) return false;
      if (keyword && !option.title.toLowerCase().includes(keyword))
        return false;
      return true;
    });
  }, [options, category, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE,
      ),
    [filtered, currentPage],
  );

  const selectedSet = useMemo(() => new Set(blogIds), [blogIds]);

  const selectedOptions = useMemo(
    () =>
      blogIds.map(
        (id) =>
          options.find((option) => option.id === id) ?? {
            id,
            title: `#${id}`,
            category: '',
          },
      ),
    [blogIds, options],
  );

  // 행에 넘기는 콜백이 렌더마다 새로 만들어지면 memo 가 무의미해진다.
  const handleToggle = useCallback(
    (id: number) => {
      const next = blogIds.includes(id)
        ? blogIds.filter((blogId) => blogId !== id)
        : [...blogIds, id].sort((a, b) => a - b);

      onBlogIdsChange(next);
    },
    [blogIds, onBlogIdsChange],
  );

  return (
    <div>
      <RadioGroup
        row
        value={targetType}
        onChange={(e) =>
          onTargetTypeChange(e.target.value as BlogPopupTargetType)
        }
      >
        <FormControlLabel value="ALL" control={<Radio />} label="전체 블로그" />
        <FormControlLabel
          value="SELECTED"
          control={<Radio />}
          label="특정 글 선택"
        />
      </RadioGroup>

      {targetType === 'SELECTED' && (
        <div className="mt-3">
          <div
            className="mb-3 flex flex-wrap gap-1"
            data-testid="selected-blog-chips"
          >
            {selectedOptions.length === 0 ? (
              <span className="text-sm text-neutral-500">
                선택된 글이 없습니다
              </span>
            ) : (
              selectedOptions.map((option) => (
                <Chip
                  key={option.id}
                  label={option.title}
                  onDelete={() => handleToggle(option.id)}
                  size="small"
                />
              ))
            )}
          </div>

          <div className="mb-3 flex gap-3">
            <TextField
              className="w-full"
              select
              size="small"
              label="카테고리"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">전체</MenuItem>
              {Object.entries(blogCategory).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className="w-full"
              size="small"
              label="제목 검색"
              placeholder="제목을 입력하세요"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="rounded border border-neutral-300">
            {isLoading ? (
              <p className="p-3 text-sm text-neutral-500">불러오는 중입니다</p>
            ) : visible.length === 0 ? (
              <p className="p-3 text-sm text-neutral-500">
                조건에 맞는 글이 없습니다
              </p>
            ) : (
              visible.map((option) => (
                <BlogTargetRow
                  key={option.id}
                  id={option.id}
                  title={option.title}
                  category={option.category}
                  checked={selectedSet.has(option.id)}
                  onToggle={handleToggle}
                />
              ))
            )}
          </div>

          <div className="mt-2 flex justify-center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setPage(value)}
              size="small"
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface BlogTargetRowProps {
  id: number;
  title: string;
  category: string;
  checked: boolean;
  onToggle: (id: number) => void;
}

/** 한 글을 체크할 때 나머지 행까지 다시 그리지 않도록 memo 로 감싼다. */
const BlogTargetRow = memo(function BlogTargetRow({
  id,
  title,
  category,
  checked,
  onToggle,
}: BlogTargetRowProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 border-b border-neutral-200 px-2 py-1 last:border-b-0">
      <Checkbox
        size="small"
        checked={checked}
        onChange={() => onToggle(id)}
        inputProps={{ 'aria-label': title }}
      />
      <span className="w-32 shrink-0 text-xs text-neutral-500">
        {blogCategory[category] ?? category}
      </span>
      <span className="text-sm">{title}</span>
    </label>
  );
});
