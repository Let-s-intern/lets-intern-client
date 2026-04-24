import { useGetMypageMagnetListQuery } from '@/api/magnet/magnet';
import { MypageMagnetListItem } from '@/api/magnet/magnetSchema';
import dayjs from '@/lib/dayjs';
import { useState } from 'react';
import MoreButton from '../../ui/button/MoreButton';
import { MypageApplicationCard } from '../../ui/card/NewApplicationCard';
import { MypageApplicationCardConfig } from '../utils/applicationCardConfig';
import EmptySection from './EmptySection';

const MAGNET_TYPE_LABEL: Record<string, string> = {
  MATERIAL: '직무 자료집',
  VOD: '무료 VOD',
  FREE_TEMPLATE: '무료 템플릿',
  LAUNCH_ALERT: '출시 알림',
  EVENT: '기타',
};

const toLibraryCardConfig = (
  magnet: MypageMagnetListItem,
): MypageApplicationCardConfig => {
  const dateText = magnet.applicationCreateDate
    ? dayjs(magnet.applicationCreateDate).format('YY.MM.DD')
    : '';

  const slug = encodeURIComponent(magnet.title.replace(/\s+/g, '-'));

  return {
    id: magnet.magnetId,
    programId: magnet.magnetId,
    programTypeKey: 'MAGNET',
    thumbnail: magnet.desktopThumbnail ?? '',
    title: magnet.title,
    description: (() => {
      try {
        const parsed = JSON.parse(magnet.description ?? '');
        return parsed.metaDescription ?? '';
      } catch {
        return magnet.description ?? '';
      }
    })(),
    isHtmlDescription: true,
    statusLabel: '신청완료',
    categoryLabel: MAGNET_TYPE_LABEL[magnet.type] ?? magnet.type,
    dateLabel: '신청일자',
    dateText,
    actionButton: {
      label: '확인하기',
      href: `/library/${magnet.magnetId}/${slug}`,
    },
    isCompleted: false,
  };
};

const LibrarySection = () => {
  const { data, isLoading } = useGetMypageMagnetListQuery({});
  const [showMore, setShowMore] = useState(false);

  if (isLoading) return <></>;

  const magnetList = data?.magnetList ?? [];
  const hasMagnets = magnetList.length > 0;
  const list = showMore ? magnetList : magnetList.slice(0, 10);

  return (
    <section className="flex flex-col gap-6">
      {hasMagnets ? (
        <>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:flex md:flex-col md:gap-y-5">
            {list.map((magnet) => (
              <MypageApplicationCard
                key={magnet.magnetId}
                config={toLibraryCardConfig(magnet)}
              />
            ))}
          </div>
          {magnetList.length > 10 && !showMore && (
            <MoreButton
              className="border-neutral-80 !bg-transparent px-3 py-2 text-primary transition-colors hover:!bg-primary/5 md:flex md:p-3"
              onClick={() => {
                setShowMore(true);
              }}
            >
              더보기
            </MoreButton>
          )}
        </>
      ) : (
        <EmptySection
          text="아직 신청한 자료집이 없어요"
          href="/library/list"
          buttonText="자료집 둘러보기"
        />
      )}
    </section>
  );
};

export default LibrarySection;
