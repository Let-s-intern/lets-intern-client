export type KakaoRoom = {
  id: string;
  name: string;
  hostLabel: string;
  subtitle: string;
  tags: string[];
  description: string;
  link: string;
  notice: string;
};

const KAKAO_JUDY_QNA_LINK = 'https://open.kakao.com/o/gMl9i82g';
const KAKAO_LEO_HARDSKILL_LINK = 'https://open.kakao.com/o/gn33Zw0h';

export const kakaoRooms: KakaoRoom[] = [
  {
    id: 'judy-qna',
    name: '쥬디의 취업 QNA방',
    hostLabel: '쥬디',
    subtitle: '매니저 쥬디 운영 · 겨울 취뽀 응원방',
    tags: ['취업 정보 공유', '무제한 Q&A', '동기부여'],
    description:
      '좋은 정보와 공고를 매일 공유하고, 취업 준비 관련 질문에 뭐든 답변드려요. 미루지 않도록 끝없는 동기부여도 함께요.',
    link: KAKAO_JUDY_QNA_LINK,
    notice: '입장 시 닉네임을 "이름_희망직무"로 변경해주세요',
  },
  {
    id: 'leo-hardskill',
    name: '레오 멘토의 하드스킬 QNA방',
    hostLabel: '레오',
    subtitle: '레오 멘토 운영 · 실무 기술 QNA',
    tags: ['SQL · GA4', '생성형 AI', '데이터 분석'],
    description:
      'SQL, GA4 같은 데이터 분석 툴부터 GPT·Claude 등 생성형 AI 활용, 데이터 분석 역량을 키우는 법까지 하드스킬 QNA를 진행해요.',
    link: KAKAO_LEO_HARDSKILL_LINK,
    notice: '하드스킬 관련 질문이라면 무엇이든 남겨주세요',
  },
];
