import Input from '../../../components/Input';

interface MemberInfoInputContentProps {
  user: any;
  handleApplyInput: (e: any) => void;
}

const MemberInfoInputContent = ({
  user,
  handleApplyInput,
}: MemberInfoInputContentProps) => {
  return (
    <>
      <h1 className="text-center text-xl">신청 정보</h1>
      <form className="mt-5 w-full">
        <div className="mx-auto max-w-md space-y-3">
          <Input
            label="이름"
            name="name"
            value={user.name}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            type="email"
            label="이메일"
            name="email"
            value={user.email}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            type="tel"
            label="전화번호"
            name="phoneNum"
            value={user.phoneNum}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            label="학교(선택)"
            name="university"
            value={user.university}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            label="전공"
            name="major"
            value={user.major}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            type="number"
            label="학년"
            name="grade"
            value={user.grade}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            label="관심직군"
            name="wishJob"
            value={user.wishJob}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            label="희망 기업 형태"
            name="wishCompany"
            value={user.wishCompany}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            label="지원 동기"
            name="applyMotive"
            value={user.applyMotive}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            label="사전 질문"
            name="preQuestions"
            value={user.preQuestion}
            onChange={(e) => handleApplyInput(e)}
          />
        </div>
      </form>
    </>
  );
};

export default MemberInfoInputContent;
