import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ProgramEditor from '../../components/ProgramEditor';
import {
  convertFormToRequest,
  convertResponseToForm,
} from '../../libs/program-admin';
import axios from '../../libs/axios';

const ProgramEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState<any>({});
  const [content, setContent] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await axios({
          method: 'GET',
          url: `/program/admin/${params.programId}`,
        });
        setContent(res.data.contents);
        const newValues = convertResponseToForm(res.data);
        setValues(newValues);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = convertFormToRequest(values, content);
    console.log(data);
    try {
      await axios({
        method: 'PATCH',
        url: `/program/${params.programId}`,
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
    return <div className="mx-auto max-w-xl">로딩중</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-xl">에러 발생</div>;
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

export default ProgramEdit;
