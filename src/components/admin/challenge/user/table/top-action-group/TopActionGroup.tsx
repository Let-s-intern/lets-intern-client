import Button from '../../../ui/button/Button';
import DownloadButtonGroup from './DownloadButtonGroup';

interface Props {
  applicationList: any;
}

const TopActionGroup = ({ applicationList }: Props) => {
  return (
    <div className="flex justify-start border-b border-zinc-300 bg-[#F4F4F4] px-8 py-3">
      <DownloadButtonGroup applicationList={applicationList} />
    </div>
  );
};

export default TopActionGroup;
