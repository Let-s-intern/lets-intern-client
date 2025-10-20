'use client';

import React, { useState } from 'react';
import DataTable, {
  experienceTableHeaders,
  sampleExperienceData,
} from './DataTable';

// 사용 예시 컴포넌트
export const DataTableExample: React.FC = () => {
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const handleSelectionChange = (selectedIds: Set<string>) => {
    setSelectedRowIds(selectedIds);
  };

  return (
    <div className="w-full p-6">
      <h2 className="mb-4 text-2xl font-bold">경험 데이터 테이블 예시</h2>

      {/* 기본 테이블 사용 예시 */}
      <DataTable
        headers={experienceTableHeaders}
        data={sampleExperienceData}
        selectedRowIds={selectedRowIds}
        onSelectionChange={handleSelectionChange}
        className="rounded-lg border"
      />

      {/* 커스텀 데이터로 테이블 사용 예시 */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">커스텀 데이터 예시</h3>
        <DataTable
          headers={[
            { key: 'name', label: '이름', width: '100px' },
            { key: 'age', label: '나이', width: '80px', align: 'center' },
            { key: 'email', label: '이메일', width: '200px' },
            { key: 'status', label: '상태', width: '100px', align: 'center' },
          ]}
          data={[
            {
              id: '1',
              name: '김철수',
              age: 25,
              email: 'kim@example.com',
              status: '활성',
            },
            {
              id: '2',
              name: '이영희',
              age: 30,
              email: 'lee@example.com',
              status: '비활성',
            },
            {
              id: '3',
              name: '박민수',
              age: 28,
              email: 'park@example.com',
              status: '활성',
            },
          ]}
          className="rounded-lg border"
        />
      </div>
    </div>
  );
};

export default DataTableExample;
