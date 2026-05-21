/**
 * 비밀번호 변경 섹션. 디자인 시스템 import:
 *   - EditConfirmDialog: 변경 직전 confirm 다이얼로그
 *   - useToast: 변경 결과/검증 에러 알림 (success 1 + error 4)
 * 둘 다 @letscareer/ui에서만 import. raw alert/confirm 직접 사용 금지.
 */
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { EditConfirmDialog, useToast } from '@letscareer/ui';
import { AxiosError } from 'axios';
import Input from '../../../../common/input/v2/Input';
import axios from '../../../../utils/axios';
import Button from '../../ui/button/Button';

const ChangePassword = () => {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [passwordInfo, setPasswordInfo] = useState<{
    password: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      const res = await axios.patch('/user/password', {
        password: passwordInfo.password,
        newPassword: passwordInfo.newPassword,
      });
      return res.data;
    },
    onSuccess: async () => {
      toast.success('비밀번호가 변경되었습니다');
      setPasswordInfo({
        password: '',
        newPassword: '',
        confirmPassword: '',
      });
    },
    onError: async (_error) => {
      const error = _error as AxiosError;
      const status = (error.response?.data as { status: number })?.status;
      if (status === 400) {
        toast.error('기존 비밀번호가 올바르지 않습니다');
      } else {
        toast.error('비밀번호 변경에 실패했습니다');
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInfo({
      ...passwordInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다');
      return;
    } else if (passwordInfo.password === passwordInfo.newPassword) {
      toast.error('기존 비밀번호와 새로운 비밀번호가 같습니다');
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    changePassword.mutate();
  };

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">비밀번호 변경</h1>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-1-medium">
            기존 비밀번호
          </label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="기존 비밀번호를 입력해주세요."
            value={passwordInfo.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="newPassword" className="text-1-medium">
            새로운 비밀번호
          </label>
          <Input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="영문, 숫자, 특수문자 포함 8자리 이상."
            value={passwordInfo.newPassword}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-1-medium">
          비밀번호 확인
        </label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력해주세요."
          value={passwordInfo.confirmPassword}
          onChange={handleInputChange}
        />
      </div>
      <Button className="w-full" onClick={handleSubmit}>
        비밀번호 변경
      </Button>
      <EditConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="비밀번호를 변경하시겠어요?"
        description="변경 후 새 비밀번호로 다시 로그인해야 할 수 있습니다."
        confirmLabel="변경"
        onConfirm={handleConfirm}
      />
    </section>
  );
};

export default ChangePassword;
