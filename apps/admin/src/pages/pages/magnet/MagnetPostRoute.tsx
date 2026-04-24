import { useParams } from 'react-router-dom';
import MagnetPostPage from '@/pages/magnet/MagnetPostPage';

const MagnetPostRoute = () => {
  const { id } = useParams<{ id: string }>();
  return <MagnetPostPage magnetId={id ?? 'new'} />;
};

export default MagnetPostRoute;
