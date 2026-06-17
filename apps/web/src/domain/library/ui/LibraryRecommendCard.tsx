import { LockKeyhole } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  href: string;
  thumbnail: string | null;
  category: string;
  title: string;
  isUpcoming?: boolean;
}

export default function LibraryRecommendCard({
  href,
  thumbnail,
  category,
  title,
  isUpcoming,
}: Props) {
  return (
    <Link
      href={href}
      className="group relative flex justify-between gap-14 md:flex-col md:items-stretch md:gap-2.5"
    >
      {/* 썸네일 */}
      <div className="rounded-xxs bg-neutral-90 relative order-2 h-[3.375rem] w-[4.5rem] shrink-0 overflow-hidden md:order-none md:aspect-[4/3] md:h-auto md:w-full md:rounded-sm">
        {thumbnail && (
          <Image src={thumbnail} alt={title} fill className="object-cover" />
        )}
        {isUpcoming && (
          <>
            <div className="pointer-events-none absolute inset-0 z-[1] bg-black/20" />
            <div className="pointer-events-none absolute right-2 top-2 z-10 hidden items-center gap-1 rounded-full bg-white/60 px-2 py-1 md:flex">
              <LockKeyhole size={12} color="#4C4F56" />
              <span className="text-xxsmall12 text-neutral-30 font-medium">
                공개예정
              </span>
            </div>
          </>
        )}
      </div>

      {/* 텍스트 */}
      <div className="order-1 flex flex-1 flex-col gap-1 md:order-none">
        <span className="text-xxsmall12 text-primary md:text-xsmall14 truncate font-semibold">
          {category}
        </span>
        <h3 className="text-neutral-0 md:text-xsmall16 line-clamp-3 font-semibold md:line-clamp-2">
          {title}
        </h3>
      </div>
    </Link>
  );
}
