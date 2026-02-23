'use client';

import { useState } from 'react';
import { FREQUENT_COMPARISON } from '../../data/constants';

const MobileFrequentComparison = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h4 className="text-medium18 font-semibold text-neutral-0">
          고민되는 챌린지, 비교해보세요
        </h4>
        <p className="text-xsmall13 text-neutral-40">
          많은 분들이 궁금해하는 챌린지 간 차이를 한눈에 확인하세요.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {FREQUENT_COMPARISON.map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={item.title}
              className={`flex w-full flex-col overflow-hidden rounded-lg border-2 transition-all ${
                isExpanded
                  ? 'border-primary bg-white shadow-md'
                  : 'border-neutral-90 bg-white shadow-sm'
              }`}
            >
              {/* 헤더 - 클릭하여 펼치기/접기 */}
              <button
                type="button"
                onClick={() => toggleExpand(index)}
                className="hover:bg-neutral-98 flex w-full items-center justify-between p-4 text-left transition-colors"
              >
                <span className="text-small15 font-bold text-neutral-0">
                  {item.title}
                </span>
                <span
                  className={`text-medium18 font-bold transition-transform ${
                    isExpanded ? 'rotate-180 text-primary' : 'text-neutral-40'
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* 펼쳐진 내용 */}
              {isExpanded && (
                <div className="flex flex-col gap-3 border-t border-neutral-90 p-4">
                  {/* 챌린지 이름 */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
                      <p className="text-xsmall12 break-keep text-center font-bold text-neutral-0">
                        {item.left}
                      </p>
                    </div>
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
                      <p className="text-xsmall12 break-keep text-center font-bold text-neutral-0">
                        {item.right}
                      </p>
                    </div>
                  </div>

                  {/* 비교 항목들 */}
                  <div className="flex flex-col gap-2">
                    {item.rows.map((row) => (
                      <div
                        key={row.label}
                        className="bg-neutral-98 flex flex-col gap-1.5 rounded-md border border-neutral-90 p-3"
                      >
                        <span className="text-xsmall11 font-bold text-neutral-40">
                          {row.label}
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded border border-blue-100 bg-blue-50/30 px-2 py-1.5">
                            <p className="text-xsmall12 break-keep leading-relaxed text-neutral-10">
                              {row.left}
                            </p>
                          </div>
                          <div className="rounded border border-emerald-100 bg-emerald-50/30 px-2 py-1.5">
                            <p className="text-xsmall12 break-keep leading-relaxed text-neutral-10">
                              {row.right}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileFrequentComparison;
