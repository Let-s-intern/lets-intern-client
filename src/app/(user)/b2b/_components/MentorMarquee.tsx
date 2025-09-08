'use client';

import Image, { StaticImageData } from 'next/image';

// Figure images
import figureFemale1 from '../_images/figure-female1.png';
import figureFemale2 from '../_images/figure-female2.png';
import figureFemale3 from '../_images/figure-female3.png';
import figureFemale4 from '../_images/figure-female4.png';
import figureFemale5 from '../_images/figure-female5.png';
import figureMale1 from '../_images/figure-male1.png';
import figureMale2 from '../_images/figure-male2.png';
import figureMale3 from '../_images/figure-male3.png';

// Company logos
import squareBCG from '../_images/square-BCG.png';
import squareCashnote from '../_images/square-cashnote.png';
import squareDB from '../_images/square-DB.png';
import squareHankookTire from '../_images/square-hankook-tire.png';
import squareHanwhaOcean from '../_images/square-hanwha-ocean.png';
import squareHD from '../_images/square-HD.png';
import squareHyundaiGroup from '../_images/square-hyundai-group.png';
import squareHyundaiMotor from '../_images/square-hyundai-motor.png';
import squareHyundaiRotem from '../_images/square-hyundai-rotem.png';
import squareLC from '../_images/square-LC.png';
import squareLgEnergy from '../_images/square-lg-energy.png';
import squareLG from '../_images/square-LG.png';
import squareMusinsa from '../_images/square-musinsa.png';
import squarePWC from '../_images/square-PWC.png';
import squareSamsung from '../_images/square-samsung.png';
import squareShinhan from '../_images/square-shinhan-financial.png';
import squareSKhynix from '../_images/square-SKhynix.png';
import squareSKInno from '../_images/square-SKInno.png';
import squareToss from '../_images/square-toss.png';
import squareUnivTomorrow from '../_images/square-univ-tomorrow.png';
import squareWrtn from '../_images/square-wrtn.png';

type Mentor = {
  name: string;
  role: string;
  company?: string;
  imageSrc?: string;
  figureImage?: StaticImageData;
  companyLogo?: StaticImageData;
};

const companyLogos: Record<string, any> = {
  렛츠커리어: squareLC,
  LG에너지솔루션: squareLgEnergy,
  신한투자증권: squareShinhan,
  HD현대일렉트릭: squareHD,
  기아차: squareHyundaiGroup,
  현대자동차: squareHyundaiMotor,
  SK이노베이션: squareSKInno,
  토스: squareToss,
  캐시노트: squareCashnote,
  BCG: squareBCG,
  현대코퍼레이션: squareHyundaiGroup,
  한국타이어: squareHankookTire,
  한화오션: squareHanwhaOcean,
  SK하이닉스: squareSKhynix,
  삼일PwC: squarePWC,
  대학내일: squareUnivTomorrow,
  뤼튼테크놀로지스: squareWrtn,
  현대로템: squareHyundaiRotem,
  무신사: squareMusinsa,
  삼성전자: squareSamsung,
  삼성바이오로직스: squareSamsung,
  LG디스플레이: squareLG,
  'DB Inc': squareDB,
};

