import { twMerge } from '@/lib/twMerge';

const PlanBenefits = ({
  description,
  isBasic,
  showBasicIncluded,
}: {
  description: string;
  isBasic: boolean;
  showBasicIncluded?: boolean;
}) => {
  const lines = description
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const displayLine = (line: string) =>
    !isBasic && line.startsWith('✓') ? line.slice(1).trimStart() : line;

  return (
    <ul className="text-xsmall16 mt-3 space-y-1.5 text-left text-[#606060]">
      {lines.map((line) => (
        <li key={line} className="flex items-start gap-1.5">
          <span className={twMerge('md:text-xsmall16 text-[#606060]')}>
            {isBasic ? '' : '+'}
          </span>
          <span className="whitespace-pre-line">{displayLine(line)}</span>
        </li>
      ))}
      {!isBasic && showBasicIncluded !== false && (
        <li className="flex items-start gap-1.5">
          <span className="md:text-xsmall16 text-[#606060]">✓</span>
          <span className="whitespace-pre-line">
            베이직에서 제공되는 모든 사항 포함
          </span>
        </li>
      )}
    </ul>
  );
};

export default PlanBenefits;
