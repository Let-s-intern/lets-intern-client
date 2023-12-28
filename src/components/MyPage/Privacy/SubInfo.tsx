import styled from 'styled-components';

import { SectionTitle } from '../Section';
import Input from './Input';
import FormButton from './FormButton';
import Label from './Label';
import ButtonGroup from './ButtonGroup';
import InputControl from './InputControl';

interface SubInfoProps {
  subInfoValues: any;
  onChangeSubInfo: (e: any) => void;
  onSubmitSubInfo: (e: any) => void;
}

const SubInfo = ({
  subInfoValues,
  onChangeSubInfo,
  onSubmitSubInfo,
}: SubInfoProps) => {
  return (
    <SubInfoBlock onSubmit={onSubmitSubInfo}>
      <SectionTitle>학력 정보</SectionTitle>
      <Form>
        <InputControl>
          <Label>대학교</Label>
          <Input
            placeholder="대학교를 입력하세요."
            name="university"
            value={subInfoValues.university || ''}
            onChange={onChangeSubInfo}
            autoComplete="off"
          />
        </InputControl>
        <InputControl>
          <Label>전공</Label>
          <Input
            placeholder="전공을 입력하세요."
            name="major"
            value={subInfoValues.major || ''}
            onChange={onChangeSubInfo}
            autoComplete="off"
          />
        </InputControl>
        <ButtonGroup>
          <FormButton type="submit">정보 수정</FormButton>
        </ButtonGroup>
      </Form>
    </SubInfoBlock>
  );
};

export default SubInfo;

const SubInfoBlock = styled.section``;

const Form = styled.form``;
