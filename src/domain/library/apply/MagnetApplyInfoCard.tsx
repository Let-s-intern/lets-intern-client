import Image from 'next/image';

interface MagnetApplyInfoCardProps {
  title: string;
  thumbnail: string | null;
  /** 열람 방식 텍스트 (예: "신청 즉시 자료 제공 / 항상 소장") */
  accessDescription?: string;
}

const MagnetApplyInfoCard = ({
  title,
  thumbnail,
  accessDescription = '신청 즉시 자료 제공 / 항상 소장',
}: MagnetApplyInfoCardProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xsmall16 font-semibold text-neutral-0 md:text-small18">
        신청 자료집
      </h2>
      <div className="flex items-start gap-4">
        <div className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-xxs bg-neutral-90">
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              sizes="72px"
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xsmall14 font-semibold text-neutral-0 md:text-xsmall16">
            {title}
          </span>
          <div className="flex items-center gap-1 text-xxsmall12 text-neutral-40 md:text-xsmall14">
            <span>열람 방식</span>
            <span className="font-medium text-primary">
              {accessDescription}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagnetApplyInfoCard;
