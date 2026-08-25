import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import ApplicantFormSection from './ApplicantFormSection';

const ACCOUNT_EMAIL = 'local-admin@letscareer.test';

/** `OrderPage` 와 같은 배선으로 감싼다 — 체크 상태에 따라 값이 파생된다. */
function Harness() {
  const [same, setSame] = useState(true);
  const [typed, setTyped] = useState('');
  const contactEmail = same ? ACCOUNT_EMAIL : typed;

  return (
    <ApplicantFormSection
      name="김렛츠"
      phoneNumber="010-2020-2020"
      accountEmail={ACCOUNT_EMAIL}
      contactEmail={contactEmail}
      onContactEmailChange={setTyped}
      sameAsAccountEmail={same}
      onSameAsAccountEmailChange={(next) => {
        setSame(next);
        if (!next) setTyped(contactEmail);
      }}
    />
  );
}

const contactInput = () =>
  screen.getByLabelText('렛츠커리어 정보 수신용 이메일');

describe('ApplicantFormSection', () => {
  it('가입 정보를 그대로 채워 보여준다', () => {
    render(<Harness />);

    expect(screen.getByLabelText('이름')).toHaveValue('김렛츠');
    expect(screen.getByLabelText('휴대폰 번호')).toHaveValue('010-2020-2020');
    expect(screen.getByLabelText('가입한 이메일')).toHaveValue(ACCOUNT_EMAIL);
  });

  /*
    신청 생성 DTO 에 이름·휴대폰 필드가 아예 없다(PRD 7-6). 고칠 수 있게 두면
    사용자가 바꾸고 반영됐다고 믿는데, 실제로는 어디에도 전달되지 않는다.
  */
  it('이름·휴대폰·가입 이메일은 고칠 수 없다', () => {
    render(<Harness />);

    expect(screen.getByLabelText('이름')).toHaveAttribute('readonly');
    expect(screen.getByLabelText('휴대폰 번호')).toHaveAttribute('readonly');
    expect(screen.getByLabelText('가입한 이메일')).toHaveAttribute('readonly');
  });

  it('`가입한 이메일과 동일` 이 켜져 있으면 가입 이메일로 채우고 잠근다', () => {
    render(<Harness />);

    expect(
      screen.getByRole('checkbox', { name: '가입한 이메일과 동일' }),
    ).toBeChecked();
    expect(contactInput()).toHaveValue(ACCOUNT_EMAIL);
    expect(contactInput()).toHaveAttribute('readonly');
  });

  it('체크를 풀면 입력이 열리고 보이던 값에서 이어 고칠 수 있다', () => {
    render(<Harness />);

    fireEvent.click(
      screen.getByRole('checkbox', { name: '가입한 이메일과 동일' }),
    );

    expect(contactInput()).not.toHaveAttribute('readonly');
    // 방금까지 보이던 값이 그대로 남아 처음부터 다시 치지 않아도 된다
    expect(contactInput()).toHaveValue(ACCOUNT_EMAIL);

    fireEvent.change(contactInput(), { target: { value: 'me@other.test' } });
    expect(contactInput()).toHaveValue('me@other.test');
  });

  it('다시 체크하면 가입 이메일로 되돌아가고 잠긴다', () => {
    render(<Harness />);
    const checkbox = screen.getByRole('checkbox', {
      name: '가입한 이메일과 동일',
    });

    fireEvent.click(checkbox);
    fireEvent.change(contactInput(), { target: { value: 'me@other.test' } });
    fireEvent.click(checkbox);

    expect(contactInput()).toHaveValue(ACCOUNT_EMAIL);
    expect(contactInput()).toHaveAttribute('readonly');
  });
});
