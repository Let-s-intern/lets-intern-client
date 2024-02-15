import MissionIcon from './MissionIcon';

interface Props {
  mission: any;
}

const MissionGridItem = ({ mission }: Props) => {
  return (
    <div>
      <span className="block w-full text-center text-xs">2/4</span>
      <MissionIcon className="mt-3" mission={mission} />
    </div>
  );
};

export default MissionGridItem;
