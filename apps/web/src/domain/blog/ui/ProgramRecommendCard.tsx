import { ProgramRecommendItem } from '@/api/blog/blogSchema';
import {
  fetchChallenge,
  fetchLive,
  fetchPublicGuidebookData,
  fetchPublicVodData,
  getChallengeByKeyword,
} from '@/api/program';
import { convertReportTypeToPathname, fetchReportId } from '@/api/report';
import {
  captureBlogError,
  captureChallengeError,
  captureGuidebookError,
  captureVodError,
} from '@/utils/captureError';
import { ProgramTypeEnum } from '@/schema';
import Image from 'next/image';
import Link from 'next/link';

const { CHALLENGE, LIVE, VOD, GUIDEBOOK } = ProgramTypeEnum.enum;
interface Props {
  program: ProgramRecommendItem;
}

async function ProgramRecommendCard({ program }: Props) {
  const { title, thumbnail, ctaLink } = await getProgramInfo();

  const isProgramAvailable = title && ctaLink !== '';

  async function getProgramInfo() {
    let title: string | undefined;
    let thumbnail = '';
    let ctaLink = program.ctaLink ?? '';

    // 관리자가 추천 프로그램을 등록한 경우
    if (program.id) {
      // ProgramRecommendItem.id 는 `${TYPE}-${id}` 형식. catch 블록에서도 재사용
      // 하기 위해 try 바깥에서 한 번만 파싱한다 (ID 형식 의존을 한 곳에 집중).
      const [programType, entityId] = program.id.split('-');

      // 프로그램이 삭제된 경우 예외처리
      try {
        switch (programType) {
          case CHALLENGE:
            const challenge = await fetchChallenge(entityId);

            title = challenge.title;
            thumbnail = challenge.thumbnail ?? '';
            ctaLink = `/program/${programType.toLowerCase()}/${entityId}`;
            break;
          case LIVE:
            const live = await fetchLive(entityId);
            title = live.title;
            thumbnail = live.thumbnail ?? '';
            ctaLink = `/program/${programType.toLowerCase()}/${entityId}`;
            break;
          case VOD:
            const vod = await fetchPublicVodData(entityId);
            title = vod.title ?? undefined;
            thumbnail = vod.thumbnail ?? '';
            ctaLink = `/program/${programType.toLowerCase()}/${entityId}`;
            break;
          case GUIDEBOOK:
            const guidebook = await fetchPublicGuidebookData(entityId);
            title = guidebook.title ?? undefined;
            thumbnail = guidebook.thumbnail ?? '';
            ctaLink = `/program/guidebook/${entityId}`;
            break;
          default:
            // programType === REPORT
            const report = await fetchReportId(entityId);
            title = report.title ?? undefined;
            thumbnail = `/images/report/thumbnail-${convertReportTypeToPathname(report.reportType ?? 'RESUME')}.svg`;
            ctaLink = `/report/landing/${convertReportTypeToPathname(report.reportType ?? 'RESUME')}`;
        }
      } catch (err) {
        const captureByType =
          programType === VOD
            ? captureVodError
            : programType === GUIDEBOOK
              ? captureGuidebookError
              : programType === CHALLENGE
                ? captureChallengeError
                : captureBlogError;

        captureByType(err, {
          section: 'programRecommendCard',
          tags: { lookup: 'byId' },
          extra: { programId: program.id },
        });
      }
    } else if (program.ctaLink?.startsWith('latest')) {
      // latest:{keyword} 사용한 경우
      try {
        const keyword = program.ctaLink.split('latest:')[1].trim();
        const challenge = await getChallengeByKeyword(keyword);

        if (challenge) {
          title = challenge.programInfo.title ?? undefined;
          thumbnail = challenge.programInfo.thumbnail ?? '';
          ctaLink = `/program/${CHALLENGE.toLowerCase()}/${challenge.programInfo.id}`;
        }
      } catch (err) {
        captureBlogError(err, {
          section: 'programRecommendCard',
          tags: { lookup: 'byKeyword' },
          extra: { ctaLink: program.ctaLink },
        });
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
        <h4 className="text-xxsmall12 text-neutral-20 mb-0.5 font-medium">
          {program.ctaTitle}
        </h4>
        <h3 className="text-neutral-0 md:text-xsmall14 line-clamp-2 font-semibold">
          {title}
        </h3>
      </div>

      {thumbnail && (
        <div className="bg-neutral-95 relative h-[3.375rem] w-[4.5rem] shrink-0">
          <Image
            unoptimized
            fill
            sizes="4.5rem"
            className="rounded-xxs h-full w-full object-cover"
            src={thumbnail}
            alt={title + ' 썸네일'}
          />
        </div>
      )}
    </Link>
  );
}

export default ProgramRecommendCard;
