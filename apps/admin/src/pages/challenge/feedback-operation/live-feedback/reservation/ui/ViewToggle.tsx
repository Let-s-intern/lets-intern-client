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
    <div className="bg-neutral-95 inline-flex gap-0.5 rounded-full p-1">
      {views.map((view) => (
        <button
          type="button"
          key={view.id}
          onClick={() => onChange(view.id)}
          className={twMerge(
            'text-xsmall14 rounded-full px-4 py-1.5 font-medium transition',
            value === view.id
              ? 'text-neutral-0 bg-white shadow-sm'
              : 'text-neutral-40 hover:text-neutral-0',
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
