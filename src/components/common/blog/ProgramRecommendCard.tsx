import Image from 'next/image';
import Link from 'next/link';

interface Props {
  program: {
    id: string | number;
    ctaTitle: string;
    programTitle: string;
    thumbnail: string;
    ctaLink: string;
  };
}

function ProgramRecommendCard({ program }: Props) {
  return (
    <Link
      key={program.id}
      href={program.ctaLink}
      className="programs-center flex justify-between gap-4"
    >
      <div>
        <h4 className="text-xxsmall12 font-medium text-neutral-40">
          {program.ctaTitle}
        </h4>
        <h3 className="font-semibold text-neutral-20">
          {program.programTitle}
        </h3>
      </div>
      <div className="relative aspect-[4/3] w-[4.5rem] shrink-0 bg-neutral-95">
        <Image
          className="rounded-xxs object-cover"
          src={program.thumbnail}
          alt={program.programTitle + ' 썸네일'}
          fill
          sizes="4.5rem"
        />
      </div>
    </Link>
  );
}

export default ProgramRecommendCard;
