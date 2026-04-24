import { XIcon } from 'lucide-react';
import { Badge } from './Badge';

interface CompetencyBadgesProps {
  coreCompetency: string;
  onRemove: (index: number) => void;
}

export const CompetencyBadges = ({
  coreCompetency,
  onRemove,
}: CompetencyBadgesProps) => {
  if (coreCompetency.trim() === '') {
    return null;
  }

  const competencies = coreCompetency
    .split(',')
    .filter((item) => item.trim() !== '');

  if (competencies.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {competencies.map((competency: string, index: number) => (
        <Badge key={index} className="flex items-center gap-1">
          <span>{competency.trim()}</span>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="ml-1 text-neutral-40 hover:text-neutral-0"
            aria-label={`${competency.trim()} 삭제`}
          >
            <XIcon size={14} />
          </button>
        </Badge>
      ))}
    </div>
  );
};
