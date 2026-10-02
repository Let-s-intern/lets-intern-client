import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ChallengeContent } from '@/types/interface';

import ChallengeVersionSection, {
  ChallengeVersionDraft,
} from '../ChallengeVersionSection';

const { uploadFile } = vi.hoisted(() => ({ uploadFile: vi.fn() }));

vi.mock('@/api/file', () => ({
  fileType: { enum: { CHALLENGE: 'CHALLENGE' } },
  uploadFile,
}));

// 무거운 lexical 편집기 대신 받은 본문만 보여준다
vi.mock('../ChallengeVersionContentEditor', () => ({
  default: ({ description }: { description: string }) => (
    <div data-testid="version-content-editor">{description}</div>
  ),
}));

const CHALLENGE_CONTENT = {
  initialized: true,
  curriculum: [],
} as unknown as ChallengeContent;
const CHALLENGE_DESC = JSON.stringify(CHALLENGE_CONTENT);

const draft = (
  challengeVersionId: number | null,
  title: string,
): ChallengeVersionDraft => ({
  challengeVersionId,
  title,
  programTitle: '',
  shortDesc: null,
  thumbnail: '',
  desktopThumbnail: null,
  description: null,
});

const versions: ChallengeVersionDraft[] = [
  draft(1, '대학생'),
  draft(2, '인턴 경력'),
  draft(null, '이직자'),
];

const renderSection = (initial: ChallengeVersionDraft[] = versions) => {
  const onChange = vi.fn();
  render(
    <ChallengeVersionSection
      versions={initial}
      onChange={onChange}
      challengeContent={CHALLENGE_CONTENT}
    />,
  );
  return onChange;
};

/** 펼침 상태가 목록 변경을 따라가는지 보려면 실제로 목록이 바뀌어야 한다 */
function Harness({ initial }: { initial: ChallengeVersionDraft[] }) {
  const [list, setList] = useState(initial);
  return (
    <ChallengeVersionSection
      versions={list}
      onChange={setList}
      challengeContent={CHALLENGE_CONTENT}
    />
  );
}

const expandButton = (order: number) =>
  screen.getByRole('button', {
    name: new RegExp(`^${order}번 버전 (펼치기|접기)$`),
  });

