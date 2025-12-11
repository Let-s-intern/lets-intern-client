'use client';

import { usePostVodMutation } from '@/api/program';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { CreateVodReq } from '@/schema';
import { Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import VodEditor from './program/VodEditor';

const VodCreate: React.FC = () => {
  const { mutateAsync: postVod } = usePostVodMutation();

  const [input, setInput] = useState<CreateVodReq>({
    job: '',
    title: '',
    link: '',
    thumbnail: '',
    programTypeInfo: [],
    adminProgramTypeInfo: [],
    shortDesc: '',
  });

  const [loading, setLoading] = useState(false);
  const { snackbar } = useAdminSnackbar();

  const onClickSave = useCallback(async () => {
    setLoading(true);

    console.log('req', input);
    const res = await postVod(input);
    console.log('res', res);

    setLoading(false);
    snackbar('저장되었습니다.');
  }, [input, postVod, snackbar]);

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>VOD 생성</Heading>
      </Header>
      <VodEditor<CreateVodReq> setInput={setInput} />
      <section className="mb-6 mt-3">
        <div className="mb-6 grid w-full grid-cols-2 gap-3"></div>
      </section>

      <footer className="flex items-center justify-end gap-3">
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={<FaSave size={12} />}
          onClick={onClickSave}
        >
          저장
        </Button>
      </footer>
    </div>
  );
};

export default VodCreate;
