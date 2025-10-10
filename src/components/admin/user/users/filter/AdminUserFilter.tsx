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
  const [values, setValues] = useState<any>({});
  const [isShowAlert, setIsShowAlert] = useState(false);

  const handleValuesChange = (e: any) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const search = () => {
    if (!values.programType && values.programTh) {
      setIsShowAlert(true);
      return;
    }
    router.push(window.location.pathname);
    setSearchValues(values);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 bg-neutral-300 p-6">
        <div className="flex gap-4">
          <Input
            label="이름"
            placeholder="이름"
            type="text"
            name="name"
            value={values.name || ''}
            onChange={handleValuesChange}
            onKeyDown={onKeyDown}
          />
          <Input
            label="이메일"
            placeholder="이메일"
            type="text"
            name="email"
            value={values.email || ''}
            onChange={handleValuesChange}
            onKeyDown={onKeyDown}
          />
          <Input
            label="휴대폰 번호"
            placeholder="ex) 010-1234-5678"
            type="text"
            name="phoneNum"
            value={values.phoneNum || ''}
            onChange={handleValuesChange}
            onKeyDown={onKeyDown}
          />
        </div>

        <div className="flex justify-end gap-2">
          <ActionButton
            bgColor="lightBlue"
            width="8rem"
            onClick={() => {
              setSearchValues({});
              setValues({});
              router.push(window.location.pathname);
            }}
          >
            전체 보기
          </ActionButton>
          <ActionButton bgColor="blue" width="8rem" onClick={search}>
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

export default AdminUserFilter;
