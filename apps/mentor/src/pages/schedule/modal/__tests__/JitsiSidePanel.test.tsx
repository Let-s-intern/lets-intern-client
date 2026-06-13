import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import JitsiSidePanel from '../JitsiSidePanel';

const NOTION_URL =
  'https://workspace.notion.site/abcdef1234567890abcdef1234567890';
const EXTERNAL_URL = 'https://example.com/submission/1';

describe('JitsiSidePanel', () => {
  it('preQuestion 이 있으면 사전 Q&A 영역을 렌더한다', () => {
    render(
      <JitsiSidePanel
        preQuestion="자기소개서 피드백을 받고 싶습니다."
        menteeName="이지수"
      />,
    );
    expect(screen.getByText('사전 Q&A')).toBeInTheDocument();
    expect(
      screen.getByText('자기소개서 피드백을 받고 싶습니다.'),
    ).toBeInTheDocument();
  });

  it('preQuestion 이 없으면 사전 Q&A 영역을 렌더하지 않는다', () => {
    render(<JitsiSidePanel menteeName="이지수" />);
    expect(screen.queryByText('사전 Q&A')).not.toBeInTheDocument();
  });

  it('노션 URL 이면 제출물 임베드(iframe)를 렌더한다', () => {
    render(<JitsiSidePanel submissionUrl={NOTION_URL} menteeName="이지수" />);
    // MenteeLinkPanel 재사용 — 헤더 "이지수 님의 제출물" + iframe
    expect(screen.getByText('이지수 님의 제출물')).toBeInTheDocument();
    expect(screen.getByTitle('이지수 제출물').tagName.toLowerCase()).toBe(
      'iframe',
    );
  });

  it('노션이 아닌 제출물 URL 이면 "새 탭에서 열기" 외부 링크를 렌더한다', () => {
    render(<JitsiSidePanel submissionUrl={EXTERNAL_URL} menteeName="이지수" />);
    const link = screen.getByRole('link', { name: '새 탭에서 열기' });
    expect(link).toHaveAttribute('href', EXTERNAL_URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('제출물이 없으면 빈 상태 안내를 렌더한다', () => {
    render(<JitsiSidePanel menteeName="이지수" />);
    expect(screen.getByText('제출물이 없습니다')).toBeInTheDocument();
  });
});
