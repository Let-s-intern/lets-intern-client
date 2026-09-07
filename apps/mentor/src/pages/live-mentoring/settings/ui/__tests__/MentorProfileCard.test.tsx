import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { TemplateIntro } from '@/api/live-mentoring/liveMentoringSchema';

import MentorProfileCard from '../MentorProfileCard';

/**
 * 프로필의 "상세페이지 제작" 본문. 서버 `description` 에 이 모양 그대로 담겨 온다.
 * 한 줄 소개가 아니라 Lexical 에디터가 저장한 JSON 문자열이다.
 */
const LEXICAL_JSON = JSON.stringify({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: '테스트입니다.',
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

const intro = (overrides: Partial<TemplateIntro> = {}): TemplateIntro => ({
  passedCount: null,
  nickname: '레오',
  profileImage: null,
  affiliation: '렛츠커리어 | 서비스 기획자',
  careerLines: ['(현) 렛츠커리어 · 서비스 기획자'],
  oneLiner: '',
  description: LEXICAL_JSON,
  ...overrides,
});

describe('MentorProfileCard', () => {
  /*
    소속 줄에 description 을 먼저 쓰던 때가 있었다. 그 필드는 자유 문구가 아니라
    Lexical JSON 이라 `{"root":{"children":[...` 가 화면에 통째로 노출됐다(LC-3258).
  */
  it('description(Lexical JSON)을 화면에 그대로 찍지 않는다', () => {
    const { container } = render(<MentorProfileCard intro={intro()} />);

    expect(container.textContent).not.toContain('{"root"');
    expect(container.textContent).not.toContain('"type":"paragraph"');
  });

  it('소속 줄은 서버가 대표 경력에서 만든 affiliation 을 쓴다', () => {
    render(<MentorProfileCard intro={intro()} />);

    expect(screen.getByText('렛츠커리어 | 서비스 기획자')).toBeInTheDocument();
  });

  // description 이 차 있어도 affiliation 이 비면 그 줄은 아예 그리지 않는다.
  it('affiliation 이 비면 소속 줄을 그리지 않는다', () => {
    const { container } = render(
      <MentorProfileCard intro={intro({ affiliation: '   ' })} />,
    );

    expect(container.textContent).not.toContain('{"root"');
    expect(screen.getByText('레오')).toBeInTheDocument();
  });
});
