import ChatPreview from './ChatPreview';
import JobCategoryCard from './JobCategoryCard';
import { OGONGGO_SITE_LINK, ogonggoJobs } from '../data/ogonggo';

export default function OgongoBlock() {
  return (
    <div className="rounded-sm bg-[#F7F9FF] p-5 md:p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-neutral-80 pb-4 md:mb-5 md:pb-5">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-xsmall16 font-bold text-static-0 md:text-small18">
              오공고 톡방
            </h3>
            <span className="rounded-xxs bg-primary-5 px-2 py-0.5 text-xxsmall12 font-medium text-primary-90">
              채용공고 큐레이션
            </span>
          </div>
          <p className="break-keep text-xsmall14 leading-relaxed text-neutral-40">
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
          className="flex-shrink-0 whitespace-nowrap rounded-xs bg-primary-90 px-4 py-2 text-xxsmall12 font-medium text-white shadow-sm transition-colors hover:bg-primary-80 md:text-xsmall14"
        >
          오공고 사이트 →
        </a>
      </div>

      {/* Free resources banner */}
      <div className="mb-4 flex items-start gap-2.5 rounded-xs border border-primary-20 bg-white px-4 py-3 md:mb-5">
        <span
          className="flex-shrink-0 text-xsmall16"
          role="img"
          aria-label="gift"
        >
          🎁
        </span>
        <p className="text-xsmall14 leading-relaxed text-neutral-40">
          <strong className="text-static-0">
            무료 취업 자료도 받아가세요.
          </strong>{' '}
          이력서·자소서 템플릿, 직무 자료집, 공채 준비 가이드북 등 렛츠커리어의
          무료 자료 창고를 톡방에서 바로 확인할 수 있어요.
        </p>
      </div>

      {/* Job category cards grid */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:mb-6 md:grid-cols-4">
        {ogonggoJobs.map((job) => (
          <JobCategoryCard key={job.id} job={job} />
        ))}
      </div>

      {/* Chat preview screenshots */}
      <div className="border-t border-neutral-80 pt-5 md:pt-6">
        <p className="mb-3 text-xsmall14 font-bold text-static-0 md:mb-4 md:text-xsmall16">
          톡방에서 매일 이런 정보가 공유돼요
        </p>
        <ChatPreview />
      </div>
    </div>
  );
}
