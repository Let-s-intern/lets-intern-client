import { ShoppingCart } from 'lucide-react';
import { useRef } from 'react';
import type { CompareCombo } from '../data/compare';

interface Props {
  combos: CompareCombo[];
  activeId: string;
  onChange: (id: string) => void;
}

/**
 * 개별 구매 조합 탭 (시안 4.png 상단 알약).
 * 활성 탭만 흰 배경 + 파란 글자, 나머지는 회색이다.
 *
 * 탭 UI 라 role="tablist" 를 쓰되, 표시 패널은 아래 카드 2장이 통째로 하나이므로
 * 패널은 호출부(CompareSection)가 `role="tabpanel"` 로 감싼다.
 * 좌우 화살표로 탭을 옮길 수 있어야 한다(WAI-ARIA tabs 패턴).
 */
export default function CompareTabs({ combos, activeId, onChange }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (index: number, delta: number) => {
    const next = (index + delta + combos.length) % combos.length;
    onChange(combos[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className="cmp-tabs rv" role="tablist" aria-label="개별 구매 조합">
      {combos.map((combo, index) => {
        const isActive = combo.id === activeId;
        return (
          <button
            key={combo.id}
            type="button"
            role="tab"
            id={`cmp-tab-${combo.id}`}
            aria-selected={isActive}
            aria-controls="cmp-panel"
            tabIndex={isActive ? 0 : -1}
            ref={(el) => {
              refs.current[index] = el;
            }}
            className="cmp-tab"
            onClick={() => onChange(combo.id)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                move(index, 1);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                move(index, -1);
              }
            }}
          >
            <ShoppingCart size={18} strokeWidth={2} aria-hidden />
            <span>{combo.label}</span>
          </button>
        );
      })}
    </div>
  );
}
