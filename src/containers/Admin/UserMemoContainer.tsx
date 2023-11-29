import { useEffect, useState } from 'react';

import UserMemo from '../../components/Admin/User/UserMemo';
import { useParams } from 'react-router-dom';

import axios from '../../libs/axios';

const UserMemoContainer = () => {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memoList, setMemoList] = useState([]);
  const [memoValue, setMemoValue] = useState('');

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const res = await axios.get(`/memo/${params.userId}`);
        console.log(res.data.memoList);
        setMemoList(res.data.memoList);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMemo();
  }, []);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setMemoValue('');
    setIsModalOpen(false);
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemoValue(e.target.value);
  };

  const handleMemoCreate = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post(`/memo/${params.userId}`, {
        contents: memoValue,
      });
      const res = await axios.get(`/memo/${params.userId}`);
      setMemoList(res.data.memoList);
      setMemoValue('');
      setIsModalOpen(false);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserMemo
      loading={loading}
      error={error}
      memoList={memoList}
      isModalOpen={isModalOpen}
      handleModalOpen={handleModalOpen}
      handleModalClose={handleModalClose}
      handleMemoCreate={handleMemoCreate}
      handleMemoChange={handleMemoChange}
    />
  );
};

export default UserMemoContainer;
