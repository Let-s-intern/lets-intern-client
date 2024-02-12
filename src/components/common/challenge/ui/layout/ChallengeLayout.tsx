import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const ChallengeLayout = () => {
  return (
    <div className="px-6 py-6">
      <div className="mx-auto flex max-w-[1036px]">
        <NavBar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChallengeLayout;
