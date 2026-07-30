export interface MentorDetail {
  mentorId: string;
  name: string;
  company: string;
  position: string;
  profileImage: string;
  representativeInfo: {
    label: string;
    isActive: boolean;
  };
  companyInfo: {
    label: string;
  };
  bullets: string[];
  stats: {
    menteeCount: number;
    reviewCount: number;
    rating: number;
  };
  introComment: string;
}

export const DUMMY_MENTOR_DETAIL: MentorDetail = {
  mentorId: '1',
  name: '쥬디',
  company: '렛츠커리어',
  position: 'CEO',
  profileImage: '/images/marketing/profile2.png',
  representativeInfo: {
    label: '렛츠커리어 | 대표 멘토/컨설턴트 5년',
    isActive: true,
  },
  companyInfo: {
    label: '와이즐리컴퍼니 | Product Manager 3년',
  },
  bullets: [
    '당근, CJ푸드빌, 컬리, 패스트캠퍼스, 캐시워크 등 합격 이력 보유',
    '2,500명 규모 취준 QNA 특방 운영',
  ],
  stats: {
    menteeCount: 128,
    reviewCount: 42,
    rating: 5.0,
  },
  introComment:
    '렛츠커리어 CEO로서 3,000개 이상의 서류를 피드백하고, 채용 공고 분석과 현직자·합격자들과의 만남을 통해 취업 시장의 변화를 가까이에서 지켜봐 왔습니다.\n이번 세미나에서는 2026년 취업 시장 핵심 트렌드와 취준생들이 준비해야 할 전략을 정리해드립니다!',
};
