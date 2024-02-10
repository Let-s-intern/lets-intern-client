import Button from '../../../../ui/button/Button';

interface Props {
  setIsMenuShown: (isMenuShown: boolean) => void;
}

const TableRowMenu = ({ setIsMenuShown }: Props) => {
  return (
    <div className="mt-1 rounded bg-neutral-100 px-4 py-8">
      <div className="mx-auto w-[40rem]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <label htmlFor="name" className="w-32 font-medium">
              구분
            </label>
            <div className="w-32 rounded-md border border-neutral-400 px-3 py-2 text-sm">
              추가 콘텐츠 1
            </div>
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="w-32 font-medium">
              콘텐츠명
            </label>
            <input
              className="w-80 rounded-md border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm outline-none"
              placeholder="콘텐츠명을 입력해주세요."
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="w-32 font-medium">
              링크
            </label>
            <input
              className="w-80 rounded-md border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm outline-none"
              placeholder="링크를 입력해주세요."
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="w-32 font-medium">
              첨부파일
            </label>
            <input
              className="w-80 rounded-md border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm outline-none"
              placeholder="첨부파일을 선택해주세요."
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button active disableHover>
            수정
          </Button>
          <Button onClick={() => setIsMenuShown(false)} disableHover>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableRowMenu;
