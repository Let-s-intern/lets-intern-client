import { type OgonggoJob } from '../data/ogonggo';

type Props = {
  job: OgonggoJob;
};

export default function JobCategoryCard({ job }: Props) {
  return (
    <div className="rounded-xs border-neutral-80 flex flex-col gap-2.5 border bg-white p-3.5 md:gap-3 md:p-4">
      {/* Header with dot + name */}
      <div className="flex items-center gap-2">
        <div className="bg-primary-90 h-2.5 w-2.5 flex-shrink-0 rounded-full" />
        <span className="text-xsmall14 text-static-0 md:text-xsmall16 font-bold">
          {job.name}
        </span>
      </div>

      {/* Description */}
      <p className="text-xxsmall12 text-neutral-40 md:text-xsmall14 flex-1 whitespace-pre-line leading-snug">
        {job.description}
      </p>

      {/* Link */}
      <a
        href={job.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xxsmall12 text-primary-90 hover:text-primary-80 md:text-xsmall14 self-start font-medium transition-colors"
      >
        참여하기 →
      </a>
    </div>
  );
}
