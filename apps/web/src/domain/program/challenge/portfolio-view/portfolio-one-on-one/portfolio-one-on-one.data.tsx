import benefitImg1 from '@/assets/benefit1.jpg';
import benefitImg2 from '@/assets/benefit2.jpg';
import benefitImg3 from '@/assets/benefit3.jpg';
import { Break } from '@/common/Break';
import { CardProps } from './Card';

export const tripleBenefits = [
  {
    title: '챌린지 수료시, 챌린지 3종 할인 쿠폰 제공',
    options: [
      '미션 80점 이상 완료 시 이력서, 자기소개서, 포트폴리오 완성 챌린지 할인 쿠폰 발급!\n(챌린지 3종 중 1회 적용 가능)',
    ],
    imgUrl: { src: '/images/benefit0.svg' },
  },
  {
    title: '온라인 대시보드',
    options: [
      `학습부터 미션 수행까지 올인원으로 관리할 수 있는 전용 대시보드`,
      `미션 현황과 기수별 주요 공지도 함께 열람할 수 있어 몰입감 UP!`,
    ],
    imgUrl: benefitImg1,
  },
  {
    title: '프로그램 수료증 발급',
    options: [
      `프로그램 종료 시, 참여자분들께 렛츠커리어에서 인증하는 참여 수료증을 발급해드립니다.`,
    ],
    imgUrl: benefitImg2,
  },
  {
    title: '네트워킹 파티',
    options: [
      `주니어 PM, 제조업 대기업 재직자 등이 포함된 커리어 선배들과의 온/오프라인 네트워킹 파티에 초대합니다.`,
    ],
    imgUrl: benefitImg3,
  },
];

export const getPortfolioList = (styles: CardProps['styles']): CardProps[] => [
  {
    order: 1,
    title: (
      <>
        포폴 만들면서 궁금했던 점<Break />
        멘토님과 바로 해결할 수 있어요!
      </>
    ),
    description: (
      <>
        기존 포폴에 대한 코멘트와 딱 맞춘
        <Break />
        개선 방안까지 멘토링에서 가져갈 수 있어요.
      </>
    ),

    imageUrl: {
      desktop: '/images/포폴-피드백-388-210.gif',
      mobile: '/images/포폴-피드백-388-210.gif',
    },
    styles,
  },
  {
    order: 2,
    title: '실제 합격 자료 예시도 함께 해요!',
    description: (
      <>
        내 포폴 상황에서 참고할 수 있는
        <Break />
        실제 합격 자료도 함께 다뤄요.
      </>
    ),
    imageUrl: {
      desktop: '/images/포폴-피드백(합격자료)-666-352.gif',
      mobile: '/images/포폴-피드백(합격자료)-666-352.gif',
    },
    styles,
  },
];
