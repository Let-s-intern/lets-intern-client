import clsx from 'clsx';
import { useEffect, useState } from 'react';

import Button from '../../../../ui/button/Button';
import AdditionalDropdown from '../../dropdown/AdditionalDropdown';
import EssentialDropdown from '../../dropdown/EssentialDropdown';
import LimitedDropdown from '../../dropdown/LimitedDropdown';
import TopicDropdown from '../../dropdown/TopicDropdown';
import TypeDropdown from '../../dropdown/TypeDropdown';

interface Props {
  values: any;
  className?: string;
  mode: 'CREATE' | 'EDIT';
  setValues: (values: any) => void;
  // setMenuShown?: (menuShown: 'DETAIL' | 'EDIT' | 'NONE') => void;
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
  const [hasRefund, setHasRefund] = useState(values?.isRefunded || false);

  const handleInputChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setValues({ ...values, isRefunded: hasRefund });
  }, [hasRefund]);

  return (
    <div className={clsx('rounded bg-neutral-100 px-4 py-8', className)}>
      <form className="mx-auto w-[40rem]" onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <label htmlFor="type" className="w-32 font-medium">
              유형
            </label>
            <TypeDropdown values={values} setValues={setValues} />
          </div>
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
          <div className="flex items-start">
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
          </div>
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
            <label htmlFor="template" className="w-32 font-medium">
              템플릿 링크
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
          <div className="flex items-center">
            <label htmlFor="topic" className="w-32 font-medium">
              주제
            </label>
            <TopicDropdown values={values} setValues={setValues} />
          </div>
          <div className="flex items-center">
            <label htmlFor="essential-contents" className="w-32 font-medium">
              필수 콘텐츠
            </label>
            <EssentialDropdown values={values} setValues={setValues} />
          </div>
          <div className="flex gap-8">
            <div className="flex items-center">
              <label htmlFor="additional-contents" className="w-32 font-medium">
                추가 콘텐츠
              </label>
              <AdditionalDropdown values={values} setValues={setValues} />
            </div>
            <div className="flex items-center">
              <label htmlFor="limited-contents" className="w-28 font-medium">
                제한 콘텐츠
              </label>
              <LimitedDropdown values={values} setValues={setValues} />
            </div>
          </div>
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
