import ProgramBanners from '@/domain/admin/pages/banner/integrated-banner/all/ProgramBanners';
import PositionBanners from '@/domain/admin/pages/banner/integrated-banner/position/PositionBanners';

const IntegratedBanners = () => {
  return (
    <>
      <ProgramBanners />
      <PositionBanners />
    </>
  );
};

export default IntegratedBanners;
