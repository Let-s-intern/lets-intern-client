import { useGetUserCuration } from '@/api/curation';
import ProgramContainer from '../ProgramContainer';
import {
  getBadgeText,
  getCategory,
  getCreatedDate,
  getDuration,
  getProgramThumbnail,
  getProgramUrl,
} from './MainCurationSection';

const BlogCurationSection = () => {
  const { data } = useGetUserCuration({
    locationType: 'UNDER_BLOG',
  });

  const blogCurationList = data?.curationList.slice(0, 4);

  if (
    !blogCurationList ||
    blogCurationList.length === 0 ||
    blogCurationList.every((b) => b.curationItemList.length === 0)
  )
    return null;
  return (
    <>
      <section className="md:gap-y-21 mt-16 flex w-full max-w-[1120px] flex-col gap-y-16 md:mt-24">
        {blogCurationList.map((curation, index) => (
          <ProgramContainer
            key={'blogCuration' + index}
            gaItem={'blog_curation_' + curation.curationInfo.curationId}
            gaTitle={curation.curationInfo.title}
            title={curation.curationInfo.title}
            subTitle={curation.curationInfo.subTitle ?? undefined}
            moreUrl={curation.curationInfo.moreUrl ?? undefined}
            programs={curation.curationItemList.map((item) => ({
              thumbnail: getProgramThumbnail({
                type: item.programType,
                reportType: item.reportType ?? null,
                thumbnail: item.thumbnail ?? undefined,
              }),
              title: item.title ?? '',
              url: getProgramUrl({
                type: item.programType,
                programId: item.programId ?? undefined,
                reportType: item.reportType ?? undefined,
                url: item.url ?? undefined,
              }),
              duration: getDuration({
                type: item.programType,
                startDate: item.startDate ?? undefined,
                endDate: item.endDate ?? undefined,
              }),
              badge: {
                text: getBadgeText({
                  type: item.programType,
                  deadline: item.deadline ?? undefined,
                  tagText: item.tag ?? undefined,
                }),
              },
              createdDate: getCreatedDate({
                type: item.programType,
                createdAt: item.programCreateDate ?? undefined,
              }),
              category: getCategory({
                type: item.programType,
                category: item.category ?? undefined,
              }),
            }))}
          />
        ))}
      </section>
    </>
  );
};

export default BlogCurationSection;
