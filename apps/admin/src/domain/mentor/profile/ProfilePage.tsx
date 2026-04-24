import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePatchUser, useUserQuery } from '@/api/user/user';
import mentorConfig from '../constants/config';
import MentorAlertModal from '../ui/MentorAlertModal';
import { useMentorAlert } from '../hooks/useMentorAlert';
import BasicInfo, { type BasicInfoFormData } from './ui/BasicInfo';
import CareerSection from './ui/CareerSection';
import Introduction from './ui/Introduction';

const INITIAL_FORM_DATA: BasicInfoFormData = {
  name: '',
  nickname: '',
  phoneNum: '',
  sns: '',
  email: '',
  profileImgUrl: '',
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: user } = useUserQuery();
  const { alertProps, showAlert } = useMentorAlert();

  const [formData, setFormData] = useState<BasicInfoFormData>(INITIAL_FORM_DATA);
  const [introduction, setIntroduction] = useState('');

  const [savedFormData, setSavedFormData] =
    useState<BasicInfoFormData>(INITIAL_FORM_DATA);
  const [savedIntroduction, setSavedIntroduction] = useState('');

  // Navigation guard state
  const [navGuard, setNavGuard] = useState<{
    isOpen: boolean;
    pendingHref: string | null;
    pendingAction: 'push' | 'back' | null;
  }>({ isOpen: false, pendingHref: null, pendingAction: null });
  const isNavigatingRef = useRef(false);

  const { mutate: patchUser, isPending } = usePatchUser(
    () => {
      setSavedFormData(formData);
      setSavedIntroduction(introduction);
      showAlert({
        title: mentorConfig.profile.saveSuccess,
        variant: 'success',
      });
    },
    () =>
      showAlert({
        title: mentorConfig.profile.saveFail,
        variant: 'error',
      }),
  );

  useEffect(() => {
    if (!user) return;
    const data: BasicInfoFormData = {
      name: user.name ?? '',
      nickname: user.nickname ?? '',
      email: user.email ?? '',
      phoneNum: user.phoneNum ?? '',
      sns: user.sns ?? '',
      profileImgUrl: user.profileImgUrl ?? '',
    };
    setFormData(data);
    setSavedFormData(data);

    const intro = user.introduction ?? '';
    setIntroduction(intro);
    setSavedIntroduction(intro);
  }, [user]);

  const hasUnsavedChanges = useMemo(() => {
    const isFormChanged =
      formData.name !== savedFormData.name ||
      formData.nickname !== savedFormData.nickname ||
      formData.phoneNum !== savedFormData.phoneNum ||
      formData.sns !== savedFormData.sns ||
      formData.email !== savedFormData.email ||
      formData.profileImgUrl !== savedFormData.profileImgUrl;
    const isIntroChanged = introduction !== savedIntroduction;
    return isFormChanged || isIntroChanged;
  }, [formData, savedFormData, introduction, savedIntroduction]);

  // Navigation guard: intercept link clicks + popstate + beforeunload
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.returnValue = '';
    };

    const handlePopState = () => {
      if (!isNavigatingRef.current) {
        window.history.pushState(null, '', window.location.href);
        setNavGuard({ isOpen: true, pendingHref: null, pendingAction: 'back' });
      }
    };

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (
        anchor?.href &&
        anchor.href !== window.location.href &&
        anchor.href.startsWith(window.location.origin)
      ) {
        e.preventDefault();
        e.stopPropagation();
        setNavGuard({
          isOpen: true,
          pendingHref: anchor.href,
          pendingAction: 'push',
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick, true);
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick, true);
    };
  }, [hasUnsavedChanges]);

  const handleNavConfirm = useCallback(() => {
    isNavigatingRef.current = true;
    const { pendingHref, pendingAction } = navGuard;
    setNavGuard({ isOpen: false, pendingHref: null, pendingAction: null });
    if (pendingAction === 'back') {
      navigate(-1);
    } else if (pendingHref) {
      navigate(pendingHref);
    }
  }, [navGuard, navigate]);

  const handleNavCancel = useCallback(() => {
    setNavGuard({ isOpen: false, pendingHref: null, pendingAction: null });
  }, []);

  const handleDiscard = useCallback(() => {
    setFormData(savedFormData);
    setIntroduction(savedIntroduction);
  }, [savedFormData, savedIntroduction]);

  const handleSave = useCallback(() => {
    patchUser({
      name: formData.name || undefined,
      nickname: formData.nickname || null,
      phoneNum: formData.phoneNum || undefined,
      sns: formData.sns || null,
      email: formData.email || undefined,
      introduction: introduction || null,
      profileImgUrl: formData.profileImgUrl || null,
    });
  }, [formData, introduction, patchUser]);

  return (
    <div className="mx-auto max-w-3xl px-0 py-4 md:px-8 md:py-8">
      <h1 className="mb-1 text-xl font-bold">프로필</h1>
      <hr className="mb-6 border-gray-200" />

      <div className="flex flex-col gap-6 pb-20">
        <BasicInfo formData={formData} onChange={setFormData} showAlert={showAlert} />
        <Introduction value={introduction} onChange={setIntroduction} />
        <CareerSection />
      </div>

      {/* Floating save / discard buttons */}
      <div
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
          hasUnsavedChanges
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-black/5">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 md:px-10"
          >
            {isPending ? '저장 중...' : '저장'}
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 md:px-4"
          >
            취소
          </button>
        </div>
      </div>

      {/* Navigation guard modal */}
      <MentorAlertModal
        isOpen={navGuard.isOpen}
        onClose={handleNavCancel}
        onConfirm={handleNavConfirm}
        title="변경사항이 저장되지 않았습니다"
        description="저장하지 않고 페이지를 나가시겠습니까?"
        confirmText="나가기"
        cancelText="취소"
        variant="confirm"
      />

      <MentorAlertModal {...alertProps} />
    </div>
  );
}
