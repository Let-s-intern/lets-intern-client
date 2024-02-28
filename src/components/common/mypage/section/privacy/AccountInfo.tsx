import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import BankDropdown from '../../dropdown/BankDropdown';
import axios from '../../../../../utils/axios';
import AlertModal from '../../../../ui/alert/AlertModal';

interface AccountInfoProps {}

const AccountInfo = ({}: AccountInfoProps) => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [values, setValues] = useState<any>();

  const getUser = useQuery({
    queryKey: ['user', 'account'],
    queryFn: async () => {
      const res = await axios.get('/user');
      const data = res.data;
      setValues({
        accountType: data.accountType,
        accountNumber: data.accountNumber,
      });
      return data;
    },
  });

  const editAccountInfo = useMutation({
    mutationFn: async () => {
      const res = await axios.patch('/user', values);
      const data = res.data;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setModalText('계좌 정보가 변경되었습니다.');
      setIsModalOpen(true);
    },
    onError: () => {
      setModalText('계좌 정보 변경이 실패하였습니다.');
      setIsModalOpen(true);
    },
  });

  const handleAccountInfoEdit = (e: any) => {
    e.preventDefault();
    editAccountInfo.mutate();
  };

  const isLoading = getUser.isLoading || !values;

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <section className="account-info-section">
        <h1>계좌 정보</h1>
        <form onSubmit={handleAccountInfoEdit}>
          <div className="input-group">
            <div className="input-control">
              <label htmlFor="account-bank">거래 은행</label>
              <BankDropdown values={values} setValues={setValues} />
            </div>
            <div className="input-control">
              <label htmlFor="account-number">계좌번호</label>
              <input
                type="text"
                placeholder="- 없이 숫자만 입력해주세요."
                id="account-number"
                name="accountNumber"
                autoComplete="off"
                value={values.accountNumber}
                onChange={(e) =>
                  setValues({ ...values, accountNumber: e.target.value })
                }
              />
            </div>
          </div>
          <div className="action-group">
            <button type="submit">정보 수정</button>
          </div>
        </form>
      </section>
      {isModalOpen && (
        <AlertModal
          onConfirm={() => {
            setIsModalOpen(false);
            setModalText('');
          }}
          showCancel={false}
          highlight="confirm"
          title="계좌 정보 변경"
        >
          {modalText}
        </AlertModal>
      )}
    </>
  );
};

export default AccountInfo;
