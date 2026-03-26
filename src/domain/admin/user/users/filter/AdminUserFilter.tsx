import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AlertModal from '../../../../../common/alert/AlertModal';
import Input from '../../../../../common/input/v1/Input';
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

    // career 카테고리인 경우 "/" 기준으로 분리
    if (values.category === 'career') {
      const parts = searchText.trim().split('/');
      if (parts.length === 2) {
        searchValues.company = parts[0].trim();
        searchValues.job = parts[1].trim();
      } else if (parts.length === 1) {
        // "/" 없이 입력된 경우 company로만 검색
        searchValues.company = parts[0].trim();
      }
    } else {
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
            <MenuItem value="university">대학교</MenuItem>
            <MenuItem value="wishField">희망 직무</MenuItem>
            <MenuItem value="wishIndustry">희망 산업</MenuItem>
            <MenuItem value="wishEmploymentType">희망 구직 조건</MenuItem>
            <MenuItem value="programTitle">참여프로그램</MenuItem>
            <MenuItem value="title">주요 경험</MenuItem>
            <MenuItem value="career">주요 경력</MenuItem>
            <MenuItem value="memo">메모</MenuItem>
          </Select>
        </FormControl>

        <div className="w-1/3">
          <Input
            type="text"
            name="searchText"
            value={searchText}
            onChange={handleSearchTextChange}
            onKeyDown={onKeyDown}
            placeholder={
              values.category === 'career' ? '회사명/직무 형식으로 입력' : ''
            }
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
