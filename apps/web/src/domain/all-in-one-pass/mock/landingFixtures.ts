// 랜딩 mock (공개 API 전까지). discount=할인액, 최종가 = price - discount.
import type { LandingDescription } from '../landing/landingContent';
import type { AllInOnePassLanding } from '../types';

/** mock용 최소 렉시컬 상태(단락 1개) */
const lexical = (text: string): string =>
  JSON.stringify({
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });

const landingDescription: LandingDescription = {
  hero: {
    title: '취업, 하나의 패스로 끝내세요. 취업, 하나의 패스로 끝내세요.',
    description:
      '챌린지부터 가이드북·VOD·라이브까지, 취업 준비 전 과정을 하나로. 챌린지부터 가이드북·VOD·라이브까지, 취업 준비 전 과정을 하나로. 챌린지부터 가이드북·VOD·라이브까지, 취업 준비 전 과정을 하나로.',
    recruitFootnote: '마감 후 다음 기회는 2027 상반기 예정이에요.',
  },
  lexical: {
    introSection: lexical('introSection 렉시컬 들어갈 자리'),
    playbookSection: lexical('playbook 렉시컬 들어갈 자리'),
    benefitSection: lexical('혜택 섹션 상단 렉시컬 들어갈 자리'),
    reviewSection: lexical('혜택 섹션 하단 렉시컬 들어갈 자리'),
  },
  additionalBenefits: [
    {
      name: '10주 취준 플레이북',
      description: '주차별 취준 로드맵',
      iconKey: 'playbook',
    },
  ],
  reviews: [
    {
      source: '인스타그램 DM',
      resultTags: ['서류 합격', '최종 합격'],
      imageUrl: '',
      summary: '자소서 첨삭 덕분에 서류 통과율이 확 올랐어요!',
    },
    {
      source: '카카오톡 오픈채팅',
      resultTags: ['인턴 합격'],
      imageUrl: '',
      summary: '현직자 멘토링으로 면접 준비를 제대로 했습니다.',
    },
    {
      source: '챌린지 커뮤니티',
      resultTags: ['취준 루틴', '동기부여'],
      imageUrl: '',
      summary: '매일 함께 인증하니 취준 루틴이 잡혔어요.',
    },
  ],
  finalCta: {
    title: '지금 시작하면, 다음 시즌엔 합격 후기의 주인공',
    description: '선착순 마감 전에 올인원패스로 시작하세요.',
  },
};

export const landingFixture: AllInOnePassLanding = {
  id: 9,
  title: '2026 하반기 취업 올인원패스',
  introduction:
    '챌린지부터 가이드북·VOD·라이브 클래스까지, 취업 준비 전 과정을 하나로.',
  landingDescription: JSON.stringify(landingDescription),
  thumbnail: null,
  beginning: '2026-10-01T00:00:00',
  deadline: '2026-11-30T23:59:59',
  periodDays: 180,
  plans: [
    {
      id: 1,
      title: '올인원 플랜',
      description: '챌린지·가이드북·VOD·라이브 클래스 전체 무제한',
      price: 790000,
      discount: 200000,
      privileges: [
        { programType: 'CHALLENGE', privilegeType: 'ALL_IN_ONE' },
        { programType: 'GUIDEBOOK', privilegeType: 'ALL_IN_ONE' },
        { programType: 'VOD', privilegeType: 'ALL_IN_ONE' },
        { programType: 'LIVE', privilegeType: 'ALL_IN_ONE' },
      ],
    },
    {
      id: 2,
      title: '라이트 플랜',
      description: '챌린지·가이드북 무제한',
      price: 390000,
      discount: 100000,
      privileges: [
        { programType: 'CHALLENGE', privilegeType: 'ALL_IN_ONE' },
        { programType: 'GUIDEBOOK', privilegeType: 'ALL_IN_ONE' },
      ],
    },
  ],
  faqs: [
    {
      id: 101,
      category: '이용 안내',
      question: '패스 이용 기간은 어떻게 되나요?',
      answer: '구매일로부터 180일간 모든 플랜 프로그램을 이용할 수 있습니다.',
    },
    {
      id: 102,
      category: '이용 안내',
      question: '플랜은 구매 후 변경할 수 있나요?',
      answer:
        '결제한 플랜은 변경이 어려우며, 상위 플랜은 별도 문의가 필요합니다.',
    },
    {
      id: 103,
      category: '환불',
      question: '환불 규정이 궁금해요.',
      answer:
        '이용 시작 전 전액 환불이 가능하며, 이용 시작 후에는 환불 규정에 따릅니다.',
    },
  ],
};
