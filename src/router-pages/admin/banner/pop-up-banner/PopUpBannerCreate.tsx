import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePostBannerForAdmin } from '@/api/banner';
import PopUpBannerInputContent from '../../../../components/admin/banner/pop-up-banner/PopUpBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';
import { IBannerForm } from '../../../../types/interface';

const PopUpBannerCreate = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState<IBannerForm>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    imgUrl: '',
    file: null,
  });

  const { mutate: addPopUpBanner } = usePostBannerForAdmin({
    successCallback: () => {
      navigate('/admin/banner/pop-up');
    },
    errorCallback: (error) => {
      alert(error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValue({ ...value, [e.target.name]: e.target.files[0] });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.file) return;

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
          }),
        ],
        {
          type: 'application/json',
        },
      ),
    );
    formData.append('file', value.file);

    addPopUpBanner({ type: 'POPUP', formData });
  };

  return (
    <EditorTemplate
      title="팝업 등록"
      onSubmit={handleSubmit}
      submitButton={{
        text: '등록',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <PopUpBannerInputContent value={value} onChange={handleChange} />
    </EditorTemplate>
  );
};

export default PopUpBannerCreate;
