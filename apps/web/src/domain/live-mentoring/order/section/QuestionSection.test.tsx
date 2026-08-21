import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';

import { uploadFileForId } from '@/api/file';
import QuestionSection from './QuestionSection';
import { EMPTY_QUESTION, type QuestionInput } from '../types';

jest.mock('@/api/file', () => ({
  __esModule: true,
  uploadFileForId: jest.fn(),
}));

const uploadMock = uploadFileForId as jest.Mock;

let latest: QuestionInput = EMPTY_QUESTION;

function Harness() {
  const [value, setValue] = useState<QuestionInput>(EMPTY_QUESTION);
  latest = value;
  return <QuestionSection value={value} onChange={setValue} />;
}

beforeEach(() => {
  uploadMock.mockReset();
  latest = EMPTY_QUESTION;
});

const deferredCheckbox = () =>
  screen.getByRole('checkbox', { name: '나중에 작성하기' });

describe('QuestionSection — 나중에 작성하기', () => {
  /*
    시안 2-1. 감추는 것이 아니라 렌더하지 않는다 — 접힌 채 남아 있는 입력값이
    그대로 신청에 실려 가면 사용자가 쓴 적 없는 질문이 멘토에게 간다.
  */
  it('체크하면 질문·첨부·전달 동의가 통째로 사라진다', () => {
    render(<Harness />);

    expect(screen.getByLabelText('멘토링 질문 작성')).toBeInTheDocument();
    expect(screen.getByText('전달 파일')).toBeInTheDocument();

    fireEvent.click(deferredCheckbox());

    expect(screen.queryByLabelText('멘토링 질문 작성')).toBeNull();
    expect(screen.queryByText('전달 파일')).toBeNull();
    expect(
      screen.queryByRole('checkbox', { name: /멘토에게 전달되는 데 동의/ }),
    ).toBeNull();
  });

  it('접을 때 이미 쓴 값도 함께 비운다', () => {
    render(<Harness />);

    fireEvent.change(screen.getByLabelText('멘토링 질문 작성'), {
      target: { value: '이력서 피드백 부탁드립니다' },
    });
    fireEvent.click(screen.getByRole('radio', { name: /URL/ }));
    fireEvent.change(screen.getByLabelText('첨부 URL'), {
      target: { value: 'https://example.test/resume' },
    });

    fireEvent.click(deferredCheckbox());

    expect(latest).toEqual({
      deferred: true,
      content: '',
      attachmentType: 'NONE',
      fileId: null,
      url: '',
      mentorShareAgreed: false,
    });
  });

  it('체크를 풀면 다시 펴진다', () => {
    render(<Harness />);

    fireEvent.click(deferredCheckbox());
    fireEvent.click(deferredCheckbox());

    expect(screen.getByLabelText('멘토링 질문 작성')).toBeInTheDocument();
    expect(latest.deferred).toBe(false);
  });
});

describe('QuestionSection — 첨부는 파일과 URL 중 하나', () => {
  it('처음에는 둘 다 고르지 않은 NONE 이고 입력이 잠겨 있다', () => {
    render(<Harness />);

    expect(latest.attachmentType).toBe('NONE');
    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeDisabled();
    expect(screen.getByLabelText('첨부 URL')).toBeDisabled();
  });

  it('URL 을 고르면 파일 업로드가 잠긴다', () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole('radio', { name: /URL/ }));

    expect(latest.attachmentType).toBe('URL');
    expect(screen.getByRole('button', { name: '파일 업로드' })).toBeDisabled();
    expect(screen.getByLabelText('첨부 URL')).toBeEnabled();
  });

  it('파일 첨부를 고르면 URL 입력이 잠기고 쓰던 URL 이 지워진다', () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole('radio', { name: /URL/ }));
    fireEvent.change(screen.getByLabelText('첨부 URL'), {
      target: { value: 'https://example.test' },
    });
    fireEvent.click(screen.getByRole('radio', { name: /파일 첨부/ }));

    expect(latest.attachmentType).toBe('FILE');
    expect(latest.url).toBe('');
    expect(screen.getByLabelText('첨부 URL')).toBeDisabled();
  });
});

describe('QuestionSection — 파일 업로드', () => {
  /*
    Push 2 의 2.1 이 fileType zod enum 에 'LIVE_MENTORING' 을 넣지 않았으면
    이 호출이 런타임에서 터진다. 타입으로는 잡히지 않아 테스트로 못박는다.
  */
  it('LIVE_MENTORING 타입으로 올리고 받은 fileId 를 담는다', async () => {
    uploadMock.mockResolvedValue(9001);
    render(<Harness />);

    fireEvent.click(screen.getByRole('radio', { name: /파일 첨부/ }));
    const file = new File(['x'], 'resume.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('멘토링 질문 작성').closest('section')!.querySelector('input[type=file]')!, {
      target: { files: [file] },
    });

    await waitFor(() => expect(latest.fileId).toBe(9001));
    expect(uploadMock).toHaveBeenCalledWith({
      file,
      type: 'LIVE_MENTORING',
    });
    expect(latest.attachmentType).toBe('FILE');
    expect(await screen.findByText('resume.pdf')).toBeInTheDocument();
  });

  it('업로드가 실패하면 fileId 를 채우지 않고 안내를 남긴다', async () => {
    uploadMock.mockRejectedValue(new Error('500'));
    render(<Harness />);

    fireEvent.click(screen.getByRole('radio', { name: /파일 첨부/ }));
    fireEvent.change(screen.getByLabelText('멘토링 질문 작성').closest('section')!.querySelector('input[type=file]')!, {
      target: { files: [new File(['x'], 'resume.pdf')] },
    });

    expect(
      await screen.findByText('파일 업로드에 실패했습니다. 다시 시도해 주세요.'),
    ).toBeInTheDocument();
    expect(latest.fileId).toBeNull();
  });
});

describe('QuestionSection — 글자수 상한', () => {
  /* 서버 `@Size(max = 5000)` / `@Size(max = 2048)`. 입력 단계에서 건다. */
  it('질문 5000자·URL 2048자에서 더 들어가지 않는다', () => {
    render(<Harness />);

    expect(screen.getByLabelText('멘토링 질문 작성')).toHaveAttribute(
      'maxlength',
      '5000',
    );
    fireEvent.click(screen.getByRole('radio', { name: /URL/ }));
    expect(screen.getByLabelText('첨부 URL')).toHaveAttribute(
      'maxlength',
      '2048',
    );
  });

  it('입력한 글자수를 보여준다', () => {
    render(<Harness />);

    fireEvent.change(screen.getByLabelText('멘토링 질문 작성'), {
      target: { value: '안녕하세요' },
    });

    expect(screen.getByText('5/5000')).toBeInTheDocument();
  });
});