const MENTORS: Mentor[] = [
  {
    name: '쥬디 멘토', // 여성
    role: 'CEO',
    company: '렛츠커리어',
    figureImage: figureFemale1,
    companyLogo: companyLogos['렛츠커리어'],
  },
  {
    name: '팀탐 멘토', // 남성
    role: 'COO',
    company: '렛츠커리어',
    figureImage: figureMale1,
    companyLogo: companyLogos['렛츠커리어'],
  },
  {
    name: '레오 멘토', // 남성
    role: 'CPO',
    company: '렛츠커리어',
    figureImage: figureMale2,
    companyLogo: companyLogos['렛츠커리어'],
  },
  {
    name: '소피아 멘토', // 여성
    company: 'LG에너지솔루션',
    role: '전략기획',
    figureImage: figureFemale2,
    companyLogo: companyLogos['LG에너지솔루션'],
  },
  {
    name: '크리스 멘토', // 남성
    company: '신한투자증권',
    role: '금융업, IB',
    figureImage: figureMale3,
    companyLogo: companyLogos['신한투자증권'],
  },
  {
    name: '브라이언 멘토', // 남성
    company: 'HD현대일렉트릭',
    role: '해외영업',
    figureImage: figureMale1,
    companyLogo: companyLogos['HD현대일렉트릭'],
  },
  {
    name: '우디 멘토', // 남성
    company: '기아차',
    role: '브랜드 마케팅',
    figureImage: figureMale2,
    companyLogo: companyLogos['기아차'],
  },
  {
    name: '헤일리 멘토', // 여성
    company: '현대자동차',
    role: '글로벌 커뮤니케이션',
    figureImage: figureFemale3,
    companyLogo: companyLogos['현대자동차'],
  },
  {
    name: '줄리아 멘토', // 여성
    company: '현대자동차',
    role: '상품 전략',
    figureImage: figureFemale4,
    companyLogo: companyLogos['현대자동차'],
  },
  {
    name: '이프쌤 멘토', // 여성
    company: 'SK이노베이션',
    role: '마케팅',
    figureImage: figureFemale5,
    companyLogo: companyLogos['SK이노베이션'],
  },
  {
    name: '휴고 멘토', // 남성
    company: '현대자동차',
    role: '상품 기획',
    figureImage: figureMale3,
    companyLogo: companyLogos['현대자동차'],
  },
  {
    name: '하이디 멘토', // 여성
    company: '토스',
    role: '세일즈',
    figureImage: figureFemale1,
    companyLogo: companyLogos['토스'],
  },
  {
    name: '이린 멘토', // 여성
    company: '캐시노트',
    role: '마케팅',
    figureImage: figureFemale2,
    companyLogo: companyLogos['캐시노트'],
  },
  {
    name: '벤자민 멘토', // 남성
    company: 'BCG',
    role: '컨설턴트',
    figureImage: figureMale1,
    companyLogo: companyLogos['BCG'],
  },
  {
    name: '유나 멘토', // 여성
    company: '현대코퍼레이션',
    role: 'PM',
    figureImage: figureFemale3,
    companyLogo: companyLogos['현대코퍼레이션'],
  },
  {
    name: '미니 멘토', // 여성
    company: '한국타이어',
    role: 'HR',
    figureImage: figureFemale4,
    companyLogo: companyLogos['한국타이어'],
  },
  {
    name: '세라 멘토', // 여성
    company: '한화오션',
    role: '해외영업',
    figureImage: figureFemale5,
    companyLogo: companyLogos['한화오션'],
  },
  {
    name: '쥬쌤 멘토', // 여성
    company: 'SK하이닉스',
    role: '영업마케팅',
    figureImage: figureFemale1,
    companyLogo: companyLogos['SK하이닉스'],
  },
  {
    name: '루크 멘토', // 남성
    company: '삼일PwC',
    role: 'ESG 컨설턴트',
    figureImage: figureMale2,
    companyLogo: companyLogos['삼일PwC'],
  },
  {
    name: '후추쌤 멘토', // 여성
    company: '대학내일',
    role: 'AE',
    figureImage: figureFemale2,
    companyLogo: companyLogos['대학내일'],
  },
  {
    name: '영 멘토', // 남성
    company: '뤼튼테크놀로지스',
    role: 'AI 개발',
    figureImage: figureMale3,
    companyLogo: companyLogos['뤼튼테크놀로지스'],
  },
  {
    name: '파도 멘토', // 남성
    company: '뤼튼테크놀로지스',
    role: '서비스 기획',
    figureImage: figureMale1,
    companyLogo: companyLogos['뤼튼테크놀로지스'],
  },
  {
    name: 'Seren 멘토', // 여성
    company: '현대로템',
    role: 'AI 데이터 사이언티스트',
    figureImage: figureFemale3,
    companyLogo: companyLogos['현대로템'],
  },
  {
    name: '도니 멘토', // 남성
    company: '무신사',
    role: '백엔드 개발자',
    figureImage: figureMale2,
    companyLogo: companyLogos['무신사'],
  },
  {
    name: '제이 멘토', // 남성
    company: '무신사',
    role: '백엔드 개발자',
    figureImage: figureMale3,
    companyLogo: companyLogos['무신사'],
  },
  {
    name: '찰스 멘토', // 남성
    company: '삼성전자',
    role: '반도체 엔지니어링',
    figureImage: figureMale1,
    companyLogo: companyLogos['삼성전자'],
  },
  {
    name: '머스캣 멘토', // 남성
    company: '삼성바이오로직스',
    role: '공정 엔지니어링',
    figureImage: figureMale2,
    companyLogo: companyLogos['삼성바이오로직스'],
  },
  {
    name: '길라잡이 멘토', // 여성
    company: 'LG디스플레이',
    role: 'AI 개발',
    figureImage: figureFemale4,
    companyLogo: companyLogos['LG디스플레이'],
  },
  {
    name: '루카 멘토', // 남성
    company: 'DB Inc',
    role: 'SW 엔지니어',
    figureImage: figureMale3,
    companyLogo: companyLogos['DB Inc'],
  },
  {
    name: '준 멘토', // 남성
    company: '현대자동차',
    role: 'IT 서비스 기획',
    figureImage: figureMale1,
    companyLogo: companyLogos['현대자동차'],
  },
];

function Row({
  reverse = false,
  mentors,
}: {
  reverse?: boolean;
  mentors: Mentor[];
}) {
  const items = [...mentors, ...mentors];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-4 ${reverse ? 'marquee-right' : 'marquee-left'}`}
      >
        {items.map((m, idx) => (
          <div
            key={`${m.name}-${idx}`}
            className="flex w-[280px] flex-none flex-col overflow-hidden rounded-sm border border-neutral-85 bg-white shadow-sm"
          >
            <div className="relative h-[160px] bg-neutral-95">
              {m.companyLogo && (
                <div className="rounded absolute left-2.5 top-2.5 h-[66px] w-[66px] overflow-hidden rounded-xs border bg-white">
                  <Image
                    src={m.companyLogo}
                    alt={`${m.company ?? ''} 로고`}
                    fill
                    className="object-contain p-1"
                  />
                </div>
              )}
              {m.figureImage && (
                <Image
                  src={m.figureImage}
                  alt={m.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-4 text-center">
              <div className="text-small20 font-semibold text-neutral-0">
                {m.name}
              </div>
              <div className="text-xsmall16 text-neutral-40">
                {m.company}
                {m.role ? `/${m.role}` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .marquee-left {
          animation: marquee-left 120s linear infinite;
        }
        .marquee-right {
          animation: marquee-right 120s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default function MentorMarquee() {
  const firstRowMentors = MENTORS.slice(0, 15); // 쥬디 멘토부터 유나 멘토까지
  const secondRowMentors = MENTORS.slice(15); // 미니 멘토부터 끝까지

  return (
    <div className="space-y-4">
      <Row mentors={firstRowMentors} />
      <Row mentors={secondRowMentors} reverse />
    </div>
  );
}
