import Button from '../../../../ui/button/Button';

interface Props {
  setMenuShown: (menuShown: 'DETAIL' | 'EDIT' | 'NONE') => void;
}

const TableRowDetailMenu = ({ setMenuShown }: Props) => {
  return (
    <div className="mt-1 rounded bg-neutral-100 px-4 py-8">
      <div className="mx-auto w-[40rem]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <label htmlFor="name" className="w-32 font-medium">
              미션명
            </label>
            <span>n일차. 미션이름</span>
          </div>
          <div className="flex">
            <label htmlFor="name" className="w-32 font-medium">
              내용
            </label>
            <p>
              미션 내용
              <br />
              미션 내용
            </p>
          </div>
          <div className="flex gap-16">
            <div className="flex items-center">
              <label htmlFor="name" className="w-32 font-medium">
                공개일
              </label>
              <span className="w-36">1일차 (2024.01.26)</span>
            </div>
            <div className="flex items-center">
              <label htmlFor="name" className="w-20 font-medium">
                마감일
              </label>
              <span className="w-36">2024.01.27 8:00 </span>
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
              <label htmlFor="name" className="w-32 font-medium">
                내용
              </label>
              <span>
                <i>
                  <img
                    src="/icons/admin-checkbox-unchecked.svg"
                    alt="admin-checkbox-unchecked"
                    className="cursor-pointer"
                  />
                </i>
              </span>
            </div>
            <div className="flex items-center">
              <label htmlFor="name" className="w-24 font-medium">
                추가 질문
              </label>
              <p>추가 질문입니다. 추가 질문입니다.</p>
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
