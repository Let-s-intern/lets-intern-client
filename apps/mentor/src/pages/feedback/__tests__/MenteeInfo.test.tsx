/**
 * Component tests for MenteeInfo submission entry-point branching.
 *
 * - 링크형(link 존재): 외부 링크 "제출물 보기"
 * - 경험정리형(link 없음·userId 존재): "경험 보기" 버튼 → onViewExperience
 * - 제출됐으나 link·userId 둘 다 없음: "제출물 없음" 안내
 * - 미제출(ABSENT): 어떤 진입점도 노출 안 함
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MenteeInfo from '../ui/MenteeInfo';

const base = {
  name: '홍길동',
  status: 'PRESENT' as const,
  feedbackStatus: 'WAITING' as const,
};

describe('MenteeInfo 제출물 진입점', () => {
  it('링크형: 외부 링크 "제출물 보기"를 노출한다', () => {
    render(
      <MenteeInfo
        mentee={{ ...base, id: 1, userId: 2, link: 'https://notion.so/x' }}
      />,
    );

    const link = screen.getByRole('link', { name: /제출물 보기/ });
    expect(link).toHaveAttribute('href', 'https://notion.so/x');
  });

  it('경험정리형: "경험 보기" 버튼이 onViewExperience를 호출한다', async () => {
    const onViewExperience = vi.fn();
    render(
      <MenteeInfo
        mentee={{ ...base, id: 1, userId: 2, link: null }}
        onViewExperience={onViewExperience}
      />,
    );

    const button = screen.getByRole('button', { name: /경험 보기/ });
    await userEvent.click(button);

    expect(onViewExperience).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('link', { name: /제출물 보기/ })).toBeNull();
  });

  it('제출됐으나 link·userId 모두 없음: "제출물 없음" 안내', () => {
    render(
      <MenteeInfo mentee={{ ...base, id: 1, userId: null, link: null }} />,
    );

    expect(screen.getByText('제출물 없음')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /경험 보기/ })).toBeNull();
  });

  it('미제출(ABSENT): 제출물/경험 진입점을 노출하지 않는다', () => {
    render(
      <MenteeInfo
        mentee={{ ...base, id: null, userId: 2, status: 'ABSENT', link: null }}
      />,
    );

    expect(screen.queryByRole('button', { name: /경험 보기/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /제출물 보기/ })).toBeNull();
    expect(screen.queryByText('제출물 없음')).toBeNull();
  });

  it('collapsed 모드에서도 경험 보기 버튼이 동작한다', async () => {
    const onViewExperience = vi.fn();
    render(
      <MenteeInfo
        mentee={{ ...base, id: 1, userId: 2, link: null }}
        collapsed
        onViewExperience={onViewExperience}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /경험 보기/ }));
    expect(onViewExperience).toHaveBeenCalledTimes(1);
  });
});

/**
 * 지각 제출(LATE)은 서면 피드백 대상이 아니지만 제출물은 있다.
 * 막는 것은 "작성"이지 "열람"이 아니므로 진입점은 그대로 두고 상태만 구분한다.
 */
describe('MenteeInfo 지각 제출', () => {
  const late = { ...base, id: 1, userId: 2, status: 'LATE' as const };

  it('제출 상태를 "지각 제출", 피드백 상태를 "진행 불가"로 표시한다', () => {
    render(<MenteeInfo mentee={{ ...late, link: null }} />);

    expect(screen.getByText('지각 제출')).toBeInTheDocument();
    expect(screen.getByText('진행 불가')).toBeInTheDocument();
    expect(screen.queryByText('제출됨')).toBeNull();
  });

  it('제출물 열람 진입점은 유지한다', () => {
    render(<MenteeInfo mentee={{ ...late, link: 'https://notion.so/x' }} />);

    expect(
      screen.getByRole('link', { name: /제출물 보기/ }),
    ).toBeInTheDocument();
  });

  it('임시저장분이 있어도 "임시저장됨"을 띄우지 않는다 (진행 불가이므로 오해 방지)', () => {
    render(
      <MenteeInfo
        mentee={{ ...late, link: null, feedbackStatus: 'IN_PROGRESS' }}
      />,
    );

    expect(screen.queryByText('임시저장됨')).toBeNull();
  });
});

/**
 * 사전 질문은 카드에 인라인으로 펼치지 않고 오른쪽 패널 진입 버튼만 노출한다.
 * 인라인이던 시절엔 장문일수록 카드가 제한 없이 늘어나 에디터를 0px까지 밀어냈다.
 */
describe('MenteeInfo 사전 질문', () => {
  const submitted = { ...base, id: 1, userId: 2, link: null };

  it('preQuestion 전달 시 진입 버튼을 노출하고 내용은 카드에 펼치지 않는다', () => {
    render(
      <MenteeInfo mentee={submitted} preQuestion="자소서 3번 문항 봐주세요" />,
    );

    expect(
      screen.getByRole('button', { name: /사전 질문 보기/ }),
    ).toBeInTheDocument();
    expect(screen.queryByText('자소서 3번 문항 봐주세요')).toBeNull();
  });

  it('진입 버튼 클릭 시 onViewPreQuestion 을 호출한다', async () => {
    const onViewPreQuestion = vi.fn();
    render(
      <MenteeInfo
        mentee={submitted}
        preQuestion="자소서 3번 문항 봐주세요"
        onViewPreQuestion={onViewPreQuestion}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: /사전 질문 보기/ }),
    );
    expect(onViewPreQuestion).toHaveBeenCalledTimes(1);
  });

  it('preQuestion 미전달 시 진입 버튼을 노출하지 않는다', () => {
    render(<MenteeInfo mentee={submitted} />);

    expect(screen.queryByText(/사전 질문/)).toBeNull();
  });

  it('공백만 있는 preQuestion 은 없는 것으로 취급한다', () => {
    render(<MenteeInfo mentee={submitted} preQuestion="   " />);

    expect(screen.queryByText(/사전 질문/)).toBeNull();
  });

  it('collapsed(컴팩트) 모드에서도 진입 버튼을 노출한다', async () => {
    const onViewPreQuestion = vi.fn();
    render(
      <MenteeInfo
        mentee={submitted}
        collapsed
        preQuestion="자소서 3번 문항 봐주세요"
        onViewPreQuestion={onViewPreQuestion}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /사전 질문/ }));
    expect(onViewPreQuestion).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('자소서 3번 문항 봐주세요')).toBeNull();
  });
});
