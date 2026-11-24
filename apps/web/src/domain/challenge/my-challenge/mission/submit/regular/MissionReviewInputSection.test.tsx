/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { MissionReviewInputSection } from './MissionReviewInputSection';

const Harness = ({ initial = '' }: { initial?: string }) => {
  const [value, setValue] = useState(initial);
  return (
    <MissionReviewInputSection
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const textarea = () => screen.getByRole('textbox') as HTMLTextAreaElement;

describe('MissionReviewInputSection — 글자수 제한', () => {
  it('안내 문구와 카운터 0/500 을 보여준다', () => {
    render(<Harness />);

    expect(
      screen.getByText('공백 포함 10자 이상 500자 이하로 작성해 주세요'),
    ).toBeInTheDocument();
    expect(screen.getByText('0/500')).toBeInTheDocument();
  });

  it('입력란 maxLength 가 500 이다', () => {
    render(<Harness />);

    expect(textarea()).toHaveAttribute('maxlength', '500');
  });

  it('501자를 넣으면 500자로 잘리고 카운터는 500/500 이다', () => {
    render(<Harness />);

    fireEvent.change(textarea(), { target: { value: 'a'.repeat(501) } });

    expect(textarea().value).toHaveLength(500);
    expect(screen.getByText('500/500')).toBeInTheDocument();
  });

  it('공백도 글자수에 센다', () => {
    render(<Harness />);

    fireEvent.change(textarea(), { target: { value: 'a b c' } });

    expect(screen.getByText('5/500')).toBeInTheDocument();
  });

  it('10자 미만이면 안내 문구와 카운터가 부족 상태로 보인다', () => {
    render(<Harness initial="아홉글자입니다요" />);

    expect(screen.getByText('8/500')).toHaveClass('text-system-error');
    expect(
      screen.getByText('공백 포함 10자 이상 500자 이하로 작성해 주세요'),
    ).toHaveClass('text-system-error');
  });

  it('비어 있거나 10자 이상이면 부족 상태로 보이지 않는다', () => {
    const { unmount } = render(<Harness />);
    expect(screen.getByText('0/500')).not.toHaveClass('text-system-error');
    unmount();

    render(<Harness initial={'가'.repeat(10)} />);
    expect(screen.getByText('10/500')).not.toHaveClass('text-system-error');
  });
});
