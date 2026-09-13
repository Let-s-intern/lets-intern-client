import type { ChallengeVersion } from '../utils/challengeVersion';

interface VersionSelectSectionProps {
  versionList: ChallengeVersion[];
  selectedVersionId: number | null;
  onSelect: (challengeVersionId: number) => void;
}

/**
 * 신청 입력의 챌린지 버전 선택 (LC-3247).
 * 노출 여부는 페이지가 isVersionSelectRequired 로 정한다.
 */
const VersionSelectSection = ({
  versionList,
  selectedVersionId,
  onSelect,
}: VersionSelectSectionProps) => {
  return (
    <div className="mx-5 mb-10 flex flex-col gap-y-6">
      <div className="text-neutral-0 font-semibold">버전 선택</div>
      <div
        role="radiogroup"
        aria-label="버전 선택"
        className="flex flex-col gap-y-3"
      >
        {versionList.map(({ challengeVersionId, title }) => {
          const isSelected = challengeVersionId === selectedVersionId;

          return (
            <label
              key={challengeVersionId}
              className={`flex cursor-pointer items-center rounded-md border px-4 py-3 ${isSelected ? 'border-primary bg-primary-5' : 'border-neutral-85'}`}
            >
              <input
                type="radio"
                name="challengeVersion"
                value={challengeVersionId}
                checked={isSelected}
                onChange={() => onSelect(challengeVersionId)}
                className="sr-only"
              />
              <span className="text-xsmall16 font-semibold">{title}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default VersionSelectSection;
