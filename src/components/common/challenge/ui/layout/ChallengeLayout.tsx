import { Outlet } from 'react-router-dom';

const ChallengeLayout = () => {
  return (
    <div>
      <nav className="text-center">챌린지 레이아웃</nav>
      <div className="mx-auto mt-10 w-[67rem]">
        <Outlet />
      </div>
    </div>
  );
};

export default ChallengeLayout;
