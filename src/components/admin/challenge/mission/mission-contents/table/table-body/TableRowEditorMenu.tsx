import clsx from 'clsx';

import Button from '../../../../ui/button/Button';
import TopicDropdown from '../../dropdown/TopicDropdown';
import TypeDropdown from '../../dropdown/TypeDropdown';

interface Props {
  values: any;
  className?: string;
  mode: 'CREATE' | 'EDIT';
  setValues: (values: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const TableRowEditorMenu = ({
  values,
  className,
  mode,
  setValues,
  onSubmit,
  onCancel,
}: Props) => {
  const handleInputChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className={clsx('rounded-xxs bg-neutral-100 px-4 py-8', className)}>
      <form className="mx-auto w-[40rem]" onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <label htmlFor="topic" className="w-32 font-medium">
              주제
            </label>
            <TopicDropdown values={values} setValues={setValues} />
          </div>
          <div className="flex items-center">
            <label htmlFor="type" className="w-32 font-medium">
              구분
            </label>
            <TypeDropdown values={values} setValues={setValues} />
          </div>
          <div className="flex items-center">
            <label htmlFor="title" className="w-32 font-medium">
              콘텐츠명
            </label>
            <input
              type="text"
              className="flex-1 rounded-sm border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
              id="title"
              autoComplete="off"
              name="title"
              defaultValue={values?.title || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="link" className="w-32 font-medium">
              링크
            </label>
            <input
              type="text"
              className="flex-1 rounded-sm border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
              id="link"
              autoComplete="off"
              name="link"
              defaultValue={values?.link || ''}
              onChange={handleInputChange}
            />
          </div>
          {/* <div className="flex items-center">
            <label htmlFor="file" className="w-32 font-medium">
              첨부파일
            </label>
            <input
              type="file"
              className="flex-1 rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
              id="file"
              name="file"
              defaultValue={values?.file || ''}
              multiple
              onChange={handleFileChange}
            />
          </div> */}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="submit" active disableHover>
            {mode === 'CREATE' ? '생성' : mode === 'EDIT' && '수정'}
          </Button>
          <Button type="button" onClick={onCancel} disableHover>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TableRowEditorMenu;
