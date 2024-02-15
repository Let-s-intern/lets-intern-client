import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import TableRowEditorMenu from './TableRowEditorMenu';
import axios from '../../../../../../../utils/axios';

interface Props {
  setAddMenuShown: (addMenuShown: boolean) => void;
}

const NewTableRowEditor = ({ setAddMenuShown }: Props) => {
  const queryClient = useQueryClient();

  const [values, setValues] = useState<any>();

  const addContents = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post('/contents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['contents'] });
      setAddMenuShown(false);
      window.scrollTo(0, 0);
    },
  });

  const handleContentsCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append(
      'contentsCreateDTO',
      new Blob([JSON.stringify(values)], { type: 'application/json' }),
    );

    addContents.mutate(formData);
  };

  const handleEditorClose = () => {
    setAddMenuShown(false);
  };

  return (
    <TableRowEditorMenu
      values={values}
      mode="CREATE"
      setValues={setValues}
      onSubmit={handleContentsCreate}
      onCancel={handleEditorClose}
    />
  );
};

export default NewTableRowEditor;
