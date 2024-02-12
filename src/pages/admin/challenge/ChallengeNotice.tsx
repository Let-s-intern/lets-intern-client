import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import TableBody from '../../../components/admin/challenge/notice/table/table-body/TableBody';
import TableHead from '../../../components/admin/challenge/notice/table/table-head/TableHead';
import Button from '../../../components/admin/challenge/ui/button/Button';
import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import NoticeEditorModal from '../../../components/admin/challenge/ui/modal/NoticeEditorModal';
import axios from '../../../utils/axios';

const ChallengeNotice = () => {
  const queryClient = useQueryClient();

  const [isModalShown, setIsModalShown] = useState(false);
  const [values, setValues] = useState<any>({});

  const addNotice = useMutation({
    mutationFn: async (values) => {
      const res = await axios.post('/notice/19', values);
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notice'] });
      setIsModalShown(false);
    },
  });

  const handleNoticeAdd = (e: any) => {
    e.preventDefault();
    addNotice.mutate(values);
  };

  return (
    <>
      <div className="px-12">
        <div className="mt-6 flex items-center justify-between px-3">
          <Heading>공지사항</Heading>
          <Button onClick={() => setIsModalShown(true)}>새 공지 등록</Button>
        </div>
        <div className="mt-4">
          <TableHead />
          <TableBody />
        </div>
      </div>
      {isModalShown && (
        <NoticeEditorModal
          setIsModalShown={setIsModalShown}
          values={values}
          setValues={setValues}
          onSubmit={handleNoticeAdd}
        />
      )}
    </>
  );
};

export default ChallengeNotice;
