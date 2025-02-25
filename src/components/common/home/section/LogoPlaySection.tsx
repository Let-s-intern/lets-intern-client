import MoreHeader from '@components/common/ui/MoreHeader';
import clsx from 'clsx';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const LOGO_THEME = {
  GREEN: '#DAF9DB',
  YELLOW: '#FFE8A0',
  BLUE: '#DFE6FF',
  RED: '#FFD5D9',
  RED_ORANGE: '#FFE1D4',
  LIGHT_BLUE: '#E0F7FF',
  MINT: '#DBF6F2',
  ORANGE: '#FFDBC3',
};

type LogoThemeType = keyof typeof LOGO_THEME;

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
};

type LogoImgType = keyof typeof LOGO_IMG;

interface LogoPlayItemProps {
  theme: LogoThemeType;
  img: LogoImgType;
  company: string;
  job: string;
  name: string;
  pass: string;
}

const LogoList: LogoPlayItemProps[] = [
  {
    theme: 'GREEN',
    img: 'NAVER_CLOUD',
    company: '네이버 클라우드',
    job: 'IT/데이터분석',
    name: '이**',
    pass: '2024',
  },
  {
    theme: 'YELLOW',
    img: 'KAKAO_MOBILITY',
    company: '카카오 모빌리티',
    job: '사업기획/서비스기획',
    name: '최**',
    pass: '2024',
  },
  {
    theme: 'BLUE',
    img: 'SAMSUNG_BIOLOGICS',
    company: '삼성 바이오로직스',
    job: '생산/엔지니어링',
    name: '안**',
    pass: '2024',
  },
  {
    theme: 'RED',
    img: 'LG',
    company: 'LG전자',
    job: '상품기획/MD',
    name: '윤**',
    pass: '2023',
  },
  {
    theme: 'GREEN',
    img: 'LINE',
    company: '라인',
    job: '인사/조직문화',
    name: '김**',
    pass: '2023',
  },
  {
    theme: 'RED_ORANGE',
    img: 'PWC',
    company: '삼일회계법인',
    job: '컨설팅/ESG',
    name: '류**',
    pass: '2023',
  },
  {
    theme: 'LIGHT_BLUE',
    img: 'MYREALTRIP',
    company: '마이리얼트립',
    job: '사업개발/전략',
    name: '고**',
    pass: '2024',
  },
  {
    theme: 'RED',
    img: 'LG_ENERGY',
    company: 'LG에너지솔루션',
    job: '해외영업/무역',
    name: '이**',
    pass: '2023',
  },
  {
    theme: 'MINT',
    img: 'HANA',
    company: '하나은행',
    job: '디자인',
    name: '이**',
    pass: '2024',
  },
  {
    theme: 'ORANGE',
    img: 'DAANGN',
    company: '당근',
    job: 'PM',
    name: '송**',
    pass: '2024',
  },
];

const LogoPlaySection = () => {
  return (
    <>
      <section className="mt-16 w-full max-w-[1160px] px-5 md:mt-36 xl:px-0">
        <div className="w-full">
          <MoreHeader isBig>
            <>
              렛츠커리어인들은 <br className="md:hidden" />
              어디서 커리어를 시작했을까요?
            </>
          </MoreHeader>
        </div>
        <Swiper
          className="slide-per-auto slide-rolling mt-6 md:mt-10"
          modules={[Autoplay]}
          freeMode
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
        'flex w-[218px] justify-between rounded-sm p-3 pb-4 md:w-80 md:p-5 md:pb-6',
      )}
      style={{
        backgroundColor: LOGO_THEME[props.theme],
      }}
    >
      <div className="flex flex-col text-neutral-0">
        <span className="text-xsmall16 font-semibold md:text-medium22">
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
