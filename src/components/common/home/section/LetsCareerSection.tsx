import { useGetLiveListQuery, useGetVodListQuery } from '@/api/program';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { useEffect, useMemo, useState } from 'react';
import ProgramContainer from '../ProgramContainer';
import { ProgramItemProps } from '../ProgramItem';
import { getBadgeText, getDuration } from './MainCurationSection';

const NAV_ITEMS = ['전체', 'LIVE 클래스', '취업 가이드북', 'VOD'];

const LetsCareerSection = () => {
  const [active, setActive] = useState<string>('전체');
  const [data, setData] = useState<ProgramItemProps[]>([]);

  const { data: liveData, isLoading: liveIsLoading } = useGetLiveListQuery({
    pageable: {
      size: 5,
      page: 1,
    },
  });

  const { data: vodData, isLoading: vodIsLoading } = useGetVodListQuery({
    pageable: {
      size: 5,
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
        thumbnail: live.thumbnail ?? '',
        title: live.title ?? '',
        url: `/program/live/${live.id}`,
        duration: getDuration({
          type: 'LIVE',
          startDate: live.startDate ?? '',
          endDate: live.endDate ?? '',
        }),
        badge: {
          text: getBadgeText({
            type: 'LIVE',
            deadline: live.deadline ?? '',
          }),
        },
      })) ?? [],
    [liveData],
  );

  const vodPrograms = useMemo(
    () =>
      vodData?.programList.map((vod) => ({
        thumbnail: vod.thumbnail ?? '',
        title: vod.title ?? '',
        url: `/program/vod/${vod.id}`,
        duration: undefined,
        badge: {
          text: getBadgeText({
            type: 'VOD',
          }),
        },
      })) ?? [],
    [vodData],
  );

  const isLoading = liveIsLoading || vodIsLoading;

  useEffect(() => {
    if (isLoading || !livePrograms) return;

    if (livePrograms) {
      if (active === '전체') {
        // 모든 데이터 저장
        setData([...vodPrograms, ...livePrograms]);
      } else if (active === 'LIVE 클래스') {
        // LIVE 클래스만 저장
        setData(livePrograms);
      } else if (active === 'VOD') {
        // VOD만 저장
        setData(vodPrograms);
      } else {
        // 취업 가이드북만 저장
        setData([]);
      }
    }
  }, [livePrograms, vodPrograms, isLoading, active]);

  return (
    <>
      <section className="mt-16 flex w-full max-w-[1160px] flex-col md:mt-24">
        {isLoading ? (
          <LoadingContainer />
        ) : (
          <ProgramContainer
            title={
              <>
                취준 꿀팁만 모아둔 <br className="md:hidden" />
                렛츠커리어의 독보적 콘텐츠 🚀
              </>
            }
            // moreUrl=""
            programs={data}
            navigation={navigation}
          />
        )}
      </section>
    </>
  );
};

export default LetsCareerSection;
