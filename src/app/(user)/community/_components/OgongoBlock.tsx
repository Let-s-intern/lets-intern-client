import JobCategoryCard from './JobCategoryCard';
import { ogonggoJobs, OGONGGO_SITE_LINK } from './const';

export default function OgongoBlock() {
  return (
    <div className="rounded-sm bg-neutral-90 p-4 md:p-5">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2 border-b border-neutral-70 pb-3 md:mb-4 md:pb-4">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="text-xsmall14 font-bold text-neutral-10 md:text-small18">
              오공고 톡방
            </h3>
            <span className="rounded-xxs border border-neutral-30 bg-white px-1.5 py-0.5 text-[10px] font-bold text-neutral-20 md:text-xxsmall12">
              채용공고 큐레이션
            </span>
          </div>
          <p className="break-keep text-xxsmall12 leading-relaxed text-neutral-40 md:text-xsmall14">
            문과 취준생을 위해 렛츠커리어가 운영하는 채용공고 큐레이션
            채널이에요.
            <br className="hidden md:inline" />
            검증된 공고를 직무별로 골라 매일 소개해드려요.
          </p>
        </div>
        <a
          href={OGONGGO_SITE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 whitespace-nowrap rounded-xxs border border-neutral-30 bg-white px-2.5 py-1.5 text-xxsmall12 text-neutral-10 transition-colors hover:bg-neutral-95"
        >
          오공고 사이트 →
        </a>
      </div>

      {/* Free resources banner */}
      <div className="mb-3 flex items-start gap-2 rounded-xxs border border-dashed border-neutral-30 bg-white px-3 py-2.5 md:mb-4">
        <span className="flex-shrink-0 text-sm" role="img" aria-label="gift">
          🎁
        </span>
        <p className="text-xxsmall12 leading-relaxed text-neutral-40 md:text-xsmall14">
          <strong className="text-neutral-10">
            무료 취업 자료도 받아가세요.
          </strong>{' '}
          이력서·자소서 템플릿, 직무 자료집, 공채 준비 가이드북 등 렛츠커리어의
          무료 자료 창고를 톡방에서 바로 확인할 수 있어요.
        </p>
      </div>

      {/* Job category cards grid */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {ogonggoJobs.map((job) => (
          <JobCategoryCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
