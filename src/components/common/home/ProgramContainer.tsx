import { useMediaQuery } from '@mui/material';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, ReactNode } from 'react';
import { Grid } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import EmptyContainer from '../ui/EmptyContainer';
import MoreHeader from '../ui/MoreHeader';
import ProgramItem, { ProgramItemProps } from './ProgramItem';

interface ProgramContainerProps {
  title: ReactNode;
  navigation?: {
    text: string;
    active: boolean;
    onClick: () => void;
  }[];
  subTitle?: string;
  moreUrl?: string;
  totalPrograms?: number;
  programs: ProgramItemProps[];
  showGrid?: boolean;
  gaItem: string;
  gaTitle: string;
  isDeadline?: boolean;
  emptyText?: string;
  isShowNotification?: boolean;
}

const ProgramContainer = ({
  title,
  navigation,
  subTitle,
  moreUrl,
  totalPrograms,
  programs,
  showGrid,
  gaItem,
  gaTitle,
  isDeadline,
  emptyText,
  isShowNotification = false,
}: ProgramContainerProps) => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!navigation && programs.length < 1) return null;

  return (
    <div className="flex w-full max-w-[1120px] flex-col gap-y-6 md:gap-y-10">
      <div className="flex w-full flex-col gap-y-4 px-5 xl:px-0">
        <MoreHeader
          subtitle={subTitle}
          href={moreUrl}
          isVertical
          isBig
          gaText={gaTitle}
        >
          {typeof title === 'string' ? (
            <>
              {title.split('\\n').map((line, index) => (
                <Fragment key={index}>
                  {line} <br className="md:hidden" />
                </Fragment>
              ))}
            </>
          ) : (
            title
          )}
        </MoreHeader>
        {navigation && (
          <div className="flex w-fit items-center gap-x-2 overflow-auto scrollbar-hide">
            {navigation.map((nav, index) => (
              <button
                key={index}
                className={`shrink-0 rounded-xs px-3 py-2 text-xsmall14 font-medium ${
                  nav.active
                    ? 'bg-neutral-10 text-white'
                    : 'bg-neutral-90 text-neutral-35'
                }`}
                onClick={nav.onClick}
              >
                {nav.text}
              </button>
            ))}
          </div>
        )}
      </div>
      {(!navigation && programs.length < 1) ||
      (navigation &&
        totalPrograms &&
        totalPrograms > 0 &&
        programs.length < 1) ? (
        <EmptyContainer
          className="h-[201px] md:h-[266px]"
          text={emptyText || '등록된 콘텐츠가 없습니다.'}
        />
      ) : (
        <Swiper
          // program 바뀔 경우 스크롤 위치 초기화 위해 key로 리렌더링 적용
          key={title + '-slide'}
          className="w-full"
          autoplay={{ delay: 2500 }}
          modules={[Grid]}
          slidesPerView={2.4}
          grid={
            !isMobile && showGrid
              ? { rows: 2, fill: 'row' }
              : { rows: 1, fill: 'row' }
          }
          spaceBetween={12}
          slidesOffsetBefore={20}
          slidesOffsetAfter={20}
          breakpoints={{
            768: {
              spaceBetween: 16,
              slidesPerView: 3,
              slidesOffsetBefore: 20,
              slidesOffsetAfter: 20,
            },
            820: {
              spaceBetween: 16,
              slidesPerView: 4,
              slidesOffsetBefore: 20,
              slidesOffsetAfter: 20,
            },
            1040: {
              spaceBetween: 16,
              slidesPerView: 5,
              slidesOffsetBefore: 20,
              slidesOffsetAfter: 20,
            },
            1280: {
              spaceBetween: 16,
              slidesPerView: 5,
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 0,
            },
          }}
        >
          {programs.map((program, index) => (
            <SwiperSlide key={index}>
              <ProgramItem
                {...program}
                gaTitle={gaTitle}
                className={gaItem}
                isDeadline={isDeadline}
              />
            </SwiperSlide>
          ))}
          {/* 출시 알림 신청 버튼 */}
          {isShowNotification &&
            // 모바일: 프로그램이 하나 이하일 때
            // 데스크탑: 프로그램이 두 개 이하일 때
            ((isMobile && programs.length <= 1) ||
              (!isMobile && programs.length <= 2)) && (
              <SwiperSlide>
                <NotificationBtn onClick={() => router.push('/notification')} />
              </SwiperSlide>
            )}
        </Swiper>
      )}
    </div>
  );
};

function NotificationBtn({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="flex aspect-[1.3/1] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-sm bg-primary-5 bg-[url('/images/notification-bg.svg')] bg-cover bg-no-repeat md:gap-3"
      onClick={onClick}
    >
      <p className="text-center text-xxsmall10 font-medium text-neutral-0/65 md:text-xsmall14">
        원하는 프로그램이 없어서
        <br />
        아쉽다면,
      </p>
      <button
        type="button"
        className="flex items-center rounded-xxs bg-white p-2 pr-1 text-primary"
      >
        <span className="text-xxsmall12 font-medium md:text-xsmall14">
          출시 알림 신청하기
        </span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default ProgramContainer;
