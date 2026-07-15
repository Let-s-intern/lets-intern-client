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
    <div className="border-neutral-80 inline-flex rounded-md border p-0.5">
      {views.map((view) => (
        <button
          type="button"
          key={view.id}
          onClick={() => onChange(view.id)}
          className={twMerge(
            'text-xsmall14 rounded px-3 py-1.5',
            value === view.id
              ? 'bg-neutral-0 text-white'
              : 'text-neutral-40 bg-transparent',
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
