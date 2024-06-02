const emptyList = [
  {
    link: 'https://www.naver.com/',
    thumbnail: '/images/home/program-thumbnail.png',
    title: '신규 챌린지',
    desc: '2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는',
    buttonCaption: '사전알림신청',
    buttonColor: 'bg-point',
  },
  {
    link: 'https://www.naver.com/',
    thumbnail: '/images/home/program-thumbnail.png',
    title: 'LIVE 클래스',
    desc: '2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는',
    buttonCaption: '출시알림신청',
    buttonColor: 'bg-[#BBEDD8]',
  },
  {
    link: 'https://www.naver.com/',
    thumbnail: '/images/home/program-thumbnail.png',
    title: 'VOD 클래스',
    desc: '2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는',
    buttonCaption: '출시알림신청',
    buttonColor: 'bg-[#CACCFC]',
  },
];

const EmptyCard = () => {
  // API로 가져오는 게 아니라 정해진 데이터를 보여주는 카드
  return (
    <>
      {emptyList.map((program) => (
        <div
          onClick={() => window.open(program.link, '_blank')}
          className="flex flex-col overflow-hidden rounded-xs"
        >
          <img
            className="h-32 object-cover"
            src={program.thumbnail}
            alt="프로그램 썸네일 배경"
          />
          <div className="flex flex-col gap-2 py-2">
            <h2 className="text-1-semibold">{program.title}</h2>
            <p className="text-0.875 max-h-11 overflow-hidden text-neutral-30">
              {program.desc}
            </p>
            <button
              className={`text-0.875-medium rounded-sm border border-neutral-0 bg-point px-4 py-1.5 ${program.buttonColor}`}
            >
              {program.buttonCaption}
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default EmptyCard;
