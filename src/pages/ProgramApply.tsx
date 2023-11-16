import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';

const ProgramApply = () => {
  const navigate = useNavigate();

  return (
    <div
      className="fixed bottom-0 z-[100] h-screen w-screen cursor-pointer bg-black bg-opacity-50"
      onClick={() => navigate(-1)}
    >
      <div
        className="fixed bottom-0 flex w-full cursor-auto justify-center"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="fixed bottom-0 w-full max-w-2xl rounded-tl-2xl rounded-tr-2xl bg-white shadow">
          <div className="px-6 py-8">
            <h1 className="text-center text-xl">신청 정보</h1>
            <form className="mt-5 w-full">
              <div className="mx-auto max-w-md space-y-3">
                <Input label="이름" autoComplete="off" fullWidth />
                <Input label="생년월일" autoComplete="off" fullWidth />
                <Input label="지원동기" autoComplete="off" fullWidth />
              </div>
            </form>
          </div>
          <button
            type="submit"
            className="w-full bg-primary py-3 font-medium text-white"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramApply;
