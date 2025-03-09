import { ProgramRecommendItem } from '@/api/blogSchema';
import {
  fetchChallenge,
  fetchLive,
  fetchVod,
  getChallengeByKeyword,
} from '@/api/program';
import { convertReportTypeToPathname, fetchReportId } from '@/api/report';
import { ProgramTypeEnum } from '@/schema';
import Link from 'next/link';

const { CHALLENGE, LIVE, VOD } = ProgramTypeEnum.enum;
interface Props {
  program: ProgramRecommendItem;
}

async function ProgramRecommendCard({ program }: Props) {
  console.log('programRecommend >>', program);
  const { title, thumbnail, ctaLink } = await getProgramInfo();

  const isProgramAvailable = title && thumbnail !== '' && ctaLink !== '';

  async function getProgramInfo() {
    let title: string | undefined;
    let thumbnail = '';
    let ctaLink = program.ctaLink ?? '';

    // 관리자가 추천 프로그램을 등록한 경우
    if (program.id) {
      // 프로그램이 삭제된 경우 예외처리
      try {
        const [type, id] = program.id.split('-');

        switch (type) {
          case CHALLENGE:
            const challenge = await fetchChallenge(id);

            title = challenge.title;
            thumbnail = challenge.thumbnail ?? '';
            ctaLink = `/program/${type.toLowerCase()}/${id}`;
            break;
          case LIVE:
            const live = await fetchLive(id);
            title = live.title;
            thumbnail = live.thumbnail ?? '';
            ctaLink = `/program/${type.toLowerCase()}/${id}`;
            break;
          case VOD:
            const vod = await fetchVod(id);
            title = vod.vodInfo.title ?? undefined;
            thumbnail = vod.vodInfo.thumbnail ?? '';
            ctaLink = vod.vodInfo.link ?? '';
            break;
          default:
            // type === REPORT
            const report = await fetchReportId(id);
            title = report.title ?? undefined;
            thumbnail = `/images/report/thumbnail-${convertReportTypeToPathname(report.reportType ?? 'RESUME')}.svg`;
            ctaLink = `/report/landing/${convertReportTypeToPathname(report.reportType ?? 'RESUME')}`;
        }
      } catch (err) {
        console.error('The program is not available.');
      }
    } else if (program.ctaLink?.startsWith('latest')) {
      // latest:{keyword} 사용한 경우
      const keyword = program.ctaLink.split('latest:')[1].trim();
      const challenge = await getChallengeByKeyword(keyword);

      if (challenge) {
        title = challenge.programInfo.title ?? undefined;
        thumbnail = challenge.programInfo.thumbnail ?? '';
        ctaLink = `/program/${CHALLENGE.toLowerCase()}/${challenge.programInfo.id}`;
      }
    }

    return { title, thumbnail, ctaLink };
  }

  if (!isProgramAvailable) return null;

  return (
    <Link
      href={ctaLink}
      className="programs-center blog_programrec flex justify-between gap-4"
      data-url={ctaLink}
      data-text={title}
      data-program-name={program.ctaTitle}
      data-program-id={program.id}
    >
      <div>
        <h4 className="mb-0.5 text-xxsmall12 font-medium text-neutral-20">
          {program.ctaTitle}
        </h4>
        <h3 className="line-clamp-2 font-semibold text-neutral-0 md:text-xsmall14">
          {title}
        </h3>
      </div>

      <div className="relative h-[3.375rem] w-[4.5rem] shrink-0 bg-neutral-95">
        <img
          className="h-full w-full rounded-xxs object-cover"
          src={thumbnail}
          alt={title + ' 썸네일'}
        />
      </div>
    </Link>
  );
}

export default ProgramRecommendCard;
