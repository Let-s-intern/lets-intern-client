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
  const [memoId, setMemoId] = useState(-1);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axios.get(`/memo/${params.userId}`);
        setMemoList(res.data.memoList);
        res = await axios.get(`/user/admin/${params.userId}`);
        setUser(res.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleModalOpen = () => {
    setMemoId(-1);
    setIsModalOpen(true);
  };

  const handleModalEditOpen = (memoId: number) => {
    setMemoId(memoId);
    const memo = memoList.find((memo: any) => memo.id === memoId);
    if (!memo) return;
    if ((memo as any).contents) {
      setMemoValue((memo as any).contents);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setMemoValue('');
    setMemoId(-1);
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemoValue(e.target.value);
  };

  const handleMemoCreate = async (e: any) => {
    e.preventDefault();
    try {
      if (memoId === -1) {
        await axios.post(`/memo/${params.userId}`, {
          contents: memoValue,
        });
      } else {
        await axios.patch(`/memo/${memoId}`, {
          contents: memoValue,
        });
      }
      const res = await axios.get(`/memo/${params.userId}`);
      setMemoList(res.data.memoList);
      handleModalClose();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemo = async (memoId: number) => {
    try {
      await axios.delete(`/memo/${memoId}`);
      setMemoList(memoList.filter((memo: any) => memo.id !== memoId));
    } catch (error) {
      alert('메모 삭제에 실패했습니다.');
    }
  };

  return (
    <UserMemo
      loading={loading}
      error={error}
      memoList={memoList}
      isModalOpen={isModalOpen}
      memoValue={memoValue}
      user={user}
      handleModalOpen={handleModalOpen}
      handleModalClose={handleModalClose}
      handleMemoCreate={handleMemoCreate}
      handleMemoChange={handleMemoChange}
      handleModalEditOpen={handleModalEditOpen}
      handleDeleteMemo={handleDeleteMemo}
    />
  );
};

export default UserMemoContainer;
