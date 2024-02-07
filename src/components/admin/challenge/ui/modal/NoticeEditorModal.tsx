import { IoMdArrowDropdown } from 'react-icons/io';

interface Props {
  setIsModalShown: (isModalShown: boolean) => void;
}

const NoticeEditorModal = ({ setIsModalShown }: Props) => {
  return (
    <div className="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-end bg-black bg-opacity-50">
      <div className="flex w-[calc(100%-16rem)] items-center justify-center">
        <div className="w-[40rem] rounded-xl bg-white px-12 py-10">
          <h2 className="text-xl font-semibold">공지사항 등록</h2>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center">
              <label htmlFor="type" className="w-20">
                공지유형
              </label>
              <div className="flex w-40 cursor-pointer items-center justify-between rounded-md border border-neutral-400 px-4 py-2">
                <span className="text-sm">필독</span>
                <i className="text-xl">
                  <IoMdArrowDropdown />
                </i>
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor="title" className="w-20">
                제목
              </label>
              <input
                type="text"
                className="flex-1 rounded-md border border-neutral-400 px-4 py-2 text-sm outline-none"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="title" className="w-20">
                링크
              </label>
              <input
                type="text"
                className="flex-1 rounded-md border border-neutral-400 px-4 py-2 text-sm outline-none"
              />
            </div>
          </div>
          <div className="mt-12 flex justify-end gap-2">
            <button
              className="rounded bg-stone-300 px-5 py-[2px] text-sm"
              onClick={() => setIsModalShown(false)}
            >
              취소
            </button>
            <button className="rounded bg-neutral-700 px-5 py-[2px] text-sm text-white">
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeEditorModal;
