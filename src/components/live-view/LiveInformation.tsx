import BubbleTail from '@/assets/bubble_tail.svg?react';
import ChevronDownIcon from '@/assets/icons/chevron-down.svg?react';
import LexicalContent from '@components/common/blog/LexicalContent';
import { SerializedEditorState } from 'lexical';

interface LiveInformationProps {
  recommendFields?: string[];
  reasonFields?: {
    title: string;
    content: string;
  }[];
  editorContent?: SerializedEditorState;
}

const LiveInformation = ({
  recommendFields,
  reasonFields,
  editorContent,
}: LiveInformationProps) => {
  if (!recommendFields && !reasonFields && !editorContent) return;

  return (
    <div className="flex w-full flex-col gap-y-5 py-8 md:items-center md:gap-y-[50px] md:py-10">
      <p className="text-xsmall14 font-semibold text-neutral-45 md:text-small20">
        클래스 소개
      </p>
      <div className="flex w-full flex-col gap-y-[50px] md:gap-y-[140px]">
        {recommendFields &&
          recommendFields.length > 0 &&
          recommendFields[0] !== '' && (
            <div className="flex w-full flex-col items-center">
              <div className="flex w-full flex-col items-center justify-center gap-y-8 rounded-md bg-[#F4F5FF] px-4 pb-[46px] pt-[50px]">
                <div className="flex w-full flex-col gap-y-1 md:items-center">
                  <p className="text-xsmall14 font-semibold text-primary md:text-small18">
                    혼자서는 너무 막막한 취업 준비
                  </p>
                  <p className="whitespace-pre text-small20 font-bold md:text-center md:text-xlarge28">{`커리어의 시작과 성장,\n어떻게 준비하고 계신가요?`}</p>
                </div>
                <div className="flex w-full flex-col gap-y-3">
                  {recommendFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex w-full items-center gap-x-[14px] rounded-md bg-white px-2.5 py-[14px] md:justify-center md:px-[50px] md:py-[30px]"
                    >
                      <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-primary text-white md:h-[30px] md:w-[30px]">
                        <ChevronDownIcon />
                      </div>
                      <p className="text-xsmall14 font-semibold md:text-medium24">
                        {field}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <BubbleTail className="h-auto w-fit md:w-52" />
            </div>
          )}
        {reasonFields &&
          reasonFields.length > 0 &&
          reasonFields[0].title !== '' && (
            <div className="flex w-full flex-col gap-y-8">
              <div className="flex w-full flex-col gap-y-1 md:items-center">
                <p className="text-xsmall14 font-semibold text-primary md:text-small18">
                  더욱 특별한 LIVE 클래스
                </p>
                <p className="text-small20 font-bold text-neutral-0 md:text-xlarge28">
                  이번 클래스 꼭 들어야하는 이유
                </p>
              </div>
              <div className="flex w-full flex-col gap-y-5">
                {reasonFields.map((reason, index) => (
                  <div
                    className="flex w-full flex-col items-center justify-center gap-y-2 rounded-md bg-neutral-100 px-[30px] pb-5 pt-[14px]"
                    key={`reason${index}`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xsmall14 font-semibold text-white md:h-[30px] md:w-[30px] md:text-small20">
                      {index + 1}
                    </span>
                    <div className="flex w-full flex-col items-center gap-y-1 text-xsmall14 md:text-medium24">
                      <p className="font-semibold">{reason.title}</p>
                      <p className="font-medium">{reason.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        {editorContent && <LexicalContent node={editorContent.root} />}
      </div>
    </div>
  );
};
export default LiveInformation;