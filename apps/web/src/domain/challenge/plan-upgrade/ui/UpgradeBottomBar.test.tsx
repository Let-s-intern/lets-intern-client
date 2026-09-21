import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpgradeBottomBar from './UpgradeBottomBar';

describe('UpgradeBottomBar', () => {
  it('누르면 onClick 을 부른다', async () => {
    const onClick = jest.fn();
    render(
      <UpgradeBottomBar
        buttonText="84,000원에 업그레이드 하기"
        onClick={onClick}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: '84,000원에 업그레이드 하기' }),
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('비활성이면 누를 수 없다', async () => {
    const onClick = jest.fn();
    render(
      <UpgradeBottomBar
        buttonText="84,000원에 업그레이드 하기"
        onClick={onClick}
        disabled
      />,
    );
    const button = screen.getByRole('button', {
      name: '84,000원에 업그레이드 하기',
    });

    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
