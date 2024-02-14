import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import TableRowDetailMenu from './TableRowDetailMenu';
import TableRowContent from './TableRowContent';
import TableRowEditorMenu from './TableRowEditorMenu';
import axios from '../../../../../../../utils/axios';

interface Props {
  contents: any;
}

const TableBodyRow = ({ contents }: Props) => {
  const queryClient = useQueryClient();

  const [values, setValues] = useState<any>({ ...contents });
  const [menuShown, setMenuShown] = useState<'DETAIL' | 'EDIT' | 'NONE'>(
    'NONE',
  );
  const [contentsDetail, setContentsDetail] = useState<any>();

  const getContentsDetail = useQuery({
    queryKey: ['contents', contents.id],
    queryFn: async () => {
      const res = await axios.get(`/contents/${contents.id}`);
      const data = res.data;
      setContentsDetail(data);
      return data;
    },
  });

  const addContents = useMutation({
    mutationFn: async (values: any) => {
      const res = await axios.patch(`/contents/${contents.id}`, values);
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['contents'] });
      setMenuShown('DETAIL');
    },
  });

  const isLoading = getContentsDetail.isLoading || !contentsDetail;

  const handleContentsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContents.mutate(values);
  };

  const handleEditorClose = () => {
    setMenuShown('DETAIL');
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <TableRowContent
        contents={contentsDetail}
        menuShown={menuShown}
        setMenuShown={setMenuShown}
      />
      {menuShown === 'DETAIL' ? (
        <TableRowDetailMenu
          contents={contentsDetail}
          setMenuShown={setMenuShown}
        />
      ) : (
        menuShown === 'EDIT' && (
          <TableRowEditorMenu
            values={values}
            setValues={setValues}
            mode="EDIT"
            onSubmit={handleContentsSubmit}
            onCancel={handleEditorClose}
          />
        )
      )}
    </>
  );
};

export default TableBodyRow;
