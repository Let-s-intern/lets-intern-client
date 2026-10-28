import { fireEvent, render, screen } from '@testing-library/react';
import FormPopupShell from './FormPopupShell';

describe('FormPopupShell', () => {
  it('단계가 있으면 단계 표시와 진행 막대를 그린다', () => {
    render(
      <FormPopupShell title="신청서 작성" step={{ current: 1, total: 2 }}>
        본문
      </FormPopupShell>,
    );

    expect(screen.getByText('1/2')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '1',
    );
  });

  it('단계가 없으면 단계 표시와 진행 막대가 없다', () => {
    render(<FormPopupShell title="사전 설문">본문</FormPopupShell>);

    expect(screen.queryByText(/\d\/\d/)).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('닫기 버튼은 window.close 를 부른다', () => {
    const close = jest.spyOn(window, 'close').mockImplementation(() => {});

    render(<FormPopupShell title="신청서 작성">본문</FormPopupShell>);
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(close).toHaveBeenCalledTimes(1);
    close.mockRestore();
  });

  it('onBack 이 있을 때만 이전 버튼을 그린다', () => {
    const onBack = jest.fn();
    const { rerender } = render(
      <FormPopupShell title="결제하기">본문</FormPopupShell>,
    );
    expect(
      screen.queryByRole('button', { name: '이전' }),
    ).not.toBeInTheDocument();

    rerender(
      <FormPopupShell title="결제하기" onBack={onBack}>
        본문
      </FormPopupShell>,
    );
    fireEvent.click(screen.getByRole('button', { name: '이전' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('footer 슬롯을 하단에 그린다', () => {
    render(
      <FormPopupShell title="신청서 작성" footer={<button>다음</button>}>
        본문
      </FormPopupShell>,
    );

    expect(screen.getByRole('contentinfo')).toContainElement(
      screen.getByRole('button', { name: '다음' }),
    );
  });
});
