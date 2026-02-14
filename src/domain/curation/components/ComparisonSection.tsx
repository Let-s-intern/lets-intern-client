'use client';

import { useState } from 'react';
import {
  CHALLENGE_COMPARISON,
  FREQUENT_COMPARISON,
  PROGRAMS,
} from '../constants';

const ComparisonSection = () => {
  const challenges = CHALLENGE_COMPARISON;
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (rowKey: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  // 속성별로 데이터 추출
  const rows = [
    { label: '추천 대상', key: 'target' as const },
    { label: '기간', key: 'duration' as const },
    { label: '플랜별 가격\n(환급금 기준)', key: 'pricing' as const },
    { label: '피드백 횟수', key: 'feedback' as const },
    { label: '결과물', key: 'deliverable' as const, collapsible: true },
    {
      label: '커리큘럼',
      key: 'curriculum' as const,
      collapsible: true,
      defaultHidden: true,
    },
    {
      label: '주요 특징',
      key: 'features' as const,
      collapsible: true,
      defaultHidden: true,
    },
  ];

  return (
    <section className="flex w-full flex-col gap-8" id="curation-comparison">
      <div className="flex flex-col gap-2">
        <h3 className="text-medium22 font-bold text-neutral-0">
          챌린지별 비교 표
        </h3>
        <p className="text-xsmall15 text-neutral-40">
          가격, 기간, 피드백, 주요 결과물을 한눈에 비교하세요.
        </p>
      </div>

      {/* Desktop View - Transposed Table */}
      <div className="hidden overflow-x-auto lg:block">
        <div className="min-w-full overflow-hidden rounded-lg border-2 border-neutral-90 bg-white shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="text-xsmall13 sticky left-0 z-10 w-[100px] min-w-[100px] border-r-2 border-neutral-90 bg-blue-50 px-3 py-3 text-left font-black text-neutral-0 shadow-[2px_0_10px_rgba(0,0,0,0.08)]">
                  구분
                </th>
                {challenges.map((challenge) => {
                  const program = PROGRAMS[challenge.programId];
                  return (
                    <th
                      key={challenge.programId}
                      className="w-[155px] min-w-[155px] border-l border-neutral-90 px-2 py-2.5 text-center"
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-xsmall13 break-keep font-black leading-tight text-neutral-0">
                          {program.title}
                        </span>
                        <span className="text-xsmall11 break-keep font-medium leading-snug text-neutral-40">
                          {program.subtitle}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const isCollapsible = row.collapsible;
                const isDefaultHidden = row.defaultHidden;
                const isExpanded = expandedRows[row.key];

                if (isDefaultHidden && !isExpanded) {
                  return (
                    <tr key={row.label}>
                      <td
                        colSpan={challenges.length + 1}
                        className="border-t border-neutral-90 px-3 py-2 text-center"
                      >
                        <button
                          onClick={() => toggleRow(row.key)}
                          className="text-xsmall12 mx-auto flex items-center gap-1 font-semibold text-primary-dark transition-colors hover:text-primary"
                          type="button"
                        >
                          <span>+</span>
                          <span>{row.label} 보기</span>
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={row.label}
                    className={`transition-all hover:bg-primary-5 ${idx % 2 === 0 ? 'bg-white' : 'from-neutral-98 bg-gradient-to-r to-white'}`}
                  >
                    <td
                      className={`text-xsmall12 sticky left-0 z-10 whitespace-pre-line border-r-2 border-neutral-90 px-3 py-2.5 font-bold text-neutral-0 ${idx % 2 === 0 ? 'bg-white' : 'from-neutral-98 bg-gradient-to-r to-white'} shadow-[2px_0_8px_rgba(0,0,0,0.05)] transition-all hover:bg-primary-5`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{row.label}</span>
                        {isCollapsible && (
                          <button
                            onClick={() => toggleRow(row.key)}
                            className="text-xsmall11 font-bold text-primary-dark transition-colors hover:text-primary"
                            type="button"
                          >
                            {isExpanded ? '−' : '+'}
                          </button>
                        )}
                      </div>
                    </td>
                    {challenges.map((challenge) => {
                      const value = challenge[row.key];
                      const displayValue = value || '-';

                      // 결과물 필드는 (본인) 부분만 기본 표시
                      let contentToShow = displayValue;
                      if (
                        row.key === 'deliverable' &&
                        !isExpanded &&
                        displayValue !== '-'
                      ) {
                        const parts = displayValue.split('\n\n');
                        contentToShow = parts[0]; // (본인) 부분만
                      }

                      return (
                        <td
                          key={`${challenge.programId}-${row.key}`}
                          className="border-l border-neutral-90 px-2 py-2.5 text-center align-middle"
                        >
                          <div
                            className={`text-xsmall11 whitespace-pre-line break-keep font-medium leading-relaxed text-neutral-20 ${
                              isCollapsible &&
                              !isExpanded &&
                              row.key !== 'deliverable'
                                ? 'line-clamp-2'
                                : ''
                            }`}
                          >
                            {contentToShow}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="flex flex-col gap-4 lg:hidden">
        {challenges.map((challenge) => {
          const program = PROGRAMS[challenge.programId];
          return (
            <div
              key={challenge.programId}
              className="to-neutral-98 flex flex-col gap-2.5 rounded-lg border-2 border-neutral-90 bg-gradient-to-br from-white p-4 shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-col gap-1 border-b-2 border-neutral-90 pb-2.5">
                <span className="text-small16 font-black text-neutral-0">
                  {program.title}
                </span>
                <span className="text-xsmall12 font-medium text-neutral-40">
                  {program.subtitle}
                </span>
              </div>
              {rows.map((row) => {
                const value = challenge[row.key];
                const displayValue = value || '-';
                const isCollapsible = row.collapsible;
                const isDefaultHidden = row.defaultHidden;
                const rowKey = `mobile-${row.key}`;
                const isExpanded = expandedRows[rowKey];

                if (isDefaultHidden && !isExpanded) {
                  return (
                    <div key={row.key} className="flex justify-center py-1">
                      <button
                        onClick={() => toggleRow(rowKey)}
                        className="text-xsmall11 flex items-center gap-1 font-semibold text-primary-dark transition-colors hover:text-primary"
                        type="button"
                      >
                        <span>+</span>
                        <span>{row.label} 보기</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={row.key} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xsmall12 whitespace-pre-line font-bold text-neutral-40">
                        {row.label}
                      </span>
                      {isCollapsible && (
                        <button
                          onClick={() => toggleRow(rowKey)}
                          className="text-xsmall11 font-bold text-primary-dark transition-colors hover:text-primary"
                          type="button"
                        >
                          {isExpanded ? '−' : '+'}
                        </button>
                      )}
                    </div>
                    <span
                      className={`text-xsmall12 whitespace-pre-line font-medium leading-relaxed text-neutral-10 ${
                        isCollapsible &&
                        !isExpanded &&
                        row.key !== 'deliverable'
                          ? 'line-clamp-2'
                          : ''
                      }`}
                    >
                      {row.key === 'deliverable' &&
                      !isExpanded &&
                      displayValue !== '-'
                        ? displayValue.split('\n\n')[0]
                        : displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-small18 font-semibold text-neutral-0">
          빈출질문 챌린지 2:2 비교
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FREQUENT_COMPARISON.map((item) => (
            <div
              key={item.title}
              className="flex h-full flex-col gap-3 rounded-lg border border-neutral-90 bg-white p-4 shadow-sm"
            >
              <div className="text-small16 font-semibold text-neutral-0">
                {item.title}
              </div>
              <div className="text-xsmall13 grid grid-cols-2 gap-2 font-semibold text-neutral-40">
                <span>{item.left}</span>
                <span className="text-right">{item.right}</span>
              </div>
              <div className="flex flex-col gap-2 text-xsmall14 text-neutral-30">
                {item.rows.map((row) => (
                  <div
                    key={`${item.title}-${row.label}`}
                    className="bg-neutral-96 rounded-lg p-3"
                  >
                    <p className="text-xsmall12 font-semibold text-neutral-50">
                      {row.label}
                    </p>
                    <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                      <p>{row.left}</p>
                      <p className="md:text-right">{row.right}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
