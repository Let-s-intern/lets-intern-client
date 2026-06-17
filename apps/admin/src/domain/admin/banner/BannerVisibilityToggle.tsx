import {
  BannerAdminListItemType,
  bannerType,
  useEditBannerForAdmin,
} from '@/api/banner';
import { Switch } from '@mui/material';

const BannerVisibilityToggle = ({
  type,
  row,
}: {
  type: bannerType;
  row: BannerAdminListItemType;
}) => {
  const { mutate: editBanner } = useEditBannerForAdmin({
    errorCallback: (error) => {
      alert(error);
    },
  });

  const handleToggle = (isVisible: boolean) => {
    const formData = new FormData();
    formData.append(
      'requestDto',
      new Blob(
        [
          JSON.stringify({
            isVisible,
          }),
        ],
        {
          type: 'application/json',
        },
      ),
    );
    editBanner({
      bannerId: row.id,
      type,
      formData,
    });
  };

  return (
    <Switch
      checked={row.isVisible ?? false}
      onChange={() => handleToggle(!row.isVisible)}
    />
  );
};

export default BannerVisibilityToggle;
