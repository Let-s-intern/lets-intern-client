import { formatMissionDateString } from '../../../../../../../utils/formatDateString';
import Button from '../../../../ui/button/Button';

interface Props {
  mission: any;
  setMenuShown: (menuShown: 'DETAIL' | 'EDIT' | 'NONE') => void;
}

const TableRowDetailMenu = ({ mission, setMenuShown }: Props) => {
  return (
    <div className="mt-1 rounded bg-neutral-100 px-4 py-8">
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
            <p>{mission.contents}</p>
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
          <div className="flex gap-16">
            <div className="flex items-center">
              <label htmlFor="name" className="w-32 font-medium">
                연결 콘텐츠
              </label>
              <div className="w-36 rounded-md border border-neutral-400 p-2 text-sm">
                경험정리
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor="name" className="w-28 font-medium">
                추가 콘텐츠
              </label>
              <div className="w-32 rounded-md border border-neutral-400 p-2 text-sm">
                추가 콘텐츠 1
              </div>
            </div>
          </div>
          <div className="flex gap-16">
            <div className="flex items-center">
              <label htmlFor="is-refunded" className="w-32 font-medium">
                환급여부
              </label>
              <span>
                {mission.isRefunded ? (
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
