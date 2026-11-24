import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import TableHead from './TableHead';

vi.mock('../../filter/ResultFilter', () => ({ default: () => null }));
vi.mock('../../filter/StatusFilter', () => ({ default: () => null }));
vi.mock('../table-body/AllChoiceCheckbox', () => ({ default: () => null }));

describe('제출 상세 표 헤더', () => {
  it('옵션 칸 헤더가 옵션명이다', () => {
    render(
      <TableHead
        attendances={[]}
        isCheckedList={[]}
        setIsCheckedList={vi.fn()}
        resultFilter={null}
        setResultFilter={vi.fn()}
        statusFilter={null}
        setStatusFilter={vi.fn()}
      />,
    );

    expect(screen.getByText('옵션명')).toBeInTheDocument();
    expect(screen.queryByText('옵션 코드')).not.toBeInTheDocument();
  });
});
