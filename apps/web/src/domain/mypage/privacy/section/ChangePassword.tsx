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
      toast.success('비밀번호가 변경되었습니다', {
        description: '새 비밀번호로 다음 로그인부터 사용해주세요.',
      });
      setPasswordInfo({
        password: '',
        newPassword: '',
        confirmPassword: '',
      });
    },
    onError: async (_error) => {
      const error = _error as AxiosError;
      const status = error.response?.status;
      const serverMessage = (error.response?.data as { message?: string })
        ?.message;

      // TODO(BE 협의): 현재 백엔드는 두 가지 400을 한국어 message 문구로만 구분한다.
      //   - INVALID_PASSWORD:  "비밀번호 형식이 잘못되었습니다." (새 비번 정규식 위반)
      //   - MISMATCH_PASSWORD: "비밀번호가 일치하지 않습니다." (기존 비번 불일치)
      // 문구가 변경되면 즉시 분기 로직이 깨지므로, 추후 BE에 error code 필드
      // (예: { code: "INVALID_PASSWORD_FORMAT" | "PASSWORD_MISMATCH" })를
      // 요청하여 코드 기반 분기로 전환해야 한다.
      // 매칭 키워드는 한 곳에 모아 향후 교체 시 변경 지점을 최소화한다.
      const INVALID_FORMAT_KEYWORD = '형식';
      const MISMATCH_KEYWORD = '일치';
      if (status === 400 && serverMessage?.includes(INVALID_FORMAT_KEYWORD)) {
        toast.error('새 비밀번호 형식이 올바르지 않아요', {
          description:
            '8자 이상이며 특수문자(!@#$ 등)를 최소 1개 포함해야 합니다.',
        });
      } else if (status === 400 && serverMessage?.includes(MISMATCH_KEYWORD)) {
        toast.error('기존 비밀번호가 일치하지 않아요', {
          description: '입력하신 기존 비밀번호를 다시 확인해주세요.',
        });
      } else if (status === 400) {
        // 알 수 없는 400 — 서버 메시지가 있으면 그것을 그대로 노출
        toast.error('비밀번호를 변경할 수 없어요', {
          description: serverMessage ?? '입력값을 다시 확인해주세요.',
        });
      } else if (status === 401) {
        toast.error('로그인이 만료되었어요', {
          description: '다시 로그인한 뒤 비밀번호 변경을 시도해주세요.',
        });
      } else if (status === 429) {
        toast.error('잠시 후 다시 시도해주세요', {
          description:
            '비밀번호 변경 시도가 너무 잦아요. 잠시 뒤에 다시 시도해주세요.',
        });
      } else if (status && status >= 500) {
        toast.error('서버에 일시적인 문제가 발생했어요', {
          description:
            '잠시 후 다시 시도해주세요. 계속되면 고객센터에 문의해주세요.',
        });
      } else {
        toast.error('비밀번호 변경에 실패했어요', {
          description:
            serverMessage ?? '네트워크 상태를 확인하고 다시 시도해주세요.',
        });
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
    if (
      !passwordInfo.password ||
      !passwordInfo.newPassword ||
      !passwordInfo.confirmPassword
    ) {
      toast.error('모든 항목을 입력해주세요', {
        description:
          '기존 비밀번호, 새 비밀번호, 비밀번호 확인을 모두 채워주세요.',
      });
      return;
    }
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error('새 비밀번호와 확인이 일치하지 않아요', {
        description: '"새 비밀번호"와 "비밀번호 확인"을 동일하게 입력해주세요.',
      });
      return;
    }
    if (passwordInfo.password === passwordInfo.newPassword) {
      toast.error('새 비밀번호가 기존과 동일해요', {
        description: '보안을 위해 기존과 다른 비밀번호를 사용해주세요.',
      });
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
