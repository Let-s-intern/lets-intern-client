import { ArrowUpRight } from 'lucide-react';
import {
  LETSCON_BENEFITS,
  LETSCON_DOCUMENT_DEADLINE,
  LETSCON_FEEDBACK_BENEFIT,
  LETSCON_FEEDBACK_DETAILS,
  LETSCON_FEEDBACK_STEPS,
} from '../data/benefit';
import {
  LETSCON_DOCUMENT_SUBMIT_URL,
  LETSCON_YOUTUBE_URL,
} from '../data/links';
import { getYoutubeVideoId } from '../lib/youtube';
import { ConnectionLine } from './ConnectionLine';
import { FeedbackVideo } from './FeedbackVideo';

const videoId = getYoutubeVideoId(LETSCON_YOUTUBE_URL);
const { icon: FeedbackIcon } = LETSCON_FEEDBACK_BENEFIT;

export function OfflineBenefit({
  offlineApplied,
}: {
  offlineApplied: boolean;
}) {
  const showDocumentSubmit = offlineApplied && LETSCON_DOCUMENT_SUBMIT_URL;

  return (
    <section className="relative overflow-hidden break-keep bg-[#11142b] py-16 md:py-[88px]">
      <ConnectionLine
        viewBox="0 0 250 100"
        points={[
          [4, 36],
          [112, 88],
          [205, 10],
          [250, 40],
        ]}
        className="absolute right-0 top-[368px] hidden h-[100px] w-[250px] xl:block"
      />
      <ConnectionLine
        viewBox="0 0 300 130"
        points={[
          [0, 80],
          [100, 20],
          [180, 111],
          [300, 45],
        ]}
        className="absolute bottom-[333px] left-0 hidden h-[130px] w-[300px] xl:block"
      />

      <div className="relative mx-auto max-w-[880px] px-5">
        <h2 className="text-2xl font-bold leading-[1.4] tracking-[-0.02em] text-white md:text-4xl md:leading-[1.35]">
          11/15(일) 오프라인 참여자에게만
          <br />
          제공되는 특별 혜택
        </h2>

        <ul className="mt-6 grid gap-[18px] md:mt-10 md:grid-cols-3">
          {LETSCON_BENEFITS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="bg-primary-5 rounded-[14px] p-5">
              <span className="bg-primary-10 text-primary flex h-10 w-10 items-center justify-center rounded-[10px]">
                <Icon aria-hidden className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-base font-bold text-[#1c1e2b]">
                {title}
              </h3>
              <p className="mt-2 whitespace-pre-line text-[13px] leading-[1.5] text-[#4c4f5e] md:text-xs md:tracking-[-0.02em]">
                {body}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-[18px] rounded-[14px] border border-[#2a2f7a] bg-[#000570] p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#1e2363] text-[#ffe566]">
            <FeedbackIcon aria-hidden className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <h3 className="mt-4 text-lg font-bold text-white">
            {LETSCON_FEEDBACK_BENEFIT.title}
          </h3>
          <div className="mt-2 text-sm leading-[1.55] tracking-[-0.01em] text-white/90">
            {LETSCON_FEEDBACK_BENEFIT.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          {showDocumentSubmit ? (
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <a
                href={LETSCON_DOCUMENT_SUBMIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-[8px] bg-[#ffe566] px-3 py-2 text-[13px] font-bold text-[#1c1e2b]"
              >
                서류 제출하기
                <ArrowUpRight aria-hidden className="h-4 w-4" />
              </a>
              <span className="text-[13px] text-white/90">
                제출 기한 {LETSCON_DOCUMENT_DEADLINE}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-7 rounded-[16px] bg-white p-5 md:mt-9 md:p-6">
          <h3 className="text-lg font-bold text-[#1c1e2b] md:text-[17px]">
            무료 서류 Live 피드백, 이렇게 진행돼요
          </h3>

          <ol className="mt-5 grid gap-3 md:mt-6 md:grid-cols-3">
            {LETSCON_FEEDBACK_STEPS.map(({ title, body }, index) => (
              <li
                key={title}
                className="grid grid-cols-[26px_1fr] items-center gap-x-2 rounded-[12px] bg-[#f7f8fc] p-4 md:block"
              >
                <span className="bg-primary flex h-[26px] w-[26px] items-center justify-center rounded-full text-[13px] font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-bold text-[#1c1e2b] md:mt-3">
                  {title}
                </p>
                <p className="col-start-2 mt-1.5 text-[13px] leading-[1.5] text-[#6b6e7c] md:mt-2">
                  {body}
                </p>
              </li>
            ))}
          </ol>

          <dl className="mt-5 flex flex-col gap-2.5 md:mt-6">
            {LETSCON_FEEDBACK_DETAILS.map(({ label, value }) => (
              <div
                key={label}
                className="flex gap-1 text-sm leading-[1.45] md:gap-3"
              >
                <dt className="flex w-[74px] shrink-0 items-start gap-[11px] font-bold text-[#1c1e2b] md:w-[90px]">
                  <span className="bg-primary mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" />
                  <span className="whitespace-nowrap">{label}</span>
                </dt>
                <dd className="text-[#5b5e6d]">{value}</dd>
              </div>
            ))}
          </dl>

          {videoId ? <FeedbackVideo videoId={videoId} /> : null}
        </div>
      </div>
    </section>
  );
}
