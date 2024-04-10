import clsx from 'clsx';
import { topicToText } from '../../../../../../../utils/convert';
import { formatMissionDateString } from '../../../../../../../utils/formatDateString';
import Button from '../../../../ui/button/Button';

interface Props {
  mission: any;
  setMenuShown: (menuShown: 'DETAIL' | 'EDIT' | 'NONE') => void;
}

const TableRowDetailMenu = ({ mission, setMenuShown }: Props) => {
  return (
    <div className="rounded-xxs mt-1 bg-neutral-100 px-4 py-8">
      <div className="mx-auto w-[40rem]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <label htmlFor="name" className="w-32 font-medium">
              미션명
            </label>
            <span>{mission.title}</span>
          </div>
          <div className="flex">
            <label htmlFor="name" className="w-32 font-medium">
              내용
            </label>
            <p className="whitespace-pre-line">{mission.contents}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <label htmlFor="name" className="w-32 font-medium">
                공개일
              </label>
              <span className="w-48">
                {mission.th}일차 ({formatMissionDateString(mission.startDate)})
              </span>
            </div>
            <div className="flex items-center">
              <label htmlFor="name" className="w-20 font-medium">
                마감일
              </label>
              <span className="w-36">
                {formatMissionDateString(mission.endDate)}
              </span>
            </div>
          </div>
          {mission.essentialContentsTopic && (
            <div className="flex gap-16">
              <div className="flex items-center">
                <label htmlFor="name" className="w-32 font-medium">
                  필수 콘텐츠
                </label>
                <div className="w-32 rounded-sm border border-neutral-400 p-2 text-sm">
                  {topicToText[mission.essentialContentsTopic]}
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-12">
            <div className="flex items-center">
              <label htmlFor="name" className="w-32 font-medium">
                추가 콘텐츠
              </label>
              <div className="w-32 rounded-sm border border-neutral-400 p-2 text-sm">
                {mission.additionalContentsTopic
                  ? topicToText[mission.additionalContentsTopic]
                  : '없음'}
              </div>
            </div>
            <div className="flex items-center">
              <label
                htmlFor="name"
                className={clsx('w-28 font-medium', {
                  'w-32': !mission.additionalContentsTopic,
                  'w-28': mission.additionalContentsTopic,
                })}
              >
                제한 콘텐츠
              </label>
              <div className="w-32 rounded-sm border border-neutral-400 p-2 text-sm">
                {mission.limitedContentsTopic
                  ? topicToText[mission.limitedContentsTopic]
                  : '없음'}
              </div>
            </div>
          </div>
          <div className="flex gap-16">
            <div className="flex items-center">
              <label htmlFor="is-refunded" className="w-32 font-medium">
                환급미션 여부
              </label>
              <span>
                {mission.refund ? (
                  <i className="cursor-pointer">
                    <img
                      src="/icons/admin-checkbox-checked.svg"
                      alt="admin-checkbox-checked"
                    />
                  </i>
                ) : (
                  <i className="cursor-pointer">
                    <img
                      src="/icons/admin-checkbox-unchecked.svg"
                      alt="admin-checkbox-unchecked"
                    />
                  </i>
                )}
              </span>
            </div>
          </div>
          {mission.comment && (
            <div className="flex items-start">
              <label htmlFor="comments" className="w-32 font-medium">
                코멘트
              </label>
              <p>{mission.comments}</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button active disableHover onClick={() => setMenuShown('EDIT')}>
            수정
          </Button>
          <Button onClick={() => setMenuShown('NONE')} disableHover>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableRowDetailMenu;
