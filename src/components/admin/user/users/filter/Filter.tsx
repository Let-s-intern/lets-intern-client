import { useSearchParams } from 'react-router-dom';
// import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import Input from '../../../../ui/input/Input';
import ActionButton from '../../../ui/button/ActionButton';
import { useState } from 'react';
import AlertModal from '../../../../ui/alert/AlertModal';

interface FilterProps {
  setSearchValues: (searchValues: any) => void;
}

const Filter = ({ setSearchValues }: FilterProps) => {
  const [, setSearchParams] = useSearchParams();
  const [values, setValues] = useState<any>({});
  const [isShowAlert, setIsShowAlert] = useState(false);

  const handleValuesChange = (e: any) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 bg-gray-300 p-6">
        <div className="flex gap-4">
          <Input
            label="이름"
            placeholder="이름"
            type="text"
            name="name"
            value={values.name || ''}
            onChange={handleValuesChange}
          />
          <Input
            label="이메일"
            placeholder="이메일"
            type="text"
            name="email"
            value={values.email || ''}
            onChange={handleValuesChange}
          />
          <Input
            label="휴대폰 번호"
            placeholder="ex) 010-1234-5678"
            type="text"
            name="phoneNum"
            value={values.phoneNum || ''}
            onChange={handleValuesChange}
          />
        </div>
        {/* <div className="flex gap-4">
          <FormControl fullWidth>
            <InputLabel id="programType">프로그램 유형</InputLabel>
            <Select
              labelId="programType"
              id="programType"
              label="프로그램 유형"
              sx={{ backgroundColor: 'white' }}
              name="programType"
              value={values.programType || ''}
              onChange={handleValuesChange}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="CHALLENGE_FULL">챌린지(전체)</MenuItem>
              <MenuItem value="CHALLENGE_HALF">챌린지(일부)</MenuItem>
              <MenuItem value="BOOTCAMP">부트캠프</MenuItem>
              <MenuItem value="LETS_CHAT">렛츠챗</MenuItem>
            </Select>
          </FormControl>
          <Input
            label="기수"
            placeholder="기수"
            type="number"
            name="programTh"
            value={values.programTh || ''}
            onChange={handleValuesChange}
          />
        </div> */}
        <div className="flex justify-end gap-2">
          <ActionButton
            bgColor="lightBlue"
            width="8rem"
            onClick={() => {
              setSearchValues({});
              setValues({});
              setSearchParams({});
            }}
          >
            전체 보기
          </ActionButton>
          <ActionButton
            bgColor="blue"
            width="8rem"
            onClick={() => {
              if (!values.programType && values.programTh) {
                setIsShowAlert(true);
                return;
              }
              setSearchParams({});
              setSearchValues(values);
            }}
          >
            검색
          </ActionButton>
        </div>
      </div>
      {isShowAlert && (
        <AlertModal
          onConfirm={() => {
            setIsShowAlert(false);
          }}
          title="유저 검색 오류"
        >
          프로그램 유형과 기수는 같이 선택해야 합니다.
        </AlertModal>
      )}
    </>
  );
};

export default Filter;
