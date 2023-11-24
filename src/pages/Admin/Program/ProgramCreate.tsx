import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';

import axios from '../../../libs/axios';
import ProgramEditor from '../../../components/ProgramEditor';
import { convertFormToRequest } from '../../../libs/program-admin';

const ProgramCreate = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<any>({});
  const [content, setContent] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = convertFormToRequest(values, content);
    console.log(data);
    try {
      await axios({
        method: 'POST',
        url: `/program`,
        data,
      });
      navigate('/admin/programs');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-xl font-notosans">로딩중</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-xl font-notosans">에러 발생</div>;
  }

  return (
    <ProgramEditor
      values={values}
      setValues={setValues}
      handleSubmit={handleSubmit}
      content={content}
      setContent={setContent}
    />
  );
};

export default ProgramCreate;
