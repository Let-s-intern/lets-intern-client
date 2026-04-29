'use client';

import { twMerge } from '@/lib/twMerge';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import type { AggregatedLeadRow } from '../types';

const VISIBLE_ROW_LIMIT = 100;

interface LeadHistoryTableProps {
  data: AggregatedLeadRow[];
  columns: ColumnDef<AggregatedLeadRow>[];
  isLoading: boolean;
}

const LeadHistoryTable = ({
  data,
  columns,
  isLoading,
}: LeadHistoryTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const allRows = table.getRowModel().rows;
  const rowsToRender = useMemo(() => {
    return allRows.slice(0, VISIBLE_ROW_LIMIT);
  }, [allRows]);

  const remainingCount = Math.max(allRows.length - VISIBLE_ROW_LIMIT, 0);
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
                <tr key={row.id} className="border-t border-gray-100">
                  {row.getVisibleCells().map((cell, i) => {
                    const cellClassName =
                      cell.column.columnDef.meta?.cellClassName ?? '';
                    return (
                      <td
                        key={cell.id}
                        className={twMerge(
                          'border-b px-3 py-2 align-top text-gray-900',
                          cellClassName,
                          i === 0 && 'z-1 sticky left-0 bg-white',
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
      {!isLoading && remainingCount > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 text-center text-[12px] text-gray-500">
          상위 {VISIBLE_ROW_LIMIT}건만 표시됩니다. 외 {remainingCount}건은 CSV
          다운로드로 확인하세요.
        </div>
      )}
      {!isLoading && remainingCount === 0 && allRows.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 text-center text-[12px] text-gray-500">
          총 {allRows.length}건을 모두 보여주고 있습니다.
        </div>
      )}
    </div>
  );
};

export default LeadHistoryTable;
