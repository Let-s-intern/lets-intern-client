import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import ChipCheckboxGroup from './ChipCheckboxGroup';
import CounterTextarea from './CounterTextarea';
import FormField, { fieldErrorId } from './FormField';
import TextInput from './TextInput';

const OPTIONS = [
  { value: 'A', label: '서류 첨삭' },
  { value: 'B', label: '모의 면접' },
  { value: 'C', label: '커리어 상담' },
] as const;

function ChipHarness({ onChange }: { onChange: (v: string[]) => void }) {
  const [value, setValue] = useState<('A' | 'B' | 'C')[]>([]);
  return (
    <ChipCheckboxGroup
      name="types"
      options={OPTIONS}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

function CounterHarness() {
  const [value, setValue] = useState('');
  return (
    <CounterTextarea
      name="introduction"
      label="이력 소개"
      value={value}
      maxLength={1000}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

describe('ChipCheckboxGroup', () => {
  it('여러 개를 고를 수 있고 선택지 순서대로 값을 낸다', async () => {
    const onChange = jest.fn();
    render(<ChipHarness onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('커리어 상담'));
    await userEvent.click(screen.getByLabelText('서류 첨삭'));
    expect(onChange).toHaveBeenLastCalledWith(['A', 'C']);
    expect(screen.getByLabelText('서류 첨삭')).toBeChecked();
    expect(screen.getByLabelText('커리어 상담')).toBeChecked();

    await userEvent.click(screen.getByLabelText('서류 첨삭'));
    expect(onChange).toHaveBeenLastCalledWith(['C']);
    expect(screen.getByLabelText('서류 첨삭')).not.toBeChecked();
  });
});

describe('CounterTextarea', () => {
  it('입력에 따라 글자 수가 바뀐다', async () => {
    render(<CounterHarness />);
    expect(screen.getByText('0/1000')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('이력 소개'), '안녕하세요');
    expect(screen.getByText('5/1000')).toBeInTheDocument();
  });
});

describe('FormField', () => {
  it('필수 표시와 보조 문구를 라벨에 붙인다', () => {
    render(
      <FormField
        name="jobFields"
        label="멘토링 가능 분야"
        required
        hint="복수 선택 가능"
      >
        <span />
      </FormField>,
    );
    expect(
      screen.getByRole('group', {
        name: /멘토링 가능 분야\s*\*\s*복수 선택 가능/,
      }),
    ).toBeInTheDocument();
  });

  it('에러가 있으면 문구를 띄우고 입력에 aria-invalid 를 건다', () => {
    const { rerender } = render(
      <FormField name="name" label="성함" htmlFor="name" required>
        <TextInput id="name" errorId={fieldErrorId('name')} />
      </FormField>,
    );
    expect(screen.getByLabelText(/성함/)).toHaveAttribute(
      'aria-invalid',
      'false',
    );

    rerender(
      <FormField
        name="name"
        label="성함"
        htmlFor="name"
        required
        error="성함을 입력해 주세요."
      >
        <TextInput id="name" invalid errorId={fieldErrorId('name')} />
      </FormField>,
    );
    const input = screen.getByLabelText(/성함/);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('성함을 입력해 주세요.');
  });

  it('CounterTextarea 도 에러를 같은 방식으로 드러낸다', () => {
    render(
      <CounterTextarea
        name="motivation"
        label="전하고 싶은 말씀"
        value=""
        maxLength={1000}
        onChange={() => {}}
        error="1000자 이내로 입력해 주세요."
      />,
    );
    expect(screen.getByLabelText('전하고 싶은 말씀')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(
      screen.getByText('1000자 이내로 입력해 주세요.'),
    ).toBeInTheDocument();
  });
});
