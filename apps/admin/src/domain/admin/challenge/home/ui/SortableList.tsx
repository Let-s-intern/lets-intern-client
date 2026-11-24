import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';
import { MdDragIndicator } from 'react-icons/md';
import { moveItemById } from '../utils/moveItemById';

interface SortableListProps<T extends { id?: number }> {
  items: T[];
  /** 저장 중에는 true 로 두어 드래그를 막는다 */
  disabled?: boolean;
  /** 놓은 뒤의 새 순서. 순서가 바뀌었을 때만 호출된다 */
  onReorder: (orderedItems: T[]) => void;
  renderItem: (item: T) => ReactNode;
}

const SortableRow = ({
  id,
  disabled,
  children,
}: {
  id: number;
  disabled: boolean;
  children: ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center bg-white ${isDragging ? 'relative z-10 shadow-md' : ''}`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        aria-label="순서 변경"
        disabled={disabled}
        className="rounded mr-1 flex h-8 w-8 shrink-0 cursor-grab touch-none items-center justify-center text-neutral-400 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
        {...attributes}
        {...listeners}
      >
        <MdDragIndicator />
      </button>
      {children}
    </li>
  );
};

const SortableList = <T extends { id?: number }>({
  items,
  disabled = false,
  onReorder,
  renderItem,
}: SortableListProps<T>) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (disabled || !over) return;
    const next = moveItemById(items, Number(active.id), Number(over.id));
    if (next) onReorder(next);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
        disabled={disabled}
      >
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id} disabled={disabled}>
              {renderItem(item)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;
