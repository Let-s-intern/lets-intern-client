'use client';

import { AccessorKeyColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import type { AggregatedLeadRow } from '../types';

const useLeadHistoryColumns = () => {
  return useMemo<AccessorKeyColumnDef<AggregatedLeadRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '이름',
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'min-w-[100px]',
        },
      },
      {
        accessorKey: 'displayPhoneNum',
        header: '전화번호',
        meta: {
          headerClassName: 'min-w-[140px]',
          cellClassName: 'min-w-[140px]',
        },
      },
      {
        accessorKey: 'grade',
        header: '학년',
        meta: {
          headerClassName: 'min-w-[70px]',
          cellClassName: 'min-w-[70px]',
        },
      },
      {
        accessorKey: 'wishField',
        header: '희망 직군',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'min-w-[120px]',
        },
      },
      {
        accessorKey: 'wishJob',
        header: '희망 직무',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'min-w-[120px]',
        },
      },
      {
        accessorKey: 'wishIndustry',
        header: '희망 산업',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'min-w-[120px]',
        },
      },
      {
        accessorKey: 'wishCompany',
        header: '희망 기업',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'min-w-[120px]',
        },
      },
      {
        accessorKey: 'programHistory',
        header: '프로그램 참여 이력',
        meta: {
          headerClassName: 'min-w-[280px]',
          cellClassName: 'min-w-[280px] whitespace-pre-line',
        },
      },
      {
        accessorKey: 'magnetHistory',
        header: '마그넷 신청 이력',
        meta: {
          headerClassName: 'min-w-[280px]',
          cellClassName: 'min-w-[280px] whitespace-pre-line',
        },
      },
      {
        accessorKey: 'marketingAgree',
        header: '마케팅 동의 여부',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ getValue }) => {
          const value = getValue<boolean | null>();
          if (value === true) return '동의';
          if (value === false)
            return <span className="text-gray-400">미동의</span>;
          return '-';
        },
      },
    ],
    [],
  );
};

export default useLeadHistoryColumns;
