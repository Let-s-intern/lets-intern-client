import TextArea from '../../../../ui/input/TextArea';
import { UserInfo } from '../../section/ApplySection';

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
        <label htmlFor="motivate" className="text-1-medium">
          신청 동기
        </label>
        <TextArea
          id="motivate"
          name="motivate"
          placeholder="신청 동기를 입력해주세요."
          rows={3}
          value={userInfo.motivate}
          onChange={handleInputChange}
          maxLength={200}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="question" className="text-1-medium">
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
        />
      </div>
    </div>
  );
};

export default MotiveAnswerSection;
