import Input from '@/common/input/Input';
import EditorApp from '@/domain/admin/lexical/EditorApp';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import Heading3 from '@/domain/admin/ui/heading/Heading3';
import { LiveContent } from '@/types/interface';
import { Button, IconButton } from '@mui/material';
import { SerializedEditorState } from 'lexical';
import { MdDelete } from 'react-icons/md';

interface LiveInformationProps {
  recommendFields: string[];
  reasonFields: {
    title: string;
    content: string;
  }[];
  editorContent?: SerializedEditorState;
  setContent: React.Dispatch<React.SetStateAction<LiveContent>>;
}

const LiveInformation = ({
  recommendFields,
  reasonFields,
  editorContent,
  setContent,
}: LiveInformationProps) => {
  const setRecommendFields = (recommendFields: string[]) => {
    setContent((prev) => ({
      ...prev,
      recommend: recommendFields,
    }));
  };

  const setReasonFields = (
    reasonFields: {
      title: string;
      content: string;
    }[],
  ) => {
    setContent((prev) => ({
      ...prev,
      reason: reasonFields,
    }));
  };

  return (
    <section className="flex w-full flex-col">
      <Heading2 className="mb-6">프로그램 소개</Heading2>
      <div className="flex w-full flex-col gap-y-5">
        <div className="flex w-full flex-col gap-y-3">
          <div className="flex w-full items-center justify-between">
            <Heading3>이런 분께 추천드려요.</Heading3>
            <Button
              variant="outlined"
              onClick={() => setRecommendFields([...recommendFields, ''])}
            >
              추가
            </Button>
          </div>
          <div className="flex w-full flex-col gap-y-2">
            {recommendFields.length >= 1 &&
              recommendFields.map((_, index) => (
                <div key={index} className="flex w-full max-w-lg gap-x-4">
                  <Input
                    label="이런 분께 추천드려요."
                    size="small"
                    value={recommendFields[index]}
                    onChange={(e) => {
                      const { value } = e.target;
                      setRecommendFields(
                        recommendFields.map((field, i) =>
                          i === index ? value : field,
                        ),
                      );
                    }}
                  />
                  <IconButton
                    color="warning"
                    sx={{ border: '1px solid red', borderRadius: '10%' }}
                    onClick={() => {
                      if (recommendFields.length === 1) return;

                      setRecommendFields(
                        recommendFields.filter((_, i) => i !== index),
                      );
                    }}
                  >
                    <MdDelete />
                  </IconButton>
                </div>
              ))}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-3">
          <div className="flex w-full items-center justify-between">
            <Heading3>이번 클래스 꼭 들어야 하는 이유</Heading3>
            <Button
              variant="outlined"
              onClick={() =>
                setReasonFields([...reasonFields, { title: '', content: '' }])
              }
            >
              추가
            </Button>
          </div>
          <div className="flex w-full flex-col gap-y-2">
            {reasonFields.length >= 1 &&
              reasonFields.map((_, index) => (
                <div key={index} className="flex w-full max-w-lg gap-x-4">
                  <Input
                    label="강조할 타이틀"
                    size="small"
                    value={reasonFields[index].title}
                    onChange={(e) => {
                      const { value } = e.target;
                      setReasonFields(
                        reasonFields.map((field, i) =>
                          i === index ? { ...field, title: value } : field,
                        ),
                      );
                    }}
                  />
                  <Input
                    label="내용"
                    size="small"
                    value={reasonFields[index].content}
                    onChange={(e) => {
                      const { value } = e.target;
                      setReasonFields(
                        reasonFields.map((field, i) =>
                          i === index ? { ...field, content: value } : field,
                        ),
                      );
                    }}
                  />
                  <IconButton
                    color="warning"
                    sx={{ border: '1px solid red', borderRadius: '10%' }}
                    onClick={() => {
                      if (reasonFields.length === 1) return;

                      setReasonFields(
                        reasonFields.filter((_, i) => i !== index),
                      );
                    }}
                  >
                    <MdDelete />
                  </IconButton>
                </div>
              ))}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-3">
          <Heading3>상세 설명</Heading3>
          <EditorApp
            initialEditorStateJsonString={JSON.stringify(editorContent)}
            onChangeSerializedEditorState={(json) =>
              setContent((prev) => ({
                ...prev,
                mainDescription: json,
              }))
            }
          ></EditorApp>
        </div>
      </div>
    </section>
  );
};

export default LiveInformation;
