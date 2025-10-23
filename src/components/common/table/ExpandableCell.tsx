'use client';

import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

/**
 * 테이블 행 확장 가능한 셀 컴포넌트 - 텍스트 오버플로우 감지 및 확장 버튼 표시
 */

interface ExpandableCellProps {
  content: React.ReactNode;
  isRowExpanded: boolean;
  onToggleExpand: () => void;
  align?: 'left' | 'center' | 'right';
}

const ExpandableCell = ({ content, isRowExpanded, onToggleExpand, align = 'left' }: ExpandableCellProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 텍스트가 셀 밖으로 넘치는지 확인
  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const hasOverflow = element.scrollHeight > element.clientHeight;
        setIsOverflowing(hasOverflow);
      }
    };

    checkOverflow();
    // 윈도우 리사이즈 시에도 체크
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [content]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={contentRef}
        className={twMerge(
          'flex items-start px-4 py-3 text-[0.8125rem] font-normal text-gray-900',
          isRowExpanded ? 'h-auto' : 'h-[9.25rem] overflow-hidden',
          align === 'center'
            ? 'text-center'
            : align === 'right'
              ? 'text-right'
              : 'text-left',
        )}
      >
        {content}
      </div>

      {/* 오버플로우가 있고 hover 상태일 때만 화살표 버튼 표시 */}
      {isOverflowing && isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          // TODO: 그림자 스타일 추가
          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-xxs border border-neutral-80 bg-neutral-100"
          aria-label={isRowExpanded ? '축소' : '확장'}
        >
          {isRowExpanded ? (
            <ChevronsDownUp size={16} className="text-neutral-35" />
          ) : (
            <ChevronsUpDown size={16} className="text-neutral-35" />
          )}
        </button>
      )}
    </div>
  );
};

export default ExpandableCell;