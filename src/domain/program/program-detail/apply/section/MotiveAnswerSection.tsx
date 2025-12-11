import { UserInfo } from '@/lib/order';
import TextArea from '../../../../../components/common/ui/input/TextArea';

interface MotiveAnswerSectionProps {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
}

const MotiveAnswerSection = ({
  userInfo,
  setUserInfo,
}: MotiveAnswerSectionProps) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <label htmlFor="question" className="ml-3 text-xsmall14 font-semibold">
          사전 질문 (선택)
        </label>
        <TextArea
          id="question"
          name="question"
          placeholder="사전 질문을 입력해주세요."
          rows={3}
          value={userInfo.question}
          onChange={handleInputChange}
          maxLength={200}
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default MotiveAnswerSection;
