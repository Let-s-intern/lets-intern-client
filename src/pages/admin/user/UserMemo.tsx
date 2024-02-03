import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import axios from '../../../utils/axios';
import Table from '../../../components/admin/ui/table/Table';
import MemoTableBody from '../../../components/admin/user/user-memo/table-content/TableBody';
import MemoTableHead from '../../../components/admin/user/user-memo/table-content/TableHead';
import Heading from '../../../components/admin/ui/heading/Heading';
import ActionButton from '../../../components/admin/ui/button/ActionButton';
import UserMemoModal from '../../../components/admin/user/user-memo/modal/UserMemoModal';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';

import classes from './UserMemo.module.scss';

const UserMemo = () => {
  const params = useParams();
  const [searchParams, _] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memoList, setMemoList] = useState([]);
  const [memoValue, setMemoValue] = useState('');
  const [memoId, setMemoId] = useState(-1);
  const [user, setUser] = useState<any>({});
  const [maxPage, setMaxPage] = useState(1);

  const sizePerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const currentPage = searchParams.get('page');
      const reqParams = {
        page: currentPage,
        size: sizePerPage,
      };
      try {
        let res = await axios.get(`/memo/${params.userId}`, {
          params: reqParams,
        });
        setMemoList(res.data.memoList);
        setMaxPage(res.data.pageInfo.totalPages);
        res = await axios.get(`/user/admin/${params.userId}`);
        setUser(res.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

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

  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div></div>;
  }

  return (
    <div className="p-8">
      <header className={classes.header}>
        <Heading>메모 - {user?.name}</Heading>
        <ActionButton onClick={handleModalOpen}>등록</ActionButton>
      </header>
      <main className={classes.main}>
        <Table>
          <MemoTableHead />
          <MemoTableBody
            memoList={memoList}
            isModalOpen={isModalOpen}
            handleModalOpen={handleModalOpen}
            handleModalClose={handleModalClose}
            onModalEditOpen={handleModalEditOpen}
            onDeleteMemo={handleDeleteMemo}
          />
        </Table>
        {memoList.length > 0 && (
          <div className={classes.pagination}>
            <AdminPagination maxPage={maxPage} />
          </div>
        )}
        <UserMemoModal
          memoValue={memoValue}
          isModalOpen={isModalOpen}
          onClose={handleModalClose}
          handleMemoChange={handleMemoChange}
          handleMemoCreate={handleMemoCreate}
        />
      </main>
    </div>
  );
};

export default UserMemo;
