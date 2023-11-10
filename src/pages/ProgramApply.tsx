import { useNavigate } from 'react-router-dom';

const ProgramApply = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-5 flex w-full justify-center bg-white">
      this is modal&nbsp;
      <button className="text-primary" onClick={() => navigate(-1)}>
        X
      </button>
    </div>
  );
};

export default ProgramApply;
