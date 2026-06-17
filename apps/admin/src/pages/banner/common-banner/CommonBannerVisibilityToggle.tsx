import { useToggleCommonBannerVisibility } from '@/api/banner';
import { Switch } from '@mui/material';

const CommonBannerVisibilityToggle = ({
  commonBannerId,
  isVisible,
}: {
  commonBannerId: number;
  isVisible: boolean;
}) => {
  const { mutate } = useToggleCommonBannerVisibility({
    errorCallback: (error) => {
      alert(error);
    },
  });

  return (
    <Switch
      checked={isVisible}
      onChange={() => mutate({ commonBannerId, isVisible: !isVisible })}
    />
  );
};

export default CommonBannerVisibilityToggle;
