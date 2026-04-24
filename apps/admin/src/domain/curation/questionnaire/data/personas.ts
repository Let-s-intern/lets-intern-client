import { Persona, PersonaId } from '@/types';

export const PERSONAS: Persona[] = [
  {
    id: 'starter',
    title: '경험 정리가 필요해요',
    description: '경험 소재부터 차곡차곡 정리하고 싶은 분',
  },
  {
    id: 'resume',
    title: '이력서부터 빠르게 완성하고 싶어요',
    description: '공고가 떴을 때 1주 안에 제출이 필요한 분',
  },
  {
    id: 'coverLetter',
    title: '자기소개서 작성에 어려움을 느껴요',
    description: '직무 분석과 스토리텔링이 필요한 분',
  },
  {
    id: 'portfolio',
    title: '포트폴리오 제작이 필요해요',
    description: '직무 맞춤 포트폴리오와 사례 정리가 필요한 분',
  },
  {
    id: 'specialized',
    title: '실제 지원 전에 서류를 완성하고 싶어요',
    description: '대기업·마케팅·HR 특화 트랙으로 서류를 완성하고 싶은 분',
  },
  {
    id: 'interview',
    title: '면접 준비가 필요해요',
    description: '모의면접과 현직자 특강으로 면접을 준비하고 싶은 분',
  },
  {
    id: 'dontKnow',
    title: '아직 저의 취준 단계를 잘 모르겠어요',
    description: '내 상황에 맞는 프로그램을 추천받고 싶어요',
  },
];

export const PERSONA_IDS = PERSONAS.map((persona) => persona.id) as PersonaId[];
