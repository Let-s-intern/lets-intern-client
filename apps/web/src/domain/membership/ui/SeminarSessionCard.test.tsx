import { render, screen } from '@testing-library/react';
import SeminarSessionCard from './SeminarSessionCard';
import { TBA_PLACEHOLDER, type SeminarSession } from '../data/seminar';

const confirmed: SeminarSession = {
  status: 'confirmed',
  sessionNo: '01',
  date: '6/28(토)',
  time: '오전 10:30',
  topic: '계획 함께 수립하기',
  mentor: { name: '닉', profile: '삼성바이오 현직' },
  ctaLabel: '세미나 신청하기',
  ctaHref: 'https://example.com/apply',
};

const tba: SeminarSession = {
  status: 'tba',
  sessionNo: '02',
  date: '7/4(금)',
  ctaLabel: '사전 알림 신청',
};

describe('SeminarSessionCard', () => {
  describe('confirmed 세션', () => {
    it('날짜·시간·주제·멘토 정보를 표시한다', () => {
      render(<SeminarSessionCard session={confirmed} />);
      expect(screen.getByText('6/28(토)')).toBeInTheDocument();
      expect(screen.getByText('오전 10:30')).toBeInTheDocument();
      expect(screen.getByText('계획 함께 수립하기')).toBeInTheDocument();
      // 멘토 이름은 이력 텍스트와 함께 노출(이니셜 폴백과 구분 위해 이력으로 검증).
      expect(screen.getByText('삼성바이오 현직')).toBeInTheDocument();
    });

    it('ctaHref 가 있으면 신규 탭 링크 CTA 를 렌더한다', () => {
      render(<SeminarSessionCard session={confirmed} />);
      const cta = screen.getByRole('link', { name: '세미나 신청하기' });
      expect(cta).toHaveAttribute('href', 'https://example.com/apply');
      expect(cta).toHaveAttribute('target', '_blank');
      expect(cta).toHaveAttribute('rel', 'noopener');
    });
  });

  describe('tba 세션', () => {
    it('시간·주제·멘토를 "추후 공개" placeholder 로 표시한다', () => {
      render(<SeminarSessionCard session={tba} />);
      expect(screen.getByText(TBA_PLACEHOLDER.time)).toBeInTheDocument();
      expect(screen.getByText(TBA_PLACEHOLDER.topic)).toBeInTheDocument();
      expect(screen.getByText(TBA_PLACEHOLDER.mentor)).toBeInTheDocument();
      expect(screen.getAllByText('추후 공개').length).toBeGreaterThan(0);
    });

    it('ctaHref 가 없으면 비활성 버튼 CTA 를 렌더한다', () => {
      render(<SeminarSessionCard session={tba} />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      const cta = screen.getByRole('button', { name: /사전 알림 신청/ });
      expect(cta).toBeDisabled();
    });
  });
});
