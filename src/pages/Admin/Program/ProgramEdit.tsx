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
  const [faqList, setFaqList] = useState<any>([]);
  const [faqIdList, setFaqIdList] = useState<any>([]);

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

        setFaqIdList(newValues.faqListStr.split(',').map(Number) || []);
        delete newValues.faqListStr;

        setValues(newValues);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, []);

  useEffect(() => {
    if (!faqList) return;
    const newFaqIdList: number[] = [];
    const originFaqIdList = faqList.map((faq: any) => faq.id);
    for (let faqId of faqIdList) {
      if (originFaqIdList.includes(faqId)) {
        newFaqIdList.push(faqId);
      }
    }
    newFaqIdList.sort();
    setFaqIdList(newFaqIdList);
  }, [faqList]);

  useEffect(() => {
    if (!values.type) return;
    const fetchFaqList = async () => {
      try {
        const res = await axios.get(`/faq/${values.type}`);
        setFaqList(res.data.faqList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqList();
  }, [values.type]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!values.type) {
      alert('프로그램 유형을 선택해주세요.');
      return;
    }
    if (faqIdList.length === 0 || !faqIdList) {
      alert('FAQ를 하나 이상 선택해주세요.');
      return;
    }
    const newValues = {
      ...values,
      contents: content,
      th: Number(values.th),
      headcount: Number(values.headcount),
      faqIdList: faqIdList.sort(),
    };
    try {
      await axios.patch(`/program/${params.programId}`, newValues);
      for (let faq of faqList) {
        await axios.patch(`/faq/${faq.id}`, {
          programType: values.type,
          question: faq.question,
          answer: faq.answer,
        });
      }
      navigate('/admin/programs');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFAQChange = (e: any, faqId: number) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFaqList(
      faqList.map((faq: any) => {
        if (faq.id === faqId) {
          return {
            ...faq,
            [name]: value,
          };
        }
        return faq;
      }),
    );
  };

  const handleFAQAdd = async () => {
    if (!values.type) {
      alert('프로그램 유형을 선택해주세요.');
      return;
    }
    try {
      const res = await axios.post(`/faq/${values.type}`, {
        question: '',
        answer: '',
      });
      setFaqList([...faqList, res.data]);
    } catch (err) {
      setError(err);
    }
  };

  const handleFAQDelete = async (faqId: number) => {
    if (!values.type) {
      alert('프로그램 유형을 선택해주세요.');
      return;
    }
    try {
      await axios.delete(`/faq/${faqId}`);
      setFaqList(faqList.filter((faq: any) => faq.id !== faqId));
      setFaqIdList(faqIdList.filter((id: number) => id !== faqId));
    } catch (err) {
      setError(err);
    }
  };

  const handleFAQCheckChange = (e: any, faqId: number) => {
    if (e.target.checked) {
      setFaqIdList([...faqIdList, faqId]);
    } else {
      setFaqIdList(faqIdList.filter((id: number) => id !== faqId));
    }
  };

  const handleFAQIdListReset = () => {
    setFaqIdList([]);
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
      faqList={faqList}
      faqIdList={faqIdList}
      handleFAQAdd={handleFAQAdd}
      handleFAQDelete={handleFAQDelete}
      handleFAQChange={handleFAQChange}
      handleFAQCheckChange={handleFAQCheckChange}
      handleFAQIdListReset={handleFAQIdListReset}
    />
  );
};

export default ProgramEdit;
