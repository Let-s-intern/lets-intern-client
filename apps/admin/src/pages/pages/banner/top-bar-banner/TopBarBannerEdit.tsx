import {
  BannerItemType,
  useEditBannerForAdmin,
  useGetBannerDetailForAdmin,
} from '@/api/banner';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import TopBarBannerInputContent from '@/domain/admin/banner/top-bar-banner/TopBarBannerInputContent';
import { toUploadFile } from '@/domain/admin/banner/top-bar-banner/toUploadFile';
import EditorTemplate from '@/domain/admin/program/ui/editor/EditorTemplate';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const TopBarBannerEdit = () => {
  const navigate = useNavigate();
  const params = useParams<{ bannerId: string }>();
  const bannerId = Number(params.bannerId);

  const [value, setValue] = useState<BannerItemType>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    contents: '',
    textColorCode: '#000000',
    colorCode: '#000000',
    imageLink: '',
  });

  const { data: banner, isLoading: bannerIsLoading } =
    useGetBannerDetailForAdmin({
      bannerId,
      type: 'LINE',
    });

  const { mutate: editTopBarBanner } = useEditBannerForAdmin({
    successCallback: () => {
      alert('상단 띠 배너가 수정되었습니다.');
      navigate('/banner/top-bar-banners');
    },
    errorCallback: (error) => {
      alert(error);
    },
  });

  useEffect(() => {
    if (banner) {
      setValue(banner.bannerAdminDetailVo);
    }
  }, [banner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      'requestDto',
      new Blob(
        [
          JSON.stringify({
            title: value.title,
            link: value.link,
            startDate: value.startDate,
            endDate: value.endDate,
            contents: value.contents,
            colorCode: value.colorCode,
            textColorCode: value.textColorCode,
            imageLink: value.imageLink ?? '',
            deleteImage: value.deleteImage,
            deleteMobileImage: value.deleteMobileImage,
          }),
        ],
        {
          type: 'application/json',
        },
      ),
    );

    if (value.file) formData.append('file', toUploadFile(value.file));
    if (value.mobileFile) {
      formData.append('mobileFile', toUploadFile(value.mobileFile));
    }

    editTopBarBanner({ bannerId, type: 'LINE', formData });
  };

  return (
    <EditorTemplate
      title="상단 띠 배너 수정"
      onSubmit={handleSubmit}
      submitButton={{
        text: '수정',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      {bannerIsLoading ? (
        <LoadingContainer />
      ) : !banner ? (
        <EmptyContainer />
      ) : (
        <TopBarBannerInputContent
          value={value}
          onChange={handleChange}
          onImageChange={(image) => setValue({ ...value, ...image })}
        />
      )}
    </EditorTemplate>
  );
};

export default TopBarBannerEdit;
