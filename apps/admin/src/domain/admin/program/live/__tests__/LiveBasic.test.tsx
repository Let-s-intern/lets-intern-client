import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LiveBasic from '../LiveBasic';

/**
 * PRD-서면라이브 분리 §5.2 — LiveBasic 의 type prop 분기 검증.
 *
 * - LIVE (default): progressType / place 노출
 * - SEOMYEON: progressType / place 숨김
 */
describe('LiveBasic — type prop 분기', () => {
  const baseProps = {
    defaultValue: {
      adminClassificationInfo: null,
      classificationInfo: null,
      job: '',
      title: '',
      shortDesc: '',
      participationCount: 0,
      progressType: null,
      place: '',
    },
    setInput: () => {},
  } as const;

  it('type=LIVE (default) 일 때 진행방식/장소 필드를 렌더한다', () => {
    render(<LiveBasic {...baseProps} />);

    expect(screen.getByLabelText('온/오프라인 여부')).toBeInTheDocument();
    expect(screen.getByLabelText('장소 (오프라인일 경우)')).toBeInTheDocument();
  });

  it('type=SEOMYEON 일 때 진행방식/장소 필드를 숨긴다', () => {
    render(<LiveBasic {...baseProps} type="SEOMYEON" />);

    expect(screen.queryByLabelText('온/오프라인 여부')).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('장소 (오프라인일 경우)'),
    ).not.toBeInTheDocument();
  });

  it('type 분기와 무관하게 공통 필드(제목/한줄설명/정원/직무)는 렌더한다', () => {
    const { rerender } = render(<LiveBasic {...baseProps} />);
    expect(screen.getByLabelText('제목')).toBeInTheDocument();
    expect(screen.getByLabelText('한 줄 설명')).toBeInTheDocument();
    expect(screen.getByLabelText('정원')).toBeInTheDocument();

    rerender(<LiveBasic {...baseProps} type="SEOMYEON" />);
    expect(screen.getByLabelText('제목')).toBeInTheDocument();
    expect(screen.getByLabelText('한 줄 설명')).toBeInTheDocument();
    expect(screen.getByLabelText('정원')).toBeInTheDocument();
  });
});
