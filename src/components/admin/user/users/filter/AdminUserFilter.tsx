import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AlertModal from '../../../../ui/alert/AlertModal';
import Input from '../../../../ui/input/Input';
import ActionButton from '../../../ui/button/ActionButton';

interface FilterProps {
  setSearchValues: (searchValues: any) => void;
}

const AdminUserFilter = ({ setSearchValues }: FilterProps) => {
  const router = useRouter();
  const [values, setValues] = useState<any>({
    category: 'name',
  });
  const [searchText, setSearchText] = useState('');
  const [isShowAlert, setIsShowAlert] = useState(false);

  const handleCategoryChange = (e: any) => {
    setValues({
      ...values,
      category: e.target.value,
    });
  };

  const handleSearchTextChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const search = () => {
    const searchValues: any = {};

    if (searchText.trim()) {
      searchValues[values.category] = searchText.trim();
    }

    router.push(window.location.pathname);
    setSearchValues(searchValues);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <>
      <div className="flex items-end justify-center gap-4">
        <FormControl
          size="small"
          sx={{
            minWidth: 150,
            backgroundColor: 'white',
            '& .MuiOutlinedInput-root': {
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976D2',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976D2',
              },
            },
            '& label.Mui-focused': {
              color: '#1976D2',
            },
          }}
        >
          <InputLabel>분류</InputLabel>
          <Select
            value={values.category}
            label="분류"
            onChange={handleCategoryChange}
          >
            <MenuItem value="name">이름</MenuItem>
            <MenuItem value="email">이메일</MenuItem>
            <MenuItem value="phoneNum">휴대폰 번호</MenuItem>
          </Select>
        </FormControl>

        <div className="w-1/3">
          <Input
            type="text"
            name="searchText"
            value={searchText}
            onChange={handleSearchTextChange}
            onKeyDown={onKeyDown}
            size="small"
          />
        </div>

        <ActionButton bgColor="blue" width="5rem" onClick={search}>
          검색
        </ActionButton>
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

export default AdminUserFilter;
