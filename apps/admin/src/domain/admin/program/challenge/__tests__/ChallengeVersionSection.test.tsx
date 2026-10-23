import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import ChallengeVersionSection, {
  ChallengeVersionDraft,
} from '../ChallengeVersionSection';

const { uploadFile, generateVersionThumbnail } = vi.hoisted(() => ({
  uploadFile: vi.fn(),
  generateVersionThumbnail: vi.fn(),
}));

vi.mock('../utils/generateThumbnail', () => ({
  generateAndUploadVersionThumbnail: generateVersionThumbnail,
}));

vi.mock('@/api/file', () => ({
  fileType: { enum: { CHALLENGE: 'CHALLENGE' } },
  uploadFile,
}));

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
  render(<ChallengeVersionSection versions={initial} onChange={onChange} />);
  return onChange;
};

/** 펼침 상태가 목록 변경을 따라가는지 보려면 실제로 목록이 바뀌어야 한다 */
function Harness({ initial }: { initial: ChallengeVersionDraft[] }) {
  const [list, setList] = useState(initial);
  return <ChallengeVersionSection versions={list} onChange={setList} />;
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
        '버전마다 목록 카드와 상세 페이지가 따로 보이고, 참여자는 들어온 버전 페이지의 버전으로 신청합니다. 버전별 미션은 미션 등록에서 지정합니다.',
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

    // 노출 제목이 비어 있으면 버전명으로 채운다 (LC-3505)
    expect(onChange).toHaveBeenCalledWith([
      versions[0],
      { ...draft(2, '직장인'), programTitle: '[직장인]' },
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

  it('펼친 카드는 상세 설명을 프로그램 소개의 버전 탭에서 쓴다고 안내하고 편집기는 없다', () => {
    renderSection([{ ...versions[0], description: '{"version":1}' }]);
    fireEvent.click(expandButton(1));

    expect(
      screen.getByText(
        '상세 설명은 아래 프로그램 소개의 버전 탭에서 작성합니다.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(
        '버전 전용 상세 본문 사용 (끄면 챌린지 상세 본문을 씁니다)',
      ),
    ).not.toBeInTheDocument();
  });
  describe('기본값 (LC-3505)', () => {
    type BaseProps = {
      challengeTitle?: string;
      challengeShortDesc?: string | null;
      baseThumbnail?: string | null;
    };

    function BaseHarness({
      initial,
      ...base
    }: BaseProps & { initial: ChallengeVersionDraft[] }) {
      const [list, setList] = useState(initial);
      return (
        <>
          <ChallengeVersionSection
            versions={list}
            onChange={setList}
            {...base}
          />
          <output data-testid="list">{JSON.stringify(list)}</output>
        </>
      );
    }

    const list = (): ChallengeVersionDraft[] =>
      JSON.parse(screen.getByTestId('list').textContent ?? '[]');

    const titleInput = (order: number) =>
      screen.getAllByRole('textbox', { name: '버전 제목' })[order - 1];

    it('버전을 추가하면 한 줄 설명이 기본 정보 값으로 채워진다', () => {
      render(<BaseHarness initial={[]} challengeShortDesc="기본 한 줄 설명" />);

      fireEvent.click(screen.getByRole('button', { name: '버전 추가' }));

      expect(list()[0].shortDesc).toBe('기본 한 줄 설명');
    });

    it('버전명을 넣으면 노출 제목이 [버전명] 챌린지 제목으로 채워지고 버전명을 따라간다', () => {
      render(
        <BaseHarness
          initial={[draft(null, '')]}
          challengeTitle="마케팅 챌린지 15기"
        />,
      );

      fireEvent.change(titleInput(1), { target: { value: '대학생' } });
      expect(list()[0].programTitle).toBe('[대학생] 마케팅 챌린지 15기');

      fireEvent.change(titleInput(1), { target: { value: '경력자' } });
      expect(list()[0].programTitle).toBe('[경력자] 마케팅 챌린지 15기');
    });

    it('노출 제목을 직접 고치면 버전명을 바꿔도 따라가지 않는다', () => {
      render(
        <BaseHarness
          initial={[{ ...draft(null, '대학생'), programTitle: '직접 쓴 제목' }]}
          challengeTitle="마케팅 챌린지 15기"
        />,
      );

      fireEvent.change(titleInput(1), { target: { value: '경력자' } });

      expect(list()[0].programTitle).toBe('직접 쓴 제목');
    });

    it('챌린지 제목·한 줄 설명이 바뀌면 기본값을 쓰는 버전만 따라 바뀐다', () => {
      const initial = [
        {
          ...draft(1, '대학생'),
          programTitle: '[대학생] 마케팅 챌린지 15기',
          shortDesc: '기본',
        },
        {
          ...draft(2, '경력자'),
          programTitle: '직접 쓴 제목',
          shortDesc: '직접',
        },
      ];
      const { rerender } = render(
        <BaseHarness
          initial={initial}
          challengeTitle="마케팅 챌린지 15기"
          challengeShortDesc="기본"
        />,
      );

      rerender(
        <BaseHarness
          initial={initial}
          challengeTitle="마케팅 챌린지 16기"
          challengeShortDesc="새 기본"
        />,
      );

      expect(list().map((v) => [v.programTitle, v.shortDesc])).toEqual([
        ['[대학생] 마케팅 챌린지 16기', '새 기본'],
        ['직접 쓴 제목', '직접'],
      ]);
    });

    it('버전명 입력을 마치면 기본 썸네일에 버전명을 얹은 썸네일을 만든다', async () => {
      generateVersionThumbnail.mockResolvedValueOnce('https://cdn/auto-a.png');
      render(
        <BaseHarness
          initial={[draft(null, '')]}
          baseThumbnail="https://cdn/base.png"
        />,
      );

      fireEvent.change(titleInput(1), { target: { value: '대학생' } });
      fireEvent.blur(titleInput(1));

      await waitFor(() =>
        expect(list()[0].thumbnail).toBe('https://cdn/auto-a.png'),
      );
      expect(generateVersionThumbnail).toHaveBeenCalledWith(
        'https://cdn/base.png',
        '대학생',
        undefined,
      );
    });

    it('직접 올린 썸네일은 버전명을 바꿔도 다시 만들지 않는다', () => {
      generateVersionThumbnail.mockClear();
      render(
        <BaseHarness
          initial={[
            { ...draft(null, '대학생'), thumbnail: 'https://cdn/manual.png' },
          ]}
          baseThumbnail="https://cdn/base.png"
        />,
      );

      fireEvent.change(titleInput(1), { target: { value: '경력자' } });
      fireEvent.blur(titleInput(1));

      expect(generateVersionThumbnail).not.toHaveBeenCalled();
    });

    it('자동 생성에 실패하면 직접 올리라고 안내한다', async () => {
      generateVersionThumbnail.mockRejectedValueOnce(new Error('tainted'));
      render(
        <BaseHarness
          initial={[draft(null, '')]}
          baseThumbnail="https://cdn/base.png"
        />,
      );
      fireEvent.click(expandButton(1));

      fireEvent.change(titleInput(1), { target: { value: '대학생' } });
      fireEvent.blur(titleInput(1));

      expect(
        await screen.findByText(
          '기본 썸네일을 불러오지 못해 자동으로 만들지 못했습니다. 직접 올려주세요.',
        ),
      ).toBeInTheDocument();
    });
  });
});
