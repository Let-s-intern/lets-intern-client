import { type OgonggoJob } from './const';

type Props = {
  job: OgonggoJob;
};

export default function JobCategoryCard({ job }: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-xxs border border-neutral-80 bg-white p-3 md:gap-2.5 md:p-3.5">
      {/* Header with dot + name */}
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 flex-shrink-0 rounded-full border-2 border-neutral-30 bg-neutral-60" />
        <span className="text-xxsmall12 font-bold text-neutral-10 md:text-xsmall14">
          {job.name}
        </span>
      </div>

      {/* Description */}
      <p className="flex-1 whitespace-pre-line text-[10px] leading-snug text-neutral-40 md:text-xxsmall12">
        {job.description}
      </p>

      {/* Link */}
      <a
        href={job.link}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start border-b border-neutral-60 text-[11px] text-neutral-40 transition-colors hover:text-neutral-10 md:text-xxsmall12"
      >
        참여하기 →
      </a>
    </div>
  );
}
