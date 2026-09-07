import type { LiveMentoringCareer } from '@/api/live-mentoring/liveMentoringSchema';
import { painJobLabel } from './DetailPainSection';

function career(
  position: string,
  visible = true,
  company = '렛츠커리어',
): LiveMentoringCareer {
  return { company, position, period: '2020-2026', visible };
}

describe('painJobLabel', () => {
  it('경력이 없으면 문장을 자연스럽게 닫는 기본값을 쓴다', () => {
    expect(painJobLabel([])).toBe('원하는');
  });

  it('첫 공개 경력의 직무를 쓴다', () => {
    expect(painJobLabel([career('서비스 기획자')])).toBe('서비스 기획자');
  });

  it('비공개 경력은 건너뛴다', () => {
    expect(
      painJobLabel([career('숨긴 직무', false), career('데이터 분석가')]),
    ).toBe('데이터 분석가');
  });

  it('공백뿐인 직무는 건너뛴다', () => {
    expect(painJobLabel([career('   '), career('백엔드 개발자')])).toBe(
      '백엔드 개발자',
    );
  });

  it('공개 경력이 하나도 없으면 기본값으로 돌아간다', () => {
    expect(painJobLabel([career('숨긴 직무', false)])).toBe('원하는');
  });

  it('앞뒤 공백은 떼고 쓴다', () => {
    expect(painJobLabel([career('  마케터  ')])).toBe('마케터');
  });
});
