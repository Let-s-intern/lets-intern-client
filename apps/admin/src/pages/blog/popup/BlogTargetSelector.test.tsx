import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { BlogPopupTargetType } from '@/api/blog/blogPopupSchema';
import BlogTargetSelector from './BlogTargetSelector';

const blogInfos = [
  { id: 1, title: '면접 준비 체크리스트', category: 'JOB_PREPARATION_TIPS' },
  { id: 2, title: '자소서 첨삭 후기', category: 'PROGRAM_REVIEWS' },
  { id: 3, title: '면접 복장 가이드', category: 'JOB_PREPARATION_TIPS' },
].map((blogThumbnailInfo) => ({ blogThumbnailInfo, tagDetailInfos: [] }));

vi.mock('@/api/blog/blog', () => ({
  useBlogListQuery: () => ({ data: { blogInfos }, isLoading: false }),
}));

/** 선택 상태는 부모가 들고 있다. 실제 폼과 같은 구조로 감싸 토글 결과를 본다. */
function Harness({
  initialTargetType = 'SELECTED' as BlogPopupTargetType,
  initialBlogIds = [] as number[],
}) {
  const [targetType, setTargetType] =
    useState<BlogPopupTargetType>(initialTargetType);
  const [blogIds, setBlogIds] = useState<number[]>(initialBlogIds);

  return (
    <>
      <BlogTargetSelector
        targetType={targetType}
        blogIds={blogIds}
        onTargetTypeChange={setTargetType}
        onBlogIdsChange={setBlogIds}
      />
      <output data-testid="blog-ids">{blogIds.join(',')}</output>
    </>
  );
}

const chips = () => within(screen.getByTestId('selected-blog-chips'));
const selectedIds = () => screen.getByTestId('blog-ids').textContent;

describe('BlogTargetSelector', () => {
  it('전체 블로그를 고르면 글 선택 UI 가 열리지 않는다', () => {
    render(<Harness initialTargetType="ALL" />);

    expect(
      screen.queryByRole('checkbox', { name: '면접 준비 체크리스트' }),
    ).not.toBeInTheDocument();
  });

  it('특정 글 선택으로 바꾸면 글 목록이 열린다', async () => {
    const user = userEvent.setup();
    render(<Harness initialTargetType="ALL" />);

    await user.click(screen.getByRole('radio', { name: '특정 글 선택' }));

    expect(
      screen.getByRole('checkbox', { name: '면접 준비 체크리스트' }),
    ).toBeInTheDocument();
  });

  it('글을 여러 개 선택하면 id 가 오름차순으로 쌓인다', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(
      screen.getByRole('checkbox', { name: '면접 복장 가이드' }),
    );
    await user.click(
      screen.getByRole('checkbox', { name: '면접 준비 체크리스트' }),
    );

    expect(selectedIds()).toBe('1,3');
  });

  it('선택한 글이 칩으로 남는다', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(
      screen.getByRole('checkbox', { name: '자소서 첨삭 후기' }),
    );

    expect(chips().getByText('자소서 첨삭 후기')).toBeInTheDocument();
  });

  it('칩을 개별 해제하면 그 글만 빠진다', async () => {
    const user = userEvent.setup();
    render(<Harness initialBlogIds={[1, 2]} />);

    const chip = chips()
      .getByText('면접 준비 체크리스트')
      .closest('.MuiChip-root')!;
    await user.click(within(chip as HTMLElement).getByTestId('CancelIcon'));

    expect(selectedIds()).toBe('2');
  });

  it('제목 검색은 debounce 뒤에 목록을 좁힌다', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.type(screen.getByLabelText('제목 검색'), '면접');

    await waitFor(() => {
      expect(
        screen.queryByRole('checkbox', { name: '자소서 첨삭 후기' }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole('checkbox', { name: '면접 준비 체크리스트' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: '면접 복장 가이드' }),
    ).toBeInTheDocument();
  });

  it('검색으로 목록에서 사라져도 선택은 유지된다', async () => {
    const user = userEvent.setup();
    render(<Harness initialBlogIds={[2]} />);

    await user.type(screen.getByLabelText('제목 검색'), '면접');

    await waitFor(() => {
      expect(
        screen.queryByRole('checkbox', { name: '자소서 첨삭 후기' }),
      ).not.toBeInTheDocument();
    });
    expect(chips().getByText('자소서 첨삭 후기')).toBeInTheDocument();
  });
});
