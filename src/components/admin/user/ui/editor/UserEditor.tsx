import styled from 'styled-components';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {
  convertTypeToBank,
  typeToBank,
} from '../../../../../utils/convertTypeToBank';
import Input from '../../../../ui/input/Input';
import ActionButton from '../../../ui/button/ActionButton';
import Heading from '../../../ui/heading/Heading';

interface UserEditorProps {
  loading: boolean;
  error: unknown;
  values: any;
  title: string;
  handleCancelButtonClick: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChanged: (e: any) => void;
}

const UserEditor = ({
  loading,
  error,
  title,
  values,
  handleCancelButtonClick,
  handleSubmit,
  handleInputChanged,
}: UserEditorProps) => {
  if (loading) {
    return <div>로딩중</div>;
  }

  if (error) {
    return <div>에러 발생</div>;
  }

  return (
    <UserEditorBlock className="p-8">
      <Header>
        <Heading>{title}</Heading>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Input
          label="이름"
          name="name"
          value={values.name ? values.name : ''}
          onChange={handleInputChanged}
          placeholder="이름을 입력하세요"
        />
        <Input
          label="이메일"
          name="email"
          value={values.email ? values.email : ''}
          onChange={handleInputChanged}
          placeholder="이메일을 입력하세요"
        />
        <Input
          label="휴대폰 번호"
          name="phoneNum"
          value={values.phoneNum ? values.phoneNum : ''}
          onChange={handleInputChanged}
          placeholder="휴대폰 번호를 입력하세요"
        />
        {/* <Input
          label="비밀번호"
          value={values.password ? values.password : ''}
          onChange={handleInputChanged}
          placeholder="비밀번호를 입력하세요"
        /> */}
        {/* <Input
          label="비밀번호 확인"
          value={values.passwordConfirm ? values.passwordConfirm : ''}
          onChange={handleInputChanged}
          placeholder="비밀번호를 다시 입력하세요"
        /> */}
        <Input
          label="학교"
          name="university"
          value={values.university ? values.university : ''}
          onChange={handleInputChanged}
          placeholder="학교를 입력하세요"
        />
        {/* <Input
          label="학년"
          value={values.grade ? values.grade : ''}
          onChange={handleInputChanged}
          placeholder="학년을 입력하세요"
        /> */}
        <Input
          label="전공"
          name="major"
          value={values.major ? values.major : ''}
          onChange={handleInputChanged}
          placeholder="전공을 입력하세요"
        />
        {/* <Input
          label="관심직군"
          value={values.wishJob ? values.wishJob : ''}
          onChange={handleInputChanged}
          placeholder="관심직군을 입력하세요"
        /> */}
        {/* <Input
          label="희망기업"
          value={values.wishCompany ? values.wishCompany : ''}
          onChange={handleInputChanged}
          placeholder="희망기업을 입력하세요"
        /> */}
        <FormControl fullWidth>
          <InputLabel id="accountType">거래 은행</InputLabel>
          <Select
            labelId="accountType"
            id="accountType"
            value={values.accountType || ''}
            label="거래 은행"
            sx={{ backgroundColor: 'white' }}
            name="accountType"
            onChange={handleInputChanged}
          >
            {Object.keys(typeToBank).map((type) => (
              <MenuItem key={type} value={type}>
                {convertTypeToBank(type)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Input
          label="계좌번호"
          name="accountNumber"
          value={values.accountNumber || ''}
          onChange={handleInputChanged}
          placeholder="계좌번호를 입력하세요"
        />
        <ActionButtonGroup>
          <ActionButton bgColor="blue">등록</ActionButton>
          <ActionButton
            type="button"
            bgColor="gray"
            onClick={handleCancelButtonClick}
          >
            취소
          </ActionButton>
        </ActionButtonGroup>
      </Form>
    </UserEditorBlock>
  );
};

export default UserEditor;

const UserEditorBlock = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;
