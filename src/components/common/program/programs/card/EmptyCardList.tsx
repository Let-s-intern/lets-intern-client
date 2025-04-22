/**
 * @deprecated 프로그램 출시 알림 신청 카드 리스트
 */

import { REMINDER_LINK } from '@/utils/programConst';

const emptyList = [
  {
    link: REMINDER_LINK,
    thumbnail: '/images/home/challenge-thumbnail.png',
    title: '신규 챌린지',
    desc: '챌린지를 통해 경험정리부터 서류 지원, 면접 준비까지 완성할 수 있어요.',
    buttonCaption: '출시알림신청',
    buttonColor: 'bg-point',
  },
  {
    link: REMINDER_LINK,
    thumbnail: '/images/home/live-thumbnail.png',
    title: 'LIVE 클래스',
    desc: 'LIVE 클래스를 통해 현직자에게 생생한 실무 이야기를 들으며, 성장해 나갈 수 있어요.',
    buttonCaption: '출시알림신청',
    buttonColor: 'bg-[#BBEDD8]',
  },
  {
    link: REMINDER_LINK,
    thumbnail: '/images/home/vod-thumbnail.png',
    title: 'VOD 클래스',
    desc: 'VOD 클래스를 통해 부족했던 하드스킬 및 소프트스킬을 모두 업그레이드 할 수 있어요.',
    buttonCaption: '출시알림신청',
    buttonColor: 'bg-[#CACCFC]',
  },
];

const EmptyCardList = () => {
  // API로 가져오는 게 아니라 정해진 데이터를 보여주는 카드
  return (
    <>
      {emptyList.map((program, i) => (
        <div
          key={i}
          className="early_button flex max-w-72 cursor-pointer flex-col overflow-hidden rounded-xs md:gap-4 md:rounded-md md:border md:border-neutral-85 md:p-2.5"
          onClick={() => window.open(program.link, '_blank')}
        >
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xs">
            <img
              className="h-full w-auto object-cover"
              src={program.thumbnail}
              alt="프로그램 썸네일 배경"
            />
          </div>
          <div className="flex flex-col gap-2 py-2">
            <h2 className="text-1-semibold">{program.title}</h2>
            <p className="text-0.875 line-clamp-2 h-11 text-neutral-30">
              {program.desc}
            </p>
            <button
              className={`text-0.875-medium rounded-sm border border-neutral-0 px-4 py-1.5 ${program.buttonColor}`}
            >
              {program.buttonCaption}
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default EmptyCardList;
