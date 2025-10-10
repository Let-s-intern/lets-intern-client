'use client';

import { useDeleteUserMutation, useUserAdminQuery } from '@/api/user';
import Header from '@/components/admin/ui/header/Header';
import Heading from '@/components/admin/ui/heading/Heading';
import AdminPagination from '@/components/admin/ui/pagination/AdminPagination';
import Table from '@/components/admin/ui/table/regacy/Table';
import AdminUserFilter from '@/components/admin/user/users/filter/AdminUserFilter';
import TableBody from '@/components/admin/user/users/table-content/TableBody';
import TableHead from '@/components/admin/user/users/table-content/TableHead';
import AlertModal from '@/components/ui/alert/AlertModal';
import { useState } from 'react';

const AdminUsersPage = () => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [searchValues, setSearchValues] = useState<{
    name: string;
    email: string;
    phoneNum: string;
  }>({
    name: '',
    email: '',
    phoneNum: '',
  });
  const { data, isLoading, isError } = useUserAdminQuery({
    email: searchValues.email,
    name: searchValues.name,
    phoneNum: searchValues.phoneNum,
    pageable: {
      page: pageNum,
      size: 10,
    },
  });

  const maxPage = data?.pageInfo.totalPages || 1;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({
    isOpen: false,
    phoneNum: '',
  });

  const {
    mutate: tryDeleteUser,
    isPending,
    isSuccess,
  } = useDeleteUserMutation(() => {
    setIsDeleteModalOpen({ isOpen: false, phoneNum: '' });
  });

  return (
    <div className="p-8">
      <Header>
        <Heading>회원 관리</Heading>
      </Header>
      <main>
        <div className="mb-4">
          <AdminUserFilter setSearchValues={setSearchValues} />
        </div>
        {isLoading ? (
          <div className="py-4 text-center">로딩 중...</div>
        ) : isError ? (
          <div className="py-4 text-center">에러 발생</div>
        ) : !data || data.userAdminList.length === 0 ? (
          <div className="py-4 text-center">유저가 없습니다.</div>
        ) : (
          <>
            <Table>
              <TableHead />
              <TableBody
                userList={data.userAdminList}
                handleDeleteUser={(phoneNum: string) => {
                  setIsDeleteModalOpen({
                    isOpen: true,
                    phoneNum: phoneNum.toString(),
                  });
                }}
              />
            </Table>
            <div className="mt-4">
              <AdminPagination
                maxPage={maxPage}
                pageNum={pageNum}
                setPageNum={setPageNum}
              />
            </div>
          </>
        )}

        {isDeleteModalOpen.isOpen && (
          <AlertModal
            onConfirm={() => {
              tryDeleteUser(isDeleteModalOpen.phoneNum);
            }}
            onCancel={() =>
              setIsDeleteModalOpen({ isOpen: false, phoneNum: '' })
            }
            className="break-keep"
            title="회원 탈퇴"
          >
            {isPending || isSuccess ? (
              '로딩 중...'
            ) : (
              <>
                회원을 삭제하시겠습니까?
                <div className="mt-4 text-sm text-system-error">
                  회원 삭제 시 복구가 불가능하며, 모든 정보가 삭제됩니다.
                </div>
              </>
            )}
          </AlertModal>
        )}
      </main>
    </div>
  );
};

export default AdminUsersPage;
