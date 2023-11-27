import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';

import axios from '../../../libs/axios';
import ProgramEditor from '../../../components/ProgramEditor';
import { convertFormToRequest } from '../../../libs/program-admin';
import dayjs from 'dayjs';

const ProgramCreate = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<any>({});
  const [content, setContent] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      ...values,
      contents: content,
      th: Number(values.th),
      headcount: Number(values.headcount),
      faqIdList: [11, 12, 13],
    });
    setValues({
      ...values,
      contents: content,
      th: Number(values.th),
      headcount: Number(values.headcount),
      faqIdList: [11, 12, 13],
    });
    try {
      await axios.post('/program', values);
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
