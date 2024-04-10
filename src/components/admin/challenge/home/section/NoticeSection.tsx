import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IoIosArrowForward } from 'react-icons/io';

import RoundedBox from '../box/RoundedBox';
import NoticeItem from '../item/NoticeItem';
import SectionHeading from '../heading/SectionHeading';
import Button from '../../ui/button/Button';
import NoticeEditorModal from '../../ui/modal/NoticeEditorModal';
import axios from '../../../../../utils/axios';
import clsx from 'clsx';

const NoticeSection = () => {
  const params = useParams();
  const queryClient = useQueryClient();

  const [noticeList, setNoticeList] = useState<any>();
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageInfo, setPageInfo] = useState<any>();
  const [isModalShown, setIsModalShown] = useState(false);
  const [values, setValues] = useState<any>({});

  const getNotice = useQuery({
    queryKey: ['notice', params.programId, { page: pageNum, size: 4 }],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/notice/${params.programId}`, {
        params: queryKey[2],
      });
      const data = res.data;
      setNoticeList(data.noticeList);
      setPageInfo(data.pageInfo);
      console.log(data);
      return data;
    },
  });

  useEffect(() => {
    getNotice.refetch();
  }, [pageNum]);

  const addNotice = useMutation({
    mutationFn: async (values) => {
      const res = await axios.post(`/notice/${params.programId}`, values);
      const data = res.data;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notice'] });
      setIsModalShown(false);
    },
  });

  const handleNoticeAdd = (e: any) => {
    e.preventDefault();
    addNotice.mutate(values);
  };

  const isLoading = getNotice.isLoading || !noticeList || !pageInfo;

  return (
    <>
      <RoundedBox
        as="section"
        className="flex w-[50%] flex-col justify-between px-8 py-6"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <SectionHeading>공지사항</SectionHeading>
            <Button onClick={() => setIsModalShown(true)}>새 공지 등록</Button>
          </div>
          <ul className="flex flex-col gap-2">
            {!isLoading &&
              noticeList.map((notice: any) => (
                <NoticeItem key={notice.id} notice={notice} />
              ))}
          </ul>
        </div>
        <div className="flex items-center justify-center gap-5">
          <div className="w-20" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 text-sm">
              {!isLoading &&
                Array.from(
                  { length: pageInfo.totalPages },
                  (_, index) => index + 1,
                ).map((pageNum) => (
                  <span
                    key={pageNum}
                    className={clsx('cursor-pointer', {
                      'font-medium': pageNum === pageInfo.pageNum,
                    })}
                    onClick={() => {
                      setPageNum(pageNum);
                    }}
                  >
                    {pageNum}
                  </span>
                ))}
            </div>
          </div>
          <Link
            to={`/admin/challenge/${params.programId}/notice`}
            className="w-20 text-sm"
          >
            전체보기
          </Link>
        </div>
      </RoundedBox>
      {isModalShown && (
        <NoticeEditorModal
          setIsModalShown={setIsModalShown}
          values={values}
          setValues={setValues}
          onSubmit={handleNoticeAdd}
        />
      )}
    </>
  );
};

export default NoticeSection;
