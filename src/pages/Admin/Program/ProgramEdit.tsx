import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ProgramEditor from '../../../components/ProgramEditor';
import axios from '../../../libs/axios';

const ProgramEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState<any>({});
  const [content, setContent] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const toLocalISOString = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await axios({
          method: 'GET',
          url: `/program/admin/${params.programId}`,
        });
        setContent(res.data.contents);
        const newValues = {
          ...res.data,
          startDate: toLocalISOString(res.data.startDate),
          endDate: toLocalISOString(res.data.endDate),
          announcementDate: toLocalISOString(res.data.announcementDate),
          dueDate: toLocalISOString(res.data.dueDate),
        };
        delete newValues.id;
        delete newValues.isVisible;
        delete newValues.contents;
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
    const newValues = {
      ...values,
      contents: content,
      th: Number(values.th),
      headcount: Number(values.headcount),
    };
    try {
      await axios.patch(`/program/${params.programId}`, newValues);
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
