'use client';

import ExpandableCell from '@/common/table/ExpandableCell';
import CheckBox from '@/common/ui/CheckBox';
import { twMerge } from '@/lib/twMerge';
import { ReactNode, useMemo, useState } from 'react';

export interface TableHeader {
  key: string;
  label: string;
  width?: string;
  align?: {
    horizontal?: 'left' | 'center' | 'right';
    vertical?: 'top' | 'middle' | 'bottom';
  };
  cellRenderers?: (value: any, row: TableData) => ReactNode;
}

export interface TableData {
  id: number;
  [key: string]: any;
}

export interface DataTableProps {
  headers: TableHeader[];
  data: TableData[];
  selectedRowIds?: Set<number>;
  onSelectionChange?: (selectedIds: Set<number>) => void;
  onRowClick?: (row: TableData) => void;
  getRowHeight?: (row: TableData) => string;
  className?: string;
}

const DataTable = ({
  headers,
  data,
  selectedRowIds,
  onSelectionChange,
  onRowClick,
  getRowHeight,
  className = '',
}: DataTableProps) => {
  // 확장된 행의 ID를 관리
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // 특정 행의 확장 상태를 토글
  const toggleExpandRow = (id: number) => {
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
  const toggleRowSelection = (id: number, isDisabled?: boolean) => {
    if (!selectedRowIds || !onSelectionChange || isDisabled) return;

    const newSet = new Set(selectedRowIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    onSelectionChange(newSet);
  };

  const allRowIds = useMemo(() => data.map((row) => row.id), [data]);

  // 현재 페이지의 모든 항목이 선택되어 있는지 확인
  const allCurrentPageSelected = useMemo(() => {
    if (!selectedRowIds || allRowIds.length === 0) return false;
    return allRowIds.every((id) => selectedRowIds.has(id));
  }, [selectedRowIds, allRowIds]);

  // 모든 행의 체크박스 토글
  const toggleAllSelection = () => {
    if (!selectedRowIds || !onSelectionChange) return;

    const newSet = new Set(selectedRowIds);

    if (allCurrentPageSelected) {
      // 현재 페이지의 모든 항목이 선택되어 있으면 현재 페이지 항목만 제거
      allRowIds.forEach((id) => newSet.delete(id));
    } else {
      // 현재 페이지의 모든 항목이 선택되어 있지 않으면 현재 페이지 항목을 모두 추가
      allRowIds.forEach((id) => newSet.add(id));
    }

    onSelectionChange(newSet);
  };

  // AI 조언 기능 테스트: 이 컴포넌트 변경이 다른 파일에 미치는 영향 확인
  return (
    <div className={twMerge('overflow-x-auto', className)}>
      <table className="w-full min-w-max table-fixed border-collapse">
        {/* 테이블 헤더 */}
        <thead>
          <tr className="border-b border-neutral-80 bg-neutral-95">
            {selectedRowIds && (
              <th className="sticky left-0 z-10 w-10 bg-neutral-95 p-2">
                <CheckBox
                  checked={allCurrentPageSelected}
                  onClick={toggleAllSelection}
                />
              </th>
            )}
            {headers.map((header) => (
              <th
                key={header.key}
                className={twMerge(
                  'px-2 py-2.5 text-left text-sm font-medium text-neutral-10',
                  header.align?.horizontal === 'center'
                    ? 'text-center'
                    : header.align?.horizontal === 'right'
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
            const rowHeight = getRowHeight?.(row);
            const isDisabled = row.isDisabled === true;

            return (
              <tr
                key={row.id}
                className={twMerge(
                  'group border-b border-neutral-80 hover:bg-neutral-95',
                  onRowClick && 'cursor-pointer',
                )}
                onClick={() => onRowClick?.(row)}
              >
                {selectedRowIds && (
                  <td
                    className="sticky left-0 z-10 w-10 content-start bg-white p-2 group-hover:bg-neutral-95"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CheckBox
                      checked={!!isSelected}
                      onClick={() => toggleRowSelection(row.id, isDisabled)}
                      disabled={isDisabled}
                    />
                  </td>
                )}
                {headers.map((header) => {
                  // cellRenderer가 있는 경우 해당 컨텐츠 사용
                  const cellContent = header.cellRenderer
                    ? header.cellRenderer(row[header.key], row)
                    : row[header.key];

                  return (
                    <td
                      key={header.key}
                      className={
                        header.align?.vertical === 'top'
                          ? 'align-top'
                          : header.align?.vertical === 'middle'
                            ? 'align-middle'
                            : header.align?.vertical === 'bottom'
                              ? 'align-bottom'
                              : 'align-top'
                      }
                      onClick={(e) => {
                        if (header.key === 'deleteAction') {
                          e.stopPropagation();
                        }
                      }}
                    >
                      <ExpandableCell
                        content={cellContent}
                        isRowExpanded={isExpanded}
                        onToggleExpand={() => toggleExpandRow(row.id)}
                        align={header.align?.horizontal}
                        height={rowHeight}
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
