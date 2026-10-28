import type { ReactNode } from 'react';

export interface InfoItem {
  label: string;
  /** null 은 `-` 로 보여준다 */
  value: ReactNode;
}

interface InfoListProps {
  items: InfoItem[];
}

/** 이름과 값 두 열 목록 */
const InfoList = ({ items }: InfoListProps) => (
  <dl className="text-xsmall14 grid grid-cols-[160px_1fr] gap-x-4 gap-y-2">
    {items.map(({ label, value }) => (
      <div key={label} className="contents">
        <dt className="text-neutral-40">{label}</dt>
        <dd className="text-neutral-0 min-w-0 break-words">{value ?? '-'}</dd>
      </div>
    ))}
  </dl>
);

export default InfoList;
