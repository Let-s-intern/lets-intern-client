import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import Input from '../../../../common/ui/input/Input';
import axios from '../../../../utils/axios';
import Button from '../../ui/button/Button';
import BankDropdown from '../form-control/BankDropdown';

export interface AccountInfoValue {
  accountType: string;
  accountNum: string;
}

/* 마이페이지 > 개인정보에서 더 이상 사용 안 함 */
const AccountInfo = () => {
  const queryClient = useQueryClient();

  const [value, setValue] = useState<AccountInfoValue>({
    accountType: '',
    accountNum: '',
  });

  useQuery({
    queryKey: ['user', '_account-info'],
    queryFn: async () => {
      const res = await axios.get('/user');
      setValue({
        ...res.data.data,
      });
      return res.data;
    },
  });

  const editAccountInfo = useMutation({
    mutationFn: async ({ value }: { value: AccountInfoValue }) => {
      const res = await axios.patch('/user', value);
      return res.data;
    },
    onSuccess: async () => {
      alert('계좌 정보가 수정되었습니다.');
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    editAccountInfo.mutate({ value });
  };

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">계좌 정보</h1>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="bank" className="text-1-medium">
            거래 은행
          </label>
          <BankDropdown value={value} setValue={setValue} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="accountNum" className="text-1-medium">
            계좌번호
          </label>
          <Input
            id="accountNum"
            name="accountNum"
            placeholder="계좌번호를 입력해주세요."
            value={value.accountNum}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <Button className="w-full" onClick={handleSubmit}>
        계좌 정보 수정하기
      </Button>
    </section>
  );
};

export default AccountInfo;
