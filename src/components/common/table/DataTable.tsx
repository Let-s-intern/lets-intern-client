'use client';

import { twMerge } from '@/lib/twMerge';
import ExpandableCell from '@components/common/table/ExpandableCell';
import CheckBox from '@components/common/ui/CheckBox';
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
          <tr className="border-b border-neutral-80 bg-neutral-95">
            {selectedRowIds && (
              <th className="sticky left-0 z-10 w-10 bg-neutral-95 p-2">
                <CheckBox
                  checked={selectedRowIds.size === data.length}
                  onClick={toggleAllSelection}
                />
              </th>
            )}
            {headers.map((header) => (
              <th
                key={header.key}
                className={twMerge(
                  'px-2 py-2.5 text-left text-sm font-medium text-neutral-10',
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
              <tr
                key={row.id}
                className="group border-b border-neutral-80 hover:bg-neutral-95"
              >
                {selectedRowIds && (
                  <td className="sticky left-0 z-10 w-10 bg-white p-2 group-hover:bg-neutral-95">
                    <CheckBox
                      checked={!!isSelected}
                      onClick={() => toggleRowSelection(row.id)}
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

