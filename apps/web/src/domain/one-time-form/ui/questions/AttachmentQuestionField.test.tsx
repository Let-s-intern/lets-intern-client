import { fetchOneTimeFormUploadUrl } from '@/api/one-time-form/oneTimeForm';
import type { OneTimeFormAttachmentAnswer } from '@/api/one-time-form/oneTimeFormSchema';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { putAttachmentFile } from '../../api/putAttachmentFile';
import AttachmentQuestionField from './AttachmentQuestionField';

jest.mock('@/api/one-time-form/oneTimeForm', () => ({
  fetchOneTimeFormUploadUrl: jest.fn(),
  getOneTimeFormErrorCode: () => undefined,
}));

jest.mock('../../api/putAttachmentFile', () => ({
  putAttachmentFile: jest.fn(),
}));

const KEY = 'one-time-form/attachment/7/0b5c.png';

const Harness = ({
  initialValue,
  onChange,
}: {
  initialValue?: OneTimeFormAttachmentAnswer;
  onChange: (value: OneTimeFormAttachmentAnswer | undefined) => void;
}) => {
  const [value, setValue] = useState(initialValue);
  return (
    <AttachmentQuestionField
      id="field-q-109"
      slug="portfolio-1115"
      questionId={109}
      kind="IMAGE"
      value={value}
      hasError={false}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
      onBlur={() => {}}
    />
  );
};

beforeEach(() => {
  (fetchOneTimeFormUploadUrl as jest.Mock).mockResolvedValue({
    uploadUrl: 'https://bucket/put',
    key: KEY,
  });
  (putAttachmentFile as jest.Mock).mockResolvedValue(undefined);
  URL.createObjectURL = jest.fn(() => 'blob:preview');
  URL.revokeObjectURL = jest.fn();
});

describe('AttachmentQuestionField', () => {
  it('이미지를 올리면 썸네일 칩이 되고, 삭제하면 값을 비우고 미리보기를 해제한다', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { container } = render(<Harness onChange={onChange} />);

    expect(screen.getByRole('button', { name: /이미지 선택/ })).toHaveAttribute(
      'id',
      'field-q-109',
    );

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    await user.upload(
      input,
      new File(['x'], 'profile.png', { type: 'image/png' }),
    );

    expect(onChange).toHaveBeenLastCalledWith({
      key: KEY,
      name: 'profile.png',
    });
    expect(await screen.findByText('profile.png')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'profile.png 미리보기' }),
    ).toHaveAttribute('src', 'blob:preview');

    await user.click(screen.getByRole('button', { name: '파일 삭제' }));

    expect(onChange).toHaveBeenLastCalledWith(undefined);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview');
    expect(screen.queryByText('profile.png')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /이미지 선택/ }),
    ).toBeInTheDocument();
  });

  it('임시 저장에서 되살린 값은 썸네일 없이 확장자와 이름으로 보여 준다', () => {
    render(
      <Harness
        initialValue={{ key: KEY, name: 'profile.png' }}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByText('profile.png')).toBeInTheDocument();
    expect(screen.getByText('png')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('업로드가 실패하면 문구와 다시 시도 버튼을 보여 준다', async () => {
    (putAttachmentFile as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { container } = render(<Harness onChange={onChange} />);

    await user.upload(
      container.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['x'], 'profile.png', { type: 'image/png' }),
    );

    expect(
      await screen.findByText('업로드하지 못했어요. 다시 시도해 주세요.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByText('profile.png')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith({
      key: KEY,
      name: 'profile.png',
    });
  });
});
