import { useParams } from 'react-router-dom';
import MagnetFormPage from '@/pages/magnet/MagnetFormPage';

const MagnetFormRoute = () => {
  const { id } = useParams<{ id: string }>();
  return <MagnetFormPage magnetId={id ?? ''} />;
};

export default MagnetFormRoute;
