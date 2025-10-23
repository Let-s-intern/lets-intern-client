'use client';

import { twMerge } from '@/lib/twMerge';
import ExpandableCell from '@components/common/table/ExpandableCell';
import { ReactNode, useMemo, useState } from 'react';

export interface TableHeader {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  cellRenderer?: (value: any, row: TableData) => ReactNode;
}

export interface TableData {
  id: string;
  [key: string]: any;
}

export interface DataTableProps {
  headers: TableHeader[];
  data: TableData[];
  selectedRowIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  className?: string;
}

const DataTable = ({
  headers,
  data,
  selectedRowIds,
  onSelectionChange,
  className = '',
}: DataTableProps) => {
  // 확장된 행의 ID를 관리
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // 특정 행의 확장 상태를 토글
  const toggleExpandRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // 특정 행의 체크박스 토글
  const toggleRowSelection = (id: string) => {
    if (!selectedRowIds || !onSelectionChange) return;

    const newSet = new Set(selectedRowIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    onSelectionChange(newSet);
  };

  const allRowIds = useMemo(() => data.map((row) => row.id), [data]);

  // 모든 행의 체크박스 토글
  const toggleAllSelection = () => {
    if (!selectedRowIds || !onSelectionChange) return;

    let newSet: Set<string>;
    if (selectedRowIds.size === data.length) newSet = new Set();
    else newSet = new Set(allRowIds);
    onSelectionChange(newSet);
  };

  return (
    <div className={twMerge('overflow-x-auto', className)}>
      <table className="w-full min-w-max border-collapse">
        {/* 테이블 헤더 */}
        <thead>
          <tr className="border-b bg-gray-50">
            {/* TODO: 가로스크롤해도 체크박스는 고정되게 하기 */}
            {selectedRowIds && (
              <th className="w-10 px-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedRowIds.size === data.length}
                  onChange={toggleAllSelection}
                  className="cursor-pointer"
                />
              </th>
            )}
            {headers.map((header) => (
              <th
                key={header.key}
                className={twMerge(
                  'px-4 py-3 text-left text-sm font-medium text-gray-700',
                  header.align === 'center'
                    ? 'text-center'
                    : header.align === 'right'
                      ? 'text-right'
                      : 'text-left',
                )}
                style={{ width: header.width }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* 테이블 바디 */}
        <tbody>
          {data.map((row) => {
            const isSelected = selectedRowIds?.has(row.id);
            const isExpanded = expandedRows.has(row.id);

            return (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {selectedRowIds && (
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRowSelection(row.id)}
                      className="cursor-pointer"
                    />
                  </td>
                )}
                {headers.map((header) => {
                  // cellRenderer가 있는 경우 해당 컨텐츠 사용
                  const cellContent = header.cellRenderer
                    ? header.cellRenderer(row[header.key], row)
                    : row[header.key];

                  return (
                    <td key={header.key} className="align-top">
                      <ExpandableCell
                        content={cellContent}
                        isRowExpanded={isExpanded}
                        onToggleExpand={() => toggleExpandRow(row.id)}
                        align={header.align}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

