import { Persona, PersonaId } from '../types/types';

export const PERSONAS: Persona[] = [
  {
    id: 'starter',
    title: '취준 입문 · 경험 정리가 먼저',
    description: '경험 소재부터 차곡차곡 정리하고 싶은 분',
  },
  {
    id: 'resume',
    title: '이력서부터 빠르게 완성',
    description: '공고가 떴을 때 1주 안에 제출이 필요한 분',
  },
  {
    id: 'coverLetter',
    title: '자기소개서/지원동기 강화',
    description: '직무 분석과 스토리텔링이 필요한 분',
  },
  {
    id: 'portfolio',
    title: '포트폴리오/직무 자료 준비',
    description: '직무 맞춤 포트폴리오와 사례 정리가 필요한 분',
  },
  {
    id: 'specialized',
    title: '특화 트랙(대기업 · 마케팅 · HR)',
    description: '현직자 특강과 심화 피드백을 원하는 분',
  },
  {
    id: 'dontKnow',
    title: '잘 모르겠어요',
    description: '내 상황에 맞는 프로그램을 추천받고 싶어요',
  },
];

export const PERSONA_IDS = PERSONAS.map((persona) => persona.id) as PersonaId[];
