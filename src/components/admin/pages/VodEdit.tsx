'use client';

import {
  useGetVodQuery,
  useGetVodQueryKey,
  usePatchVodMutation,
} from '@/api/program';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { UpdateVodReq } from '@/schema';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import VodEditor from './program/VodEditor';

const VodEdit: React.FC = () => {
  const { mutateAsync: patchVod } = usePatchVodMutation();
  const params = useParams<{ vodId: string }>();
  const { vodId: vodIdString } = params;
  const client = useQueryClient();
  const { data: vod } = useGetVodQuery({
    vodId: Number(vodIdString),
    enabled: Boolean(vodIdString),
  });

  const [input, setInput] = useState<Omit<UpdateVodReq, 'desc'>>({});
  const [loading, setLoading] = useState(false);
  const { snackbar } = useAdminSnackbar();

  const onClickSave = useCallback(async () => {
    if (!vodIdString) {
      throw new Error('vodId is required');
    }

    setLoading(true);
    const req: Parameters<typeof patchVod>[0] = {
      ...input,
      vodId: Number(vodIdString),
    };

    console.log('req', req);
    const res = await patchVod(req);
    client.invalidateQueries({
      queryKey: [useGetVodQueryKey, Number(vodIdString)],
    });
    console.log('res', res);

    setLoading(false);
    snackbar('저장되었습니다.');
  }, [vodIdString, input, patchVod, client, snackbar]);

  if (!vod) {
    return <div>loading...</div>;
  }

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>VOD 생성</Heading>
      </Header>
      <VodEditor defaultValue={vod} setInput={setInput} />
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

export default VodEdit;
