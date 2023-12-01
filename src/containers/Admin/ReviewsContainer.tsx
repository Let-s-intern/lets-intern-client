import { useEffect, useState } from 'react';

import Reviews from '../../components/Admin/Review/Reviews';
import axios from '../../libs/axios';

const ReviewsContainer = () => {
  const [programList, setProgramList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        res = await axios.get('/program/admin');
        console.log(res.data.programList);
        setProgramList(res.data.programList);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const copyReviewCreateLink = (programId: number) => {
    const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/program/${programId}/review/create`; // 복사하고자 하는 링크
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('링크가 클립보드에 복사되었습니다.');
      })
      .catch((err) => {
        console.error('복사에 실패했습니다:', err);
      });
  };

  return (
    <Reviews
      programList={programList}
      copyReviewCreateLink={copyReviewCreateLink}
    />
  );
};

export default ReviewsContainer;
