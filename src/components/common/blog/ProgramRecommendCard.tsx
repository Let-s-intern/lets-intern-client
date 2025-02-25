import { ProgramRecommendItem } from '@/api/blogSchema';
import { fetchChallenge, fetchLive, fetchVod } from '@/api/program';
import { convertReportTypeToPathname, fetchReportId } from '@/api/report';
import { ProgramTypeEnum } from '@/schema';
import Image from 'next/image';
import Link from 'next/link';

const { CHALLENGE, LIVE, REPORT, VOD } = ProgramTypeEnum.enum;
interface Props {
  program: ProgramRecommendItem;
}

async function ProgramRecommendCard({ program }: Props) {
  const getProgramInfo = async () => {
    let title: string | undefined;
    let thumbnail: string = '';
    let ctaLink = program.ctaLink ?? '';

    if (program.id) {
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
          const report = await fetchReportId(id);
          title = report.title ?? undefined;
          thumbnail = '/images/report/thumbnail-resume.svg';
          ctaLink = `/report/landing/${convertReportTypeToPathname(report.reportType ?? 'RESUME')}`;
      }
    } else if (program.ctaLink) {
      // 챌린지 가져오기
    }

    return { title, thumbnail, ctaLink };
  };

  const isProgramExist = program.id || program.ctaTitle;
  if (!isProgramExist) return null;

  const { title, thumbnail, ctaLink } = await getProgramInfo();

  return (
    <Link
      key={program.id}
      href={ctaLink}
      className="programs-center flex justify-between gap-4"
    >
      <div>
        <h4 className="mb-0.5 text-xxsmall12 font-medium text-neutral-40">
          {program.ctaTitle}
        </h4>
        <h3 className="line-clamp-2 font-semibold text-neutral-20 md:text-xsmall14">
          {title}
        </h3>
      </div>
      {/* 4:3 비율 */}
      <div className="relative h-[3.375rem] w-[4.5rem] shrink-0 bg-neutral-95">
        <Image
          priority
          className="rounded-xxs object-cover"
          src={thumbnail}
          alt={title + ' 썸네일'}
          fill
          sizes="4.5rem"
        />
      </div>
    </Link>
  );
}

export default ProgramRecommendCard;
