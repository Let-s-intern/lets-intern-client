'use client';

import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * 테이블 행 확장 가능한 셀 컴포넌트 - 텍스트 오버플로우 감지 및 확장 버튼 표시
 */

interface ExpandableCellProps {
  content: React.ReactNode;
  isRowExpanded: boolean;
  onToggleExpand: () => void;
  align?: 'left' | 'center' | 'right';
  height?: string;
}

const ExpandableCell = ({
  content,
  isRowExpanded,
  onToggleExpand,
  align = 'left',
  height = '66px',
}: ExpandableCellProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 여부 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={contentRef}
        className={twMerge(
          'w-full whitespace-normal break-words p-2 text-[0.8125rem] font-normal text-neutral-30',
          align === 'center'
            ? 'text-center'
            : align === 'right'
              ? 'text-right'
              : 'text-left',
        )}
        style={{
          height: isRowExpanded ? 'auto' : height,
          overflow: isRowExpanded ? 'visible' : 'hidden',
        }}
      >
        {content}
      </div>

      {/* 모바일: 오버플로우가 있으면 항상 표시, 데스크톱: hover 시에만 표시 */}
      {isOverflowing && (isMobile || isHovered) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-xxs border border-neutral-80 bg-neutral-100 shadow-03"
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
