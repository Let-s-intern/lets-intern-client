import { useEffect, useRef } from 'react';
import { IGuide } from '../../../../../interfaces/interface';
import InputBox from './InputBox';

interface GuideEditorModalProps {
  values: IGuide;
  setValues: React.Dispatch<React.SetStateAction<IGuide>>;
  setIsModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const GuideEditorModal = ({
  values,
  setValues,
  setIsModalShown,
  onSubmit,
}: GuideEditorModalProps) => {
  const ref = useRef<IGuide>(values);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleModalClose = () => {
    setIsModalShown(false);
    setValues(ref.current);
  };

  return (
    <div className="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-end bg-black bg-opacity-50">
      <div className="flex w-[calc(100%-16rem)] items-center justify-center">
        <form
          className="w-[40rem] rounded-md bg-white px-12 py-10"
          onSubmit={onSubmit}
        >
          <h2 className="text-xl font-semibold">챌린지 가이드</h2>
          <div className="mt-6 flex flex-col gap-4">
            <InputBox
              key="title"
              name="title"
              label="제목"
              value={values.title}
              handleChange={handleChange}
            />
            <InputBox
              key="link"
              name="link"
              label="링크"
              value={values.link}
              handleChange={handleChange}
            />
          </div>
          <div className="mt-12 flex justify-end gap-2">
            <button
              type="submit"
              className="rounded-xxs bg-neutral-700 px-5 py-[2px] text-sm text-white"
            >
              등록
            </button>
            <button
              className="rounded-xxs bg-stone-300 px-5 py-[2px] text-sm"
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

export default GuideEditorModal;
