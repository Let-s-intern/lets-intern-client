import { twMerge } from '@/lib/twMerge';

export type ReservationView = 'list' | 'calendar';

const views: { id: ReservationView; label: string }[] = [
  { id: 'list', label: '리스트 뷰' },
  { id: 'calendar', label: '캘린더 뷰' },
];

interface ViewToggleProps {
  value: ReservationView;
  onChange: (view: ReservationView) => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex gap-0.5 rounded-full bg-neutral-95 p-1">
      {views.map((view) => (
        <button
          type="button"
          key={view.id}
          onClick={() => onChange(view.id)}
          className={twMerge(
            'rounded-full px-4 py-1.5 text-xsmall14 font-medium transition',
            value === view.id
              ? 'bg-white text-neutral-0 shadow-sm'
              : 'text-neutral-40 hover:text-neutral-0',
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
