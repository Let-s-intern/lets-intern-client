import MoreHeader from '@components/common/ui/MoreHeader';
import clsx from 'clsx';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const LOGO_IMG = {
  DAANGN: '/images/home/company/daangn.png',
  HANA: '/images/home/company/hana.png',
  KAKAO_MOBILITY: '/images/home/company/kakao-mobility.png',
  LG_ENERGY: '/images/home/company/lg-energy.png',
  LG: '/images/home/company/lg.png',
  LINE: '/images/home/company/line.png',
  MYREALTRIP: '/images/home/company/myrealtrip.png',
  NAVER_CLOUD: '/images/home/company/naver-cloud.png',
  PWC: '/images/home/company/pwc.png',
  SAMSUNG_BIOLOGICS: '/images/home/company/samsung-biologics.png',
  HYBE: '/images/home/company/hybe.png',
  HYUNDAI_AUTOEVER: '/images/home/company/hyundai-autoever.png',
  NAVER_WEBTOON: '/images/home/company/naver-webtoon.png',
  BINGRAE: '/images/home/company/bingrae.png',
  BAT: '/images/home/company/bat.png',
  SPARTA: '/images/home/company/sparta.png',
  POSCO: '/images/home/company/posco.png',
  HD: '/images/home/company/hd.png',
  K_WATER: '/images/home/company/k-water.png',
  CATCH_TABLE: '/images/home/company/catch-table.png',
};

type LogoImgType = keyof typeof LOGO_IMG;

interface LogoPlayItemProps {
  theme: string;
  img: LogoImgType;
  company: string;
  job: string;
  name: string;
  pass: string;
}

const LogoList: LogoPlayItemProps[] = [
  {
    theme: '#DAF9DB',
    img: 'NAVER_CLOUD',
    company: '네이버 클라우드',
    job: 'IT/데이터분석',
    name: '이**',
    pass: '2024',
  },
  {
    theme: '#FFE8A0',
    img: 'KAKAO_MOBILITY',
    company: '카카오 모빌리티',
    job: '사업기획/서비스기획',
    name: '최**',
    pass: '2024',
  },
  {
    theme: '#FFDED4',
    img: 'CATCH_TABLE',
    company: '캐치테이블',
    job: '데이터분석',
    name: '이**',
    pass: '2023',
  },
  {
    theme: '#DFE6FF',
    img: 'SAMSUNG_BIOLOGICS',
    company: '삼성 바이오로직스',
    job: '생산/엔지니어링',
    name: '안**',
    pass: '2024',
  },
  {
    theme: '#FFD5D9',
    img: 'LG',
    company: 'LG전자',
    job: '상품기획/MD',
    name: '윤**',
    pass: '2023',
  },
  {
    theme: '#DAF9DB',
    img: 'LINE',
    company: '라인',
    job: '인사/조직문화',
    name: '김**',
    pass: '2023',
  },
  {
    theme: '#FFE1D4',
    img: 'PWC',
    company: '삼일회계법인',
    job: '컨설팅/ESG',
    name: '류**',
    pass: '2023',
  },
  {
    theme: '#E0F7FF',
    img: 'MYREALTRIP',
    company: '마이리얼트립',
    job: '사업개발/전략',
    name: '고**',
    pass: '2024',
  },
  {
    theme: '#FFD5D9',
    img: 'LG_ENERGY',
    company: 'LG에너지솔루션',
    job: '해외영업/무역',
    name: '이**',
    pass: '2023',
  },
  {
    theme: '#DBF6F2',
    img: 'HANA',
    company: '하나은행',
    job: '디자인',
    name: '이**',
    pass: '2024',
  },
  {
    theme: '#FFDBC3',
    img: 'DAANGN',
    company: '당근',
    job: 'PM',
    name: '송**',
    pass: '2024',
  },
  {
    theme: '#FCFFC1',
    img: 'HYBE',
    company: '하이브',
    job: '콘텐츠/미디어',
    name: '배**',
    pass: '2023',
  },
  {
    theme: '#DAECFF',
    img: 'HYUNDAI_AUTOEVER',
    company: '현대오토에버',
    job: 'IT/컨설팅',
    name: '류**',
    pass: '2023',
  },
  {
    theme: '#DAF9DB',
    img: 'NAVER_WEBTOON',
    company: '네이버웹툰',
    job: '글로벌사업/운영',
    name: '이**',
    pass: '2023',
  },
  {
    theme: '#FFD8D7',
    img: 'BINGRAE',
    company: '빙그레',
    job: '영업',
    name: '정*',
    pass: '2024',
  },
  {
    theme: '#D8E1FF',
    img: 'BAT',
    company: 'BAT',
    job: '마케팅/광고',
    name: '최**',
    pass: '2023',
  },
  {
    theme: '#FFD4DA',
    img: 'SPARTA',
    company: '팀스파르타',
    job: '마케팅/광고',
    name: '위**',
    pass: '2023',
  },
  {
    theme: '#DDF2FF',
    img: 'POSCO',
    company: '포스코',
    job: '마케팅/광고',
    name: '이**',
    pass: '2023',
  },
  {
    theme: '#D7FFD5',
    img: 'HD',
    company: 'HD현대마린솔루션테크',
    job: '재무/회계',
    name: '이**',
    pass: '2023',
  },
  {
    theme: '#D7F1FF',
    img: 'K_WATER',
    company: '한국수자원공사',
    job: '환경/공공기관',
    name: '진**',
    pass: '2023',
  },
];

const LogoPlaySection = () => {
  return (
    <>
      <section className="mt-16 w-full max-w-[1120px] px-5 md:mt-28 xl:px-0">
        <div className="w-full">
          <MoreHeader
            isBig
            gaText="렛츠커리어인들은 어디서 커리어를 시작했을까요?"
          >
            <>
              렛츠커리어인들은 <br className="md:hidden" />
              어디서 커리어를 시작했을까요?
            </>
          </MoreHeader>
        </div>
        <Swiper
          className="slide-per-auto slide-rolling mt-6 md:mt-10"
          modules={[Autoplay]}
          allowTouchMove={false}
          loop
          spaceBetween={12}
          slidesPerView={'auto'}
          autoplay={{ delay: 1 }}
          speed={5000}
          breakpoints={{
            768: {
              spaceBetween: 20,
            },
          }}
        >
          {LogoList.map((logo, index) => (
            <SwiperSlide key={'logo' + index}>
              <LogoPlayItem key={index} {...logo} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
};

export default LogoPlaySection;

const LogoPlayItem = (props: LogoPlayItemProps) => {
  return (
    <div
      className={clsx(
        'flex w-[218px] select-none justify-between rounded-sm p-3 pb-4 md:w-80 md:p-5 md:pb-6',
      )}
      style={{
        backgroundColor: props.theme,
      }}
    >
      <div className="flex flex-col text-neutral-0">
        <span className="text-xsmall14 font-semibold md:text-medium22">
          {props.company}
        </span>
        <span className="mt-3 text-xsmall16 font-medium md:mt-6 md:text-small20">
          {props.job}
        </span>
        <span className="mt-1 text-xsmall14 font-medium md:text-xsmall16">
          <span>{props.name}</span>
          <span className="ml-3">{props.pass} 합격</span>
        </span>
      </div>
      <img
        src={LOGO_IMG[props.img]}
        className="h-[50px] w-[50px] overflow-hidden rounded-sm object-cover md:h-[72px] md:w-[72px]"
        alt={props.company}
      />
    </div>
  );
};
