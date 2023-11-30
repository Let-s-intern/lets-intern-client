import { useEffect, useState } from 'react';
import axios from '../../../libs/axios';
import { useParams } from 'react-router-dom';

import formatDateString from '../../../libs/formatDateString';

const ResultContent = () => {
  const params = useParams();
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const fetchProgram = async () => {
      const res = await axios.get(`/program/admin/${params.programId}`);
      setDate(formatDateString(res.data.announcementDate));
    };
    fetchProgram();
  }, []);

  return (
    <div className="py-10 text-center">
      <h1 className="text-lg font-medium">제출이 완료되었습니다.</h1>
      <p className="mt-3 text-gray-500">
        합격 발표 일자 : {/* <br /> */}
        {date}
      </p>
    </div>
  );
};

export default ResultContent;
