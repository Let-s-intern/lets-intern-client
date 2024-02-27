import { useState } from 'react';
import AlertModal from '../../../ui/alert/AlertModal';
import { formatMissionDateString } from '../../../../utils/formatDateString';
import { bankTypeToText } from '../../../../utils/convert';

interface Props {
  application: any;
}

const TooltipQuestion = ({ application }: Props) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  console.log(application);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <i className="cursor-pointer" onClick={(e) => setIsTooltipOpen(true)}>
        <img
          src="/icons/tooltip-question.svg"
          alt="tooltip question"
          className="h-4 w-4"
        />
      </i>
      {isTooltipOpen && (
        <AlertModal
          onConfirm={() => setIsTooltipOpen(false)}
          title="입금 안내"
          className="cursor-auto"
          showCancel={false}
          highlight="confirm"
        >
          <ul className="flex w-96 list-disc flex-col gap-y-1 px-4 text-left">
            <li>
              보증금 입금 계좌 안내 :{' '}
              {bankTypeToText[application.programAccountType]} /{' '}
              {application.programAccountNumber}
            </li>
            <li>
              보증금 입금 기한 :{' '}
              {formatMissionDateString(application.programFeeDueDate)}까지
            </li>
            <li>
              보증금 입금 확인은 순차적으로 확인하고 있습니다. 입금 후 3일이내
              보증금 확인 뱃지 및 챌린지 대시보드 바로가기가 나타나지 않는다면,
              페이지 우측하단의 문의하기를 통해 문의주세요.
            </li>
          </ul>
        </AlertModal>
      )}
    </div>
  );
};

export default TooltipQuestion;
