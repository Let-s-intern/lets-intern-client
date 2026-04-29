import ChatPreview from './ChatPreview';
import JobCategoryCard from './JobCategoryCard';
import { OGONGGO_SITE_LINK, ogonggoJobs } from '../data/ogonggo';

export default function OgonggoBlock() {
  return (
    <div className="rounded-sm bg-[#F7F9FF] p-5 md:p-6">
      {/* Header */}
      <div className="border-neutral-80 mb-4 flex flex-col gap-3 border-b pb-4 md:mb-5 md:flex-row md:items-start md:justify-between md:pb-5">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-xsmall16 text-static-0 md:text-small18 font-bold">
              오공고 톡방
            </h3>
            <span className="rounded-xxs bg-primary-5 text-xxsmall12 text-primary-90 px-2 py-0.5 font-medium">
              채용공고 큐레이션
            </span>
          </div>
          <p className="text-xsmall14 text-neutral-40 break-keep leading-relaxed">
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
          className="rounded-xs bg-primary-90 text-xxsmall12 hover:bg-primary-80 md:text-xsmall14 w-fit flex-shrink-0 whitespace-nowrap px-4 py-2 font-medium text-white shadow-sm transition-colors"
        >
          오공고 사이트 →
        </a>
      </div>

      {/* Free resources banner */}
      <div className="rounded-xs border-primary-20 mb-4 flex items-start gap-2.5 border bg-white px-4 py-3 md:mb-5">
        <span
          className="text-xsmall16 flex-shrink-0"
          role="img"
          aria-label="gift"
        >
          🎁
        </span>
        <p className="text-xsmall14 text-neutral-40 leading-relaxed">
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
      <div className="border-neutral-80 border-t pt-5 md:pt-6">
        <p className="text-xsmall14 text-static-0 md:text-xsmall16 mb-3 font-bold md:mb-4">
          톡방에서 매일 이런 정보가 공유돼요
        </p>
        <ChatPreview />
      </div>
    </div>
  );
}
