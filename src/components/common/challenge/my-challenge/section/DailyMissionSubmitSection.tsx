import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import clsx from 'clsx';
import AlertModal from '../../../../ui/alert/AlertModal';
import { useLocation } from 'react-router-dom';
import { DailyMission } from '../../../../../interfaces/interface';

interface Props {
  dailyMission: DailyMission;
}

const DailyMissionSubmitSection = ({ dailyMission }: Props) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const [value, setValue] = useState(
    dailyMission.attended ? dailyMission.attendanceLink : '',
  );
  const [isLinkChecked, setIsLinkChecked] = useState(false);
  const [isValidLinkValue, setIsValidLinkValue] = useState(
    dailyMission.attended,
  );
  const [isStartedHttp, setIsStartedHttp] = useState(false);
  const [isEditing, setIsEditing] = useState(!dailyMission.attended);
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [isBack, setIsBack] = useState(false); // 뒤로가기 버튼 클릭 여부

  useEffect(() => {
    window.history.pushState('challenge', '', location.pathname);
    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [isEditing, value]);

  const handlePopstate = () => {
    if (isEditing && value !== dailyMission.attendanceLink) {
      window.history.pushState('challenge', '', location.pathname);
      setIsAlertShown(true);
      setIsBack(true);
    }
    window.removeEventListener('popstate', handlePopstate);
    window.history.go(-3);
  };

  const submitMissionLink = useMutation({
    mutationFn: async (linkValue: string) => {
      // 출석 링크 수정
      if (dailyMission.attended) {
        const res = await axios.patch(
          `/attendance/${dailyMission.attendanceId}`,
          {
            link: linkValue,
          },
        );
        const data = res.data;
        return data;
      }

      const res = await axios.post(`/attendance/${dailyMission.id}`, {
        link: linkValue,
      });
      const data = res.data;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });

  const handleMissionLinkChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    if (inputValue.startsWith('https://') || inputValue.startsWith('http://')) {
      setIsStartedHttp(true);
    } else {
      setIsStartedHttp(false);
      setIsLinkChecked(false);
    }
    const expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    const regex = new RegExp(expression);
    if (regex.test(e.target.value)) {
      setIsValidLinkValue(true);
    } else {
      setIsValidLinkValue(false);
      setIsLinkChecked(false);
    }
  };

  const handleMissionLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMissionLink.mutate(value as string);
    setIsEditing(false);
  };

  const cancelMisiionLinkChange = () => {
    // 입력값이 이전 링크와 다를 때만 팝업 띄우기
    if (dailyMission.attendanceLink !== value) setIsAlertShown(true);
    else setIsEditing(false);
  };

  return (
    <form onSubmit={handleMissionLinkSubmit}>
      <h3 className="text-1-semibold">미션 제출하기</h3>
      <p className="text-0.875 mt-1">
        {isEditing
          ? '링크를 제대로 확인해 주세요. 카톡으로 공유해야 미션 제출이 인정됩니다.'
          : '미션 제출이 완료되었습니다.'}
      </p>
      <div className="mt-4 flex items-stretch gap-4">
        <label
          htmlFor="link"
          className="text-0.875-semibold flex items-center text-neutral-35"
        >
          링크
        </label>
        <input
          type="text"
          className={clsx(
            'text-0.875 flex-1 cursor-text rounded-xxs border border-neutral-50 bg-neutral-95 px-3 py-2 outline-none',
            {
              'text-neutral-400': !isEditing,
              'border-red-500': !isValidLinkValue && value && isEditing,
              'border-primary': isValidLinkValue && value && isEditing,
            },
          )}
          id="link"
          name="link"
          placeholder="제출할 링크를 입력해주세요."
          autoComplete="off"
          onChange={handleMissionLinkChanged}
          value={value}
          disabled={!isEditing}
        />
        <button
          type="button"
          className="rounded-xxs bg-primary px-5 font-medium text-static-100 disabled:bg-neutral-70"
          onClick={() => {
            if (value) {
              Object.assign(document.createElement('a'), {
                target: '_blank',
                href: value,
                rel: 'noopenner noreferrer',
              }).click();
              setIsLinkChecked(true);
            }
          }}
          disabled={(!value && isEditing) || !isValidLinkValue}
        >
          링크 확인
        </button>
      </div>
      {value &&
        isEditing &&
        (isLinkChecked ? (
          <div className="text-0.75-medium ml-12 mt-1 text-primary">
            링크 확인을 완료하셨습니다. 링크가 올바르다면 제출 버튼을
            눌러주세요.
          </div>
        ) : !isValidLinkValue ? (
          <div className="text-0.75-medium ml-12 mt-1 text-red-500">
            URL 형식이 올바르지 않습니다.
            {!isStartedHttp && <> (https:// 또는 http://로 시작해야 합니다.)</>}
          </div>
        ) : (
          <div className="text-0.75-medium ml-12 mt-1 text-primary">
            URL을 올바르게 입력하셨습니다. 링크 확인을 진행해주세요.
          </div>
        ))}

      <div className="mt-6 text-right">
        {dailyMission.attendanceLink && (
          <button
            type="button"
            className="text-1-semibold mr-3 rounded-xxs border border-neutral-75 bg-static-100 px-5 py-2 text-center disabled:bg-gray-50 disabled:text-gray-600"
            onClick={() => {
              if (isEditing) {
                cancelMisiionLinkChange();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? '취소' : '수정하기'}
          </button>
        )}
        <button
          type="submit"
          className="text-1-semibold rounded-xxs border border-neutral-75 bg-static-100 px-5 py-2 text-center disabled:bg-gray-50 disabled:text-gray-600"
          disabled={!isEditing || !value || !isLinkChecked}
        >
          {isEditing ? '제출' : '제출 완료'}
        </button>
      </div>

      {isAlertShown && (
        <AlertModal
          onConfirm={() => {
            setValue(dailyMission.attendanceLink);
            setIsEditing(false);
            if (isBack) {
              window.removeEventListener('popstate', handlePopstate);
              window.history.go(-6);
            }
            setIsAlertShown(false);
          }}
          title="링크 변경을 취소하시겠어요?"
          onCancel={() => setIsAlertShown(false)}
          highlight="confirm"
          confirmText="링크 변경 취소"
          cancelText="수정 계속하기"
        >
          지금 취소하시면 수정사항이 삭제됩니다.
        </AlertModal>
      )}
    </form>
  );
};

export default DailyMissionSubmitSection;
