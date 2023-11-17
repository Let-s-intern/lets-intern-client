import Input from '../../../components/Input';

const MemberInfoInputContent = () => {
  return (
    <>
      <h1 className="text-center text-xl">신청 정보</h1>
      <form className="mt-5 w-full">
        <div className="mx-auto max-w-md space-y-3">
          <Input label="이름" autoComplete="off" fullWidth />
          <Input label="이메일" autoComplete="off" fullWidth />
          <Input type="tel" label="전화번호" autoComplete="off" fullWidth />
          <Input label="학교(선택)" autoComplete="off" fullWidth />
          <Input label="학년" autoComplete="off" fullWidth />
          <Input label="전공" autoComplete="off" fullWidth />
          <Input label="관심직군" autoComplete="off" fullWidth />
          <Input label="희망 기업 형태" autoComplete="off" fullWidth />
          <Input label="지원 동기" autoComplete="off" fullWidth />
        </div>
      </form>
    </>
  );
};

export default MemberInfoInputContent;
