'use client';

import dayjs from '@/lib/dayjs';
import { AccessorKeyColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import type { LeadHistoryRow } from '../types';
import { formatNullableText, renderGroupedLeaf } from '../utils/rowUtils';

const useLeadHistoryColumns = () => {
  return useMemo<AccessorKeyColumnDef<LeadHistoryRow>[]>(
    () => [
      {
        accessorKey: 'displayPhoneNum',
        header: '전화번호',
        enableGrouping: true,
        groupedColumnMode: 'remove',
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'min-w-[200px]',
        },
        cell: ({ row, getValue }) => {
          const value = formatNullableText(getValue());
          if (row.getIsGrouped()) {
            const count = row.subRows?.length ?? 0;
            return (
              <div className="flex items-center gap-2">
                <span>{value}</span>
                <span className="text-xs text-gray-400">({count}건)</span>
              </div>
            );
          }
          return value;
        },
      },
      {
        accessorKey: 'name',
        header: '이름',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'min-w-[120px]',
        },
        aggregationFn: (_, leafRows) => {
          if (leafRows[0].original.displayPhoneNum === '미등록') return '-';
          const names = new Set<string>(
            leafRows
              .map((row) => row.original.name)
              .filter((name): name is string => !!name),
          );
          return Array.from(names).join(', ');
        },
      },
      {
        accessorKey: 'email',
        header: '이메일',
        meta: {
          headerClassName: 'min-w-[220px]',
          cellClassName: 'min-w-[220px]',
        },
      },
      {
        accessorKey: 'marketingAgree',
        header: '마케팅 동의',
        meta: {
          headerClassName: 'min-w-[70px]',
          cellClassName: 'min-w-[70px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) => {
            const value = original.marketingAgree;
            if (value === true) return 'O';
            if (value === false)
              return <span className="text-gray-400">X</span>;
            return '-';
          }),
      },
      {
        accessorKey: 'createDate',
        header: '생성일',
        meta: {
          headerClassName: 'min-w-[170px]',
          cellClassName: 'min-w-[170px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) => {
            const value = original.createDate;
            return value ? dayjs(value).format('YYYY.MM.DD.') : '-';
          }),
      },
      {
        accessorKey: 'eventType',
        header: '이벤트 유형',
        meta: {
          headerClassName: 'min-w-[140px]',
          cellClassName: 'min-w-[140px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) => formatNullableText(o.eventType)),
      },
      {
        accessorKey: 'title',
        header: '이벤트 제목',
        meta: {
          headerClassName: 'min-w-[220px]',
          cellClassName: 'min-w-[220px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) => formatNullableText(o.title)),
      },
      {
        accessorKey: 'magnetId',
        header: '마그넷 ID',
        meta: {
          headerClassName: 'min-w-[140px]',
          cellClassName: 'min-w-[140px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) => formatNullableText(o.magnetId)),
      },
      {
        accessorKey: 'magnetType',
        header: '마그넷 타입',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) => formatNullableText(o.magnetType)),
      },
      {
        accessorKey: 'userId',
        header: '회원 ID',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'min-w-[120px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) => formatNullableText(o.userId)),
      },
      {
        accessorKey: 'inflow',
        header: '유입 경로',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) => formatNullableText(o.inflow)),
      },
      {
        accessorKey: 'university',
        header: '대학',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) => formatNullableText(o.university)),
      },
      {
        accessorKey: 'major',
        header: '전공',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) => formatNullableText(o.major)),
      },
      {
        accessorKey: 'wishField',
        header: '희망 분야',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) => formatNullableText(o.wishField)),
      },
      {
        accessorKey: 'wishCompany',
        header: '희망 회사',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) => formatNullableText(o.wishCompany)),
      },
      {
        accessorKey: 'wishIndustry',
        header: '희망 산업군',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) =>
            formatNullableText(o.wishIndustry),
          ),
      },
      {
        accessorKey: 'wishJob',
        header: '희망 직무',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) => formatNullableText(o.wishJob)),
      },
      {
        accessorKey: 'jobStatus',
        header: '현 직무 상태',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) => formatNullableText(o.jobStatus)),
      },
      {
        accessorKey: 'instagramId',
        header: '인스타그램 ID',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (o) =>
            formatNullableText(o.instagramId),
          ),
      },
      {
        accessorKey: 'finalPrice',
        header: '결제 금액',
        meta: {
          headerClassName: 'min-w-[140px]',
          cellClassName: 'min-w-[140px]',
        },
        cell: (info) => {
          const v = info.getValue<number>()
            ? new Intl.NumberFormat('ko-KR').format(info.getValue<number>())
            : '-';
          if (info.row.getIsGrouped()) return <strong>{v}</strong>;
          return v;
        },
        aggregationFn: 'sum',
      },
    ],
    [],
  );
};

export default useLeadHistoryColumns;
