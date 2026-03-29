'use client';

import { twMerge } from '@/lib/twMerge';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  GroupingState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type { LeadHistoryRow } from '../types';

const VISIBLE_GROUP_LIMIT = 10;

interface LeadHistoryTableProps {
  data: LeadHistoryRow[];
  columns: ColumnDef<LeadHistoryRow>[];
  isLoading: boolean;
}

const LeadHistoryTable = ({
  data,
  columns,
  isLoading,
}: LeadHistoryTableProps) => {
  const [grouping] = useState<GroupingState>(['displayPhoneNum']);
  const table = useReactTable({
    data,
    columns,
    state: { grouping, expanded: true },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    autoResetExpanded: false,
    getRowId: (row) => row.id,
  });

  const groupedRowModel = table.getGroupedRowModel();
  const totalGroupCount = groupedRowModel.rows.length;
  const displayedGroupCount =
    totalGroupCount === 0
      ? 0
      : Math.min(totalGroupCount, VISIBLE_GROUP_LIMIT);
  const remainingGroupCount = Math.max(
    totalGroupCount - displayedGroupCount,
    0,
  );
  const allRows = table.getRowModel().rows;
  const rowsToRender = useMemo(() => {
    if (!allRows.length) return allRows;
    const result: typeof allRows = [];
    let groupsSeen = 0;

    for (const row of allRows) {
      if (row.depth === 0) {
        groupsSeen += 1;
        if (groupsSeen > VISIBLE_GROUP_LIMIT) break;
      }
      result.push(row);
    }

    return result;
  }, [allRows]);

  const columnCount = table.getAllLeafColumns().length || columns.length || 1;

  return (
    <div className="rounded border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => {
                  if (header.isPlaceholder) {
                    return <th key={header.id} className="px-3 py-2" />;
                  }
                  const headerClassName =
                    header.column.columnDef.meta?.headerClassName ?? '';
                  return (
                    <th
                      key={header.id}
                      className={twMerge(
                        'px-3 py-2 font-medium text-gray-700',
                        headerClassName,
                        i === 0 && 'z-1 sticky left-0 bg-gray-100',
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-3 py-10 text-center text-gray-500"
                >
                  로딩 중...
                </td>
              </tr>
            ) : allRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-3 py-6 text-center text-gray-500"
                >
                  표시할 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              rowsToRender.map((row) => (
                <tr
                  key={row.id}
                  className={twMerge(
                    'border-t border-gray-100',
                    !row.getIsGrouped() && 'bg-slate-50',
                    row.getIsGrouped() && 'font-medium',
                  )}
                >
                  {row.getVisibleCells().map((cell, i) => {
                    const cellClassName =
                      cell.column.columnDef.meta?.cellClassName ?? '';
                    return (
                      <td
                        key={cell.id}
                        className={twMerge(
                          'border-b px-3 py-2 align-top text-gray-900',
                          cellClassName,
                          i === 0 && 'z-1 sticky left-0 bg-slate-50',
                          row.getIsGrouped() && 'bg-white',
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!isLoading && remainingGroupCount > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 text-center text-[12px] text-gray-500">
          상위 {displayedGroupCount}개 전화번호 그룹만 표시됩니다. 외{' '}
          {remainingGroupCount}개는 CSV 다운로드로 확인하세요.
        </div>
      )}
      {!isLoading && remainingGroupCount === 0 && totalGroupCount > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 text-center text-[12px] text-gray-500">
          전화번호 그룹 {totalGroupCount}개를 모두 보여주고 있습니다.
        </div>
      )}
    </div>
  );
};

export default LeadHistoryTable;
