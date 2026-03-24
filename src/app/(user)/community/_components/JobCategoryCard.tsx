import { type OgonggoJob } from './const';

type Props = {
  job: OgonggoJob;
};

export default function JobCategoryCard({ job }: Props) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xs border border-neutral-80 bg-white p-3.5 md:gap-3 md:p-4">
      {/* Header with dot + name */}
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary-90" />
        <span className="text-xsmall14 font-bold text-static-0 md:text-xsmall16">
          {job.name}
        </span>
      </div>

      {/* Description */}
      <p className="flex-1 whitespace-pre-line text-xxsmall12 leading-snug text-neutral-40 md:text-xsmall14">
        {job.description}
      </p>

      {/* Link */}
      <a
        href={job.link}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start text-xxsmall12 font-medium text-primary-90 transition-colors hover:text-primary-80 md:text-xsmall14"
      >
        참여하기 →
      </a>
    </div>
  );
}