describe('ChallengeVersionSection', () => {
  it('섹션 설명을 보여준다', () => {
    renderSection([]);

    expect(
      screen.getByText(
        '버전이 없으면 모든 참여자가 같은 자료를 봅니다. 참여자는 신청할 때 버전을 하나 고릅니다.',
      ),
    ).toBeInTheDocument();
  });

  it('버전 추가를 누르면 id 가 null 인 빈 버전을 끝에 붙인다', () => {
    const onChange = renderSection();

    fireEvent.click(screen.getByRole('button', { name: '버전 추가' }));

    expect(onChange).toHaveBeenCalledWith([...versions, draft(null, '')]);
  });

  it('제목을 입력하면 그 행의 제목만 바꾼다', () => {
    const onChange = renderSection();

    fireEvent.change(screen.getAllByLabelText('버전 제목')[1], {
      target: { value: '직장인' },
    });

    expect(onChange).toHaveBeenCalledWith([
      versions[0],
      draft(2, '직장인'),
      versions[2],
    ]);
  });

  it('제목 입력은 50자로 제한한다', () => {
    renderSection();

    expect(screen.getAllByLabelText('버전 제목')[0]).toHaveAttribute(
      'maxlength',
      '50',
    );
  });

  it('위로 이동하면 바로 위 행과 자리를 바꾼다', () => {
    const onChange = renderSection();

    fireEvent.click(screen.getByRole('button', { name: '2번 버전 위로 이동' }));

    expect(onChange).toHaveBeenCalledWith([
      versions[1],
      versions[0],
      versions[2],
    ]);
  });

  it('아래로 이동하면 바로 아래 행과 자리를 바꾼다', () => {
    const onChange = renderSection();

    fireEvent.click(
      screen.getByRole('button', { name: '2번 버전 아래로 이동' }),
    );

    expect(onChange).toHaveBeenCalledWith([
      versions[0],
      versions[2],
      versions[1],
    ]);
  });

  it('첫 행은 위로, 마지막 행은 아래로 이동할 수 없다', () => {
    renderSection();

    expect(
      screen.getByRole('button', { name: '1번 버전 위로 이동' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: '3번 버전 아래로 이동' }),
    ).toBeDisabled();
  });

  it('삭제하면 그 행을 뺀 목록을 넘긴다', () => {
    const onChange = renderSection();

    fireEvent.click(screen.getByRole('button', { name: '1번 버전 삭제' }));

    expect(onChange).toHaveBeenCalledWith([versions[1], versions[2]]);
  });

  it('제목이 비었거나 공백뿐인 행에만 에러를 표시한다', () => {
    renderSection([draft(1, '대학생'), draft(null, ''), draft(null, '   ')]);

    const inputs = screen.getAllByLabelText('버전 제목');
    expect(inputs[0]).not.toHaveAttribute('aria-invalid', 'true');
    expect(inputs[1]).toHaveAttribute('aria-invalid', 'true');
    expect(inputs[2]).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getAllByText('버전 제목을 입력해주세요.')).toHaveLength(2);
  });

  describe('노출 정보 카드', () => {
    it('처음에는 모두 접혀 있고 노출 입력란이 없다', () => {
      renderSection();

      expect(screen.queryByLabelText('노출 제목')).not.toBeInTheDocument();
      expect(expandButton(1)).toHaveAttribute('aria-expanded', 'false');
    });

    it('펼친 카드 하나만 노출 입력란을 보여준다', () => {
      render(<Harness initial={versions} />);

      fireEvent.click(expandButton(1));
      fireEvent.click(expandButton(2));

      expect(screen.getAllByLabelText('노출 제목')).toHaveLength(1);
      expect(expandButton(1)).toHaveAttribute('aria-expanded', 'false');
      expect(expandButton(2)).toHaveAttribute('aria-expanded', 'true');
    });

    it('다시 누르면 접힌다', () => {
      render(<Harness initial={versions} />);

      fireEvent.click(expandButton(1));
      fireEvent.click(expandButton(1));

      expect(screen.queryByLabelText('노출 제목')).not.toBeInTheDocument();
    });

    it('새로 추가한 버전은 펼쳐진다', () => {
      render(<Harness initial={versions} />);

      fireEvent.click(screen.getByRole('button', { name: '버전 추가' }));

      expect(expandButton(4)).toHaveAttribute('aria-expanded', 'true');
    });

    it('펼친 카드를 옮기면 펼침도 따라간다', () => {
      render(<Harness initial={versions} />);

      fireEvent.click(expandButton(2));
      fireEvent.click(
        screen.getByRole('button', { name: '2번 버전 위로 이동' }),
      );

      expect(expandButton(1)).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getAllByLabelText('버전 제목')[0]).toHaveValue('인턴 경력');
    });

    it('펼친 카드 위의 카드를 지우면 펼침이 한 칸 올라간다', () => {
      render(<Harness initial={versions} />);

      fireEvent.click(expandButton(3));
      fireEvent.click(screen.getByRole('button', { name: '1번 버전 삭제' }));

      expect(expandButton(2)).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getAllByLabelText('버전 제목')[1]).toHaveValue('이직자');
    });

    it('펼친 카드를 지우면 모두 접힌다', () => {
      render(<Harness initial={versions} />);

      fireEvent.click(expandButton(2));
      fireEvent.click(screen.getByRole('button', { name: '2번 버전 삭제' }));

      expect(screen.queryByLabelText('노출 제목')).not.toBeInTheDocument();
    });

    it('노출 제목과 한 줄 설명은 그 카드의 값만 바꾼다', () => {
      const onChange = renderSection();
      fireEvent.click(expandButton(2));

      fireEvent.change(screen.getByLabelText('노출 제목'), {
        target: { value: '인턴 경력자 챌린지' },
      });
      fireEvent.change(screen.getByLabelText('한 줄 설명'), {
        target: { value: '설명' },
      });

      expect(onChange).toHaveBeenNthCalledWith(1, [
        versions[0],
        { ...versions[1], programTitle: '인턴 경력자 챌린지' },
        versions[2],
      ]);
      expect(onChange).toHaveBeenNthCalledWith(2, [
        versions[0],
        { ...versions[1], shortDesc: '설명' },
        versions[2],
      ]);
    });

    it('노출 제목이 비면 에러를 표시한다', () => {
      renderSection();
      fireEvent.click(expandButton(1));

      expect(screen.getByLabelText('노출 제목')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it.each([
      ['thumbnail', 'version-1-thumbnail'],
      ['desktopThumbnail', 'version-1-desktopThumbnail'],
    ])(
      '%s 업로드는 업로드한 url 로 그 카드의 값만 바꾼다',
      async (field, inputId) => {
        uploadFile.mockResolvedValueOnce('https://cdn/uploaded.png');
        const onChange = renderSection();
        fireEvent.click(expandButton(2));

        const file = new File(['img'], 'thumb.png', { type: 'image/png' });
        const input = document.getElementById(inputId) as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() =>
          expect(onChange).toHaveBeenCalledWith([
            versions[0],
            { ...versions[1], [field]: 'https://cdn/uploaded.png' },
            versions[2],
          ]),
        );
        expect(uploadFile).toHaveBeenCalledWith({ file, type: 'CHALLENGE' });
      },
    );
  });

  describe('버전 상세 본문', () => {
    const toggleLabel =
      '버전 전용 상세 본문 사용 (끄면 챌린지 상세 본문을 씁니다)';

    it('켜면 챌린지 본문을 복사해 시작한다', () => {
      const onChange = renderSection();
      fireEvent.click(expandButton(1));

      fireEvent.click(screen.getByLabelText(toggleLabel));

      expect(onChange).toHaveBeenCalledWith([
        { ...versions[0], description: CHALLENGE_DESC },
        versions[1],
        versions[2],
      ]);
    });

    it('끄면 null 로 돌려 챌린지 본문을 쓰게 한다', () => {
      const withDescription = [
        { ...versions[0], description: '{"version":1}' },
        versions[1],
      ];
      const onChange = renderSection(withDescription);
      fireEvent.click(expandButton(1));

      fireEvent.click(screen.getByLabelText(toggleLabel));

      expect(onChange).toHaveBeenCalledWith([
        { ...versions[0], description: null },
        versions[1],
      ]);
    });

    it('본문 편집기는 펼친 카드에만 렌더한다', () => {
      render(
        <Harness
          initial={[
            { ...versions[0], description: '{"version":1}' },
            { ...versions[1], description: '{"version":2}' },
          ]}
        />,
      );

      expect(
        screen.queryByTestId('version-content-editor'),
      ).not.toBeInTheDocument();

      fireEvent.click(expandButton(2));

      expect(screen.getAllByTestId('version-content-editor')).toHaveLength(1);
      expect(screen.getByTestId('version-content-editor')).toHaveTextContent(
        '{"version":2}',
      );
    });
  });
});
