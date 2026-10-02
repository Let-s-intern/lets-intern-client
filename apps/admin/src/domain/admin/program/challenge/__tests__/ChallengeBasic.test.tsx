import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ChallengeBasic from '../ChallengeBasic';

const NOTICE = '버전이 있으면 목록·상세에는 버전의 노출 제목이 보입니다';

describe('ChallengeBasic 버전 안내', () => {
  it('버전이 있으면 제목 아래에 안내를 붙인다', () => {
    render(<ChallengeBasic setInput={() => {}} hasVersions />);

    expect(screen.getByText(NOTICE)).toBeInTheDocument();
  });

  it('버전이 없으면 안내가 없다', () => {
    render(<ChallengeBasic setInput={() => {}} />);

    expect(screen.queryByText(NOTICE)).not.toBeInTheDocument();
  });

  it('기존 대괄호 안내 placeholder 는 그대로다', () => {
    render(<ChallengeBasic setInput={() => {}} hasVersions />);

    expect(
      screen.getByPlaceholderText(
        '제목을 입력해주세요 (맨 앞 [ ]는 버전 태그로 표시)',
      ),
    ).toBeInTheDocument();
  });
});
