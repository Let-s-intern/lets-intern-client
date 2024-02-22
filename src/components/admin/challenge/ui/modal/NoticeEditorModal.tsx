import ModalDropdown from '../dropdown/notice/ModalDropdown';

interface Props {
  setIsModalShown: (isModalShown: boolean) => void;
  values: any;
  setValues: (values: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const NoticeEditorModal = ({
  values,
  setIsModalShown,
  setValues,
  onSubmit,
}: Props) => {
  const handleInputChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    setIsModalShown(false);
    setValues({});
  };

  return (
    <div className="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-end bg-black bg-opacity-50">
      <div className="flex w-[calc(100%-16rem)] items-center justify-center">
        <form
          className="w-[40rem] rounded-xl bg-white px-12 py-10"
          onSubmit={onSubmit}
        >
          <h2 className="text-xl font-semibold">공지사항 등록</h2>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center">
              <label htmlFor="type" className="w-20">
                공지유형
              </label>
              <ModalDropdown values={values} setValues={setValues} />
            </div>
            <div className="flex items-center">
              <label htmlFor="title" className="w-20">
                제목
              </label>
              <input
                type="text"
                className="flex-1 rounded-md border border-neutral-400 px-4 py-2 text-sm outline-none"
                name="title"
                value={values.title || ''}
                placeholder="제목을 입력해주세요."
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="title" className="w-20">
                링크
              </label>
              <input
                type="text"
                className="flex-1 rounded-md border border-neutral-400 px-4 py-2 text-sm outline-none"
                name="link"
                value={values.link || ''}
                placeholder="링크를 입력해주세요."
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="mt-12 flex justify-end gap-2">
            <button className="rounded bg-neutral-700 px-5 py-[2px] text-sm text-white">
              등록
            </button>
            <button
              className="rounded bg-stone-300 px-5 py-[2px] text-sm"
              onClick={handleModalClose}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeEditorModal;
