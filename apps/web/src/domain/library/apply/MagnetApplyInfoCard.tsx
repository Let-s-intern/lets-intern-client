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
    <div className="flex flex-col gap-6">
      <h2 className="text-xsmall16 text-neutral-0 font-semibold">
        신청 자료집
      </h2>
      <div className="flex items-start gap-4">
        <div className="rounded-xxs bg-neutral-90 relative h-[97px] w-[137px] flex-shrink-0 overflow-hidden">
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
        <div className="flex flex-col gap-3">
          <span className="text-xsmall16 text-neutral-0 font-semibold">
            {title}
          </span>
          <div className="text-xxsmall12 text-neutral-40 flex gap-4 md:items-center">
            <span>열람 방식</span>
            <span className="text-primary-dark font-medium">
              {accessDescription.split('/').map((text, i, arr) => (
                <span key={i}>
                  {text.trim()}
                  {i < arr.length - 1 && (
                    <>
                      <span className="md:inline"> / </span>
                      <br className="md:hidden" />
                    </>
                  )}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagnetApplyInfoCard;
