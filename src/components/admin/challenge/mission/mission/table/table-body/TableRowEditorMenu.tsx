import { useEffect, useState } from 'react';
import Button from '../../../../ui/button/Button';

interface Props {
  values: any;
  setValues: (values: any) => void;
  setMenuShown: (menuShown: 'DETAIL' | 'EDIT' | 'NONE') => void;
  onSubmit: (e: React.FormEvent) => void;
}

const TableRowEditorMenu = ({
  values,
  setValues,
  setMenuShown,
  onSubmit,
}: Props) => {
  const [hasRefund, setHasRefund] = useState(values?.isRefunded || false);

  const handleInputChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setValues({ ...values, isRefunded: hasRefund });
  }, [hasRefund]);

  return (
    <div className="mt-1 rounded bg-neutral-100 px-4 py-8">
      <form className="mx-auto w-[40rem]" onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <label htmlFor="title" className="w-32 font-medium">
              미션명
            </label>
            <input
              type="text"
              className="flex-1 rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
              id="title"
              autoComplete="off"
              name="title"
              defaultValue={values?.title || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-start">
            <label htmlFor="content" className="mt-2 w-32 font-medium">
              내용
            </label>
            <textarea
              className="flex-1 resize-none rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
              id="content"
              rows={5}
              name="contents"
              defaultValue={values?.contents || ''}
              onChange={handleInputChange}
            />
          </div>
          {/* <div className="flex items-start">
            <label htmlFor="guide" className="mt-2 w-32 font-medium">
              가이드
            </label>
            <textarea
              className="flex-1 resize-none rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
              id="guide"
              rows={5}
              name="guide"
              defaultValue={values?.guide || ''}
              onChange={handleInputChange}
            />
          </div> */}
          <div>
            <div className="flex items-center">
              <div className="flex items-center">
                <label htmlFor="day" className="w-32 font-medium">
                  일차
                </label>
                <input
                  type="number"
                  className="rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
                  id="day"
                  autoComplete="off"
                  name="th"
                  defaultValue={values?.th || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <label htmlFor="start-date" className="w-32 font-medium">
              시작 일자
            </label>
            <input
              type="datetime-local"
              className="rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
              id="start-date"
              name="startDate"
              step={1}
              defaultValue={values?.startDate || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="end-date" className="w-32 font-medium">
              마감 일자
            </label>
            <input
              type="datetime-local"
              className="rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
              id="end-date"
              name="endDate"
              step={1}
              defaultValue={values?.endDate || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="template" className="w-32 font-medium">
              미션 템플릿
            </label>
            <input
              type="text"
              className="flex-1 rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
              id="template"
              autoComplete="off"
              name="template"
              defaultValue={values?.template || ''}
              onChange={handleInputChange}
            />
          </div>
          {/* <div className="flex items-center">
            <label htmlFor="link-contents" className="w-32 font-medium">
              연결 콘텐츠
            </label>
            <input
              type="text"
              className="flex-1 rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
              id="link-contents"
              autoComplete="off"
            />
          </div> */}
          {/* <div>
            <label htmlFor="name">환급 여부</label>
            <ul>
              <li className="bg-white">경험정리</li>
            </ul>
          </div> */}
          {/* <div className="flex items-center">
            <label htmlFor="comment" className="w-32 font-medium">
              코멘트
            </label>
            <input
              type="text"
              className="flex-1 rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
              id="comment"
              autoComplete="off"
            />
          </div> */}
          <div className="flex items-center">
            <label htmlFor="refund" className="w-32 font-medium">
              환급여부
            </label>
            <div className="flex items-center gap-4">
              <div
                className="cursor-pointer"
                onClick={() => setHasRefund(!hasRefund)}
              >
                {hasRefund ? (
                  <i>
                    <img
                      src="/icons/admin-checkbox-checked.svg"
                      alt="checkbox-checked"
                    />
                  </i>
                ) : (
                  <i>
                    <img
                      src="/icons/admin-checkbox-unchecked.svg"
                      alt="checkbox-unchecked"
                    />
                  </i>
                )}
              </div>
              {hasRefund ? (
                <input
                  type="number"
                  className="flex-1 rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
                  id="refund"
                  autoComplete="off"
                  name="refund"
                  defaultValue={values?.refund || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <input
                  type="number"
                  className="flex-1 rounded-lg border border-[#A3A3A3] bg-[#F5F5F5] px-3 py-2 text-sm opacity-0 outline-none"
                  defaultValue="None"
                />
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="submit" active disableHover>
            수정
          </Button>
          <Button
            type="button"
            onClick={() => setMenuShown('DETAIL')}
            disableHover
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TableRowEditorMenu;
