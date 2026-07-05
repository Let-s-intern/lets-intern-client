import benefitImg1 from '@/assets/benefit1.jpg';
import benefitImg2 from '@/assets/benefit2.jpg';
import { DifferentCardProps } from '@/domain/program/program-detail/different/DifferentCard';

type DifferentStyles = DifferentCardProps['styles'];

export const tripleBenefits = [
  {
    title: '챌린지 수료시, 챌린지 3종 할인 쿠폰 제공',
    options: [
      '미션 80점 이상 완료 시 자기소개서, 포트폴리오 완성, 면접 챌린지 등 할인 쿠폰 발급!\n(챌린지 3종 중 1회 적용 가능)',
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
];

export const getDifferentList = (
  isResumeTemplate: boolean,
  styles: DifferentStyles,
): DifferentCardProps[] =>
  isResumeTemplate
    ? [
        {
          order: 1,
          title: `취업 준비가 더 이상 막막하지 않도록\nA부터 Z까지 알려주는 학습 콘텐츠`,
          options: [
            '초보 취준생도 따라갈 수 있는 친절한 길라잡이',
            '합격자 예시를 포함하여 서류 작성 스킬 UP',
            '2025년 주요 기업/직무 합격 자료로 파악하는 채용 트렌드',
          ],
          imageUrl: {
            desktop: '/challenge-detail/different/desktop/contents_desktop.gif',
            mobile: '/challenge-detail/different/mobile/contents_mobile.gif',
          },
          styles,
        },
        {
          order: 2,
          title: `서류와 면접의 기초 베이스가 되어줄\n미션 템플릿으로 나만의 이력서 완성`,
          options: [
            '하루 30분, 경험 정리부터 이력서까지 완성하는 실습',
            '누구나 쉽게 채울 수 있는 노션 템플릿',
            '수료 후에도 자산으로 남는 경험 회고록',
          ],
          imageUrl: {
            desktop: '/challenge-detail/different/desktop/template_desktop.gif',
            mobile: '/challenge-detail/different/mobile/template_mobile.gif',
          },
          styles,
        },
        {
          order: 3,
          title: `함께라서 할 수 있어요.\n챌린지 참여자들과 함께 동기부여!`,
          options: [
            '취업 여정의 동료들과 함께 지치지 않고 완성해요.',
            '자유로운 커뮤니티를 통해 스터디 함께할 수 있어요.',
            '서류 작성을 통해 커리어 고민 함께 나눠요.',
          ],
          imageUrl: {
            desktop:
              '/challenge-detail/different/desktop/community_desktop.gif',
            mobile: '/challenge-detail/different/mobile/community_mobile.gif',
          },
          styles,
        },
      ]
    : [
        {
          order: 1,
          title: `취업 준비가 더 이상 막막하지 않도록\nA부터 Z까지 알려주는 학습 콘텐츠`,
          options: [
            '초보 취준생도 따라갈 수 있는 친절한 길라잡이',
            '합격자 예시를 포함하여 콘텐츠 이해도 UP',
            'PDF 30페이지 분량의 추가 콘텐츠 제공',
          ],
          imageUrl: {
            desktop: '/challenge-detail/different/desktop/contents_desktop.gif',
            mobile: '/challenge-detail/different/mobile/contents_mobile.gif',
          },
          styles,
        },
        {
          order: 2,
          title: `서류와 면접의 기초 베이스가 되어줄\n미션 템플릿으로 나만의 취업 가이드북 완성`,
          options: [
            '하루 30분, 서류를 완성하는 실습',
            '누구나 쉽게 채울 수 있는 노션 템플릿',
            '수료 후에도 자산으로 남는 취업 가이드북',
          ],
          imageUrl: {
            desktop: '/challenge-detail/different/desktop/template_desktop.gif',
            mobile: '/challenge-detail/different/mobile/template_mobile.gif',
          },
          styles,
        },
        {
          order: 3,
          title: `시간은 어느새 흐르고,\n혼자 하기 어렵다면 사람들과\n함께 공유하며 성장하는 동기부여 시스템`,
          options: [
            `사람들과 함께 공유하며 성장하는\n오픈 카톡 커뮤니티`,
            '미션 80점 이상 완료 시, 수료증 지급',
          ],
          imageUrl: {
            desktop:
              '/challenge-detail/different/desktop/community_desktop.gif',
            mobile: '/challenge-detail/different/mobile/community_mobile.gif',
          },
          styles,
        },
      ];
