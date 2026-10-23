import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ChallengeContent } from '@/types/interface';

import ChallengeDescriptionTabs from '../ChallengeDescriptionTabs';
import { ChallengeVersionDraft } from '../ChallengeVersionSection';

// 무거운 lexical 편집기 대신 받은 본문과 수정 버튼만 둔다
vi.mock('../ChallengeVersionContentEditor', () => ({
  default: ({
    description,
    onChange,
  }: {
    description: string;
    onChange: (next: string) => void;
  }) => (
    <div>
      <div data-testid="version-content-editor">{description}</div>
      <button type="button" onClick={() => onChange('{"edited":true}')}>
        본문 수정
      </button>
    </div>
  ),
}));

const CHALLENGE_CONTENT = {
  initialized: true,
  curriculum: [],
} as unknown as ChallengeContent;
const CHALLENGE_DESC = JSON.stringify(CHALLENGE_CONTENT);

const draft = (
  title: string,
  description: string | null = null,
): ChallengeVersionDraft => ({
  challengeVersionId: null,
  title,
  programTitle: '',
  shortDesc: null,
  thumbnail: '',
  desktopThumbnail: null,
  description,
});

const COMMON = <div data-testid="common-editor">공통 편집부</div>;

function Harness({ initial }: { initial: ChallengeVersionDraft[] }) {
  const [versions, setVersions] = useState(initial);
  return (
    <>
      <ChallengeDescriptionTabs
        versions={versions}
        onChangeVersionDescription={(index, description) =>
          setVersions((prev) =>
            prev.map((v, i) => (i === index ? { ...v, description } : v)),
          )
        }
        challengeContent={CHALLENGE_CONTENT}
      >
        {COMMON}
      </ChallengeDescriptionTabs>
      <output data-testid="descriptions">
        {JSON.stringify(versions.map((v) => v.description))}
      </output>
    </>
  );
}

const descriptions = () =>
  JSON.parse(screen.getByTestId('descriptions').textContent ?? '[]');

describe('ChallengeDescriptionTabs', () => {
  it('버전이 없으면 탭 없이 챌린지 본문 편집부를 그대로 보여준다', () => {
    render(<Harness initial={[]} />);

    expect(screen.getByTestId('common-editor')).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('버전이 있으면 기본 탭과 버전마다 탭을 두고, 처음에는 첫 버전을 연다', () => {
    render(<Harness initial={[draft('대학생'), draft('', '{"v":2}')]} />);

    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual([
      '기본 (버전 설정 시 비노출)',
      '대학생 (작성 전)',
      '2번 버전',
    ]);
    expect(screen.queryByTestId('common-editor')).not.toBeInTheDocument();
    expect(screen.getByTestId('version-content-editor')).toBeInTheDocument();
  });

  it('기본 탭을 누르면 챌린지 본문 편집부를 폼 원본으로 보여준다', () => {
    render(<Harness initial={[draft('대학생')]} />);

    fireEvent.click(
      screen.getByRole('tab', { name: '기본 (버전 설정 시 비노출)' }),
    );

    expect(screen.getByTestId('common-editor')).toBeInTheDocument();
    expect(
      screen.queryByTestId('version-content-editor'),
    ).not.toBeInTheDocument();
  });

  it('작성 전인 버전은 챌린지 본문으로 시작하고, 고치기 전에는 값을 바꾸지 않는다', () => {
    render(<Harness initial={[draft('대학생')]} />);

    expect(screen.getByTestId('version-content-editor')).toHaveTextContent(
      CHALLENGE_DESC,
    );
    expect(descriptions()).toEqual([null]);
  });

  it('고치면 그 버전 설명으로 저장하고 작성 전 표시가 사라진다', () => {
    render(<Harness initial={[draft('대학생'), draft('경력자')]} />);

    fireEvent.click(screen.getByRole('button', { name: '본문 수정' }));

    expect(descriptions()).toEqual(['{"edited":true}', null]);
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual([
      '기본 (버전 설정 시 비노출)',
      '대학생',
      '경력자 (작성 전)',
    ]);
  });

  it('탭을 바꾸면 그 버전 설명을 편집한다', () => {
    render(
      <Harness
        initial={[draft('대학생', '{"v":1}'), draft('경력자', '{"v":2}')]}
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: '경력자' }));

    expect(screen.getByTestId('version-content-editor')).toHaveTextContent(
      '{"v":2}',
    );
    fireEvent.click(screen.getByRole('button', { name: '본문 수정' }));
    expect(descriptions()).toEqual(['{"v":1}', '{"edited":true}']);
  });

  it('고정 줄의 탭이 지금 편집 중인 버전을 선택 상태로 보여준다', () => {
    render(<Harness initial={[draft('대학생'), draft('경력자')]} />);

    expect(
      screen.getByRole('tab', { name: '대학생 (작성 전)' }),
    ).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getByRole('tab', { name: '경력자 (작성 전)' }));
    expect(
      screen.getByRole('tab', { name: '경력자 (작성 전)' }),
    ).toHaveAttribute('aria-selected', 'true');
  });
});
