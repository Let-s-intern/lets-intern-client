import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AgreementSection from './AgreementSection';

const TEXT = '신청 완료 후에는 예약 시간 변경이 어려울 수 있음을 확인했습니다.';

describe('AgreementSection', () => {
  /*
    체크박스를 문구 오른쪽으로 옮겼다. label 로 감싼 구조가 유지되는 한 문구를
    눌러도 체크되어야 한다 — 순서만 바뀌고 눌리는 범위는 그대로다.
  */
  it('문구를 눌러도 체크가 토글된다', async () => {
    const onChange = jest.fn();
    render(<AgreementSection checked={false} onChange={onChange} />);

    await userEvent.click(screen.getByText(TEXT));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('체크된 상태에서 문구를 누르면 해제로 알린다', async () => {
    const onChange = jest.fn();
    render(<AgreementSection checked={true} onChange={onChange} />);

    expect(screen.getByRole('checkbox')).toBeChecked();
    await userEvent.click(screen.getByText(TEXT));

    expect(onChange).toHaveBeenCalledWith(false);
  });
});
