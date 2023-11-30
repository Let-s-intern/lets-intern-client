import styled from 'styled-components';

import { SectionTitle } from '../Section';
import Input from './Input';
import FormButton from './FormButton';

interface PasswordChangeProps {
  passwordValues: any;
  onChangePassword: (e: any) => void;
  onSubmitPassword: (e: any) => void;
}

const PasswordChange = ({
  passwordValues,
  onChangePassword,
  onSubmitPassword,
}: PasswordChangeProps) => {
  return (
    <PasswordChangeBlock>
      <SectionTitle>비밀번호 변경</SectionTitle>
      <Form onSubmit={onSubmitPassword}>
        <InputControl>
          <Label>기존 비밀번호</Label>
          <Input
            type="password"
            placeholder="기존 비밀번호를 입력하세요."
            name="currentPassword"
            value={passwordValues.currentPassword}
            onChange={onChangePassword}
            autoComplete="off"
          />
        </InputControl>
        <InputControl>
          <Label>새로운 비밀번호</Label>
          <Input
            type="password"
            placeholder="새로운 비밀번호를 입력하세요."
            name="newPassword"
            value={passwordValues.newPassword}
            onChange={onChangePassword}
            autoComplete="off"
          />
        </InputControl>
        <InputControl>
          <Label>비밀번호 확인</Label>
          <Input
            type="password"
            placeholder="비밀번호를 다시 입력하세요."
            name="newPasswordConfirm"
            value={passwordValues.newPasswordConfirm}
            onChange={onChangePassword}
            autoComplete="off"
          />
        </InputControl>
        <ButtonGroup>
          <FormButton type="submit">비밀번호 변경</FormButton>
        </ButtonGroup>
      </Form>
    </PasswordChangeBlock>
  );
};

export default PasswordChange;

const PasswordChangeBlock = styled.section``;

const Form = styled.form``;

const InputControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  & + & {
    margin-top: 1rem;
  }
`;

const Label = styled.label``;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;
