'use client';

import { useGetUserProgramQuery, useGetVodListQuery } from '@/api/program';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { useEffect, useMemo, useState } from 'react';
import { getBadgeText, getDuration } from '../banner/MainCurationSection';
import ProgramContainer from './ProgramContainer';
import { ProgramItemProps } from './ProgramItem';

const NAV_ITEMS = ['전체', 'LIVE 클래스', '취업 가이드북', 'VOD'];
const MAX_PROGRAMS_PER_CATEGORY = 5;

const LetsCareerSection = () => {
  const [active, setActive] = useState<string>('전체');
  const [data, setData] = useState<ProgramItemProps[]>([]);

  const { data: liveData, isLoading: liveIsLoading } = useGetUserProgramQuery({
    pageable: {
      size: 5,
      page: 1,
    },
    searchParams: {
      type: 'LIVE',
      status: ['PROCEEDING'],
    },
  });

  const { data: vodData, isLoading: vodIsLoading } = useGetVodListQuery({
    pageable: {
      size: 20,
      page: 1,
    },
  });

  const navigation = useMemo(
    () =>
      NAV_ITEMS.map((nav) => ({
        text: nav,
        active: nav === active,
        onClick: () => setActive(nav),
      })),
    [active],
  );

  const livePrograms = useMemo(
    () =>
      liveData?.programList.map((live) => ({
        thumbnail: live.programInfo.thumbnail ?? '',
        title: live.programInfo.title ?? '',
        url: `/program/live/${live.programInfo.id}`,
        duration: getDuration({
          type: 'LIVE',
          startDate: live.programInfo.startDate ?? '',
          endDate: live.programInfo.endDate ?? '',
        }),
        badge: {
          text: getBadgeText({
            type: 'LIVE',
            deadline: live.programInfo.deadline ?? '',
          }),
        },
      })) ?? [],
    [liveData],
  );

  const vodPrograms = useMemo(
    () =>
      vodData?.programList
        .filter((vod) => vod.title && !vod.title.includes('가이드북'))
        .map((vod) => ({
          thumbnail: vod.thumbnail ?? '',
          title: vod.title ?? '',
          url: vod.link ?? '',
          duration: undefined,
          badge: {
            text: '즉시 수강 가능',
          },
        }))
        .slice(0, MAX_PROGRAMS_PER_CATEGORY) ?? [],
    [vodData],
  );

  const guideBookPrograms = useMemo(
    () =>
      vodData?.programList
        .filter((vod) => vod.title && vod.title.includes('가이드북'))
        .map((vod) => ({
          thumbnail: vod.thumbnail ?? '',
          title: vod.title ?? '',
          url: vod.link ?? '',
          duration: undefined,
          badge: {
            text: '평생 소장 가능',
          },
        }))
        .slice(0, MAX_PROGRAMS_PER_CATEGORY) ?? [],
    [vodData],
  );

  const isLoading = liveIsLoading || vodIsLoading;

  useEffect(() => {
    if (isLoading || !livePrograms) return;

    if (livePrograms) {
      if (active === '전체') {
        // 모든 데이터 저장
        setData([...livePrograms, ...guideBookPrograms, ...vodPrograms]);
      } else if (active === 'LIVE 클래스') {
        // LIVE 클래스만 저장
        setData(livePrograms);
      } else if (active === 'VOD') {
        // VOD만 저장
        setData(vodPrograms);
      } else {
        // 취업 가이드북만 저장
        setData(guideBookPrograms);
      }
    }
  }, [livePrograms, vodPrograms, guideBookPrograms, isLoading, active]);

  return (
    <>
      <section className="mt-16 flex w-full max-w-[1120px] flex-col md:mt-21">
        {isLoading ? (
          <LoadingContainer />
        ) : (
          <ProgramContainer
            gaTitle="취준 꿀팁만 모아둔 렛츠커리어의 독보적 콘텐츠"
            gaItem="made_contents"
            title={
              <>
                취준 꿀팁만 모아둔 <br className="md:hidden" />
                렛츠커리어의 독보적 콘텐츠 🚀
              </>
            }
            moreUrl="/program?type=LIVE&type=VOD"
            isDeadline={false}
            totalPrograms={
              [...livePrograms, ...guideBookPrograms, ...vodPrograms].length
            }
            programs={data}
            navigation={navigation}
            emptyText={`취업에 도움 되는 콘텐츠를 준비중이에요.\n잠시만 기다려주세요!`}
          />
        )}
      </section>
    </>
  );
};

export default LetsCareerSection;
