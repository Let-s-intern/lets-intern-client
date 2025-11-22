import { UserAdmin } from '@/api/userSchema';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const DocumentLink = ({
  documentInfos,
  type,
}: {
  documentInfos?: Array<{
    userDocumentType: string;
    fileUrl: string;
    fileName: string;
  }>;
  type: string;
}) => {
  const doc = documentInfos?.find((doc) => doc.userDocumentType === type);

  if (!doc) return <>-</>;

  return (
    <a
      href={doc.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: 'underline',
        cursor: 'pointer',
        color: '#1976d2',
      }}
    >
      {doc.fileName.split('/').pop()}
    </a>
  );
};

const ProgramCell = ({ applicationInfos }: { applicationInfos: any[] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
  }, [isHovered]);

  return (
    <>
      <div
        ref={buttonRef}
        className="cursor-pointer text-blue-600 underline"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        보기
      </div>
      {/* Portal로 body에 띄우는 드롭다운 */}
      {isHovered &&
        createPortal(
          <div
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              transform: 'translateX(-50%)',
              zIndex: 100,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="max-h-32 min-w-[200px] overflow-y-auto bg-neutral-80 p-3 shadow-lg">
              {applicationInfos.length < 1 ? (
                <div className="whitespace-nowrap">신청 내역이 없습니다.</div>
              ) : (
                <div className="flex flex-col gap-y-1">
                  {applicationInfos.map((applicationInfo, idx) => (
                    <div
                      key={`${applicationInfo.programId}-${idx}`}
                      className="whitespace-nowrap"
                    >
                      {applicationInfo.programTitle}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

interface UserAdminTableProps {
  userList: UserAdmin;
  isLoading: boolean;
  pageNum: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number, pageSize: number) => void;
}

const UserAdminTable = ({
  userList,
  isLoading,
  pageNum,
  pageSize,
  totalElements,
  onPageChange,
}: UserAdminTableProps) => {
  const router = useRouter();

  const handleClick = (to: string) => {
    if (!to) return;

    if (to === '-1') {
      router.back();
    } else {
      router.push(to);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'careerType',
      headerName: '분류',
      width: 60,
      renderCell: (params: GridRenderCellParams) =>
        params.value === 'QUALIFIED' ? '인재' : '-',
    },
    {
      field: 'name',
      headerName: '사용자 명',
      width: 120,
    },
    {
      field: 'phoneNum',
      headerName: '휴대폰 번호',
      width: 140,
    },
    {
      field: 'email',
      headerName: '이메일',
      width: 200,
    },
    {
      field: 'university',
      headerName: '대학교',
      width: 100,
    },
    {
      field: 'wishField',
      headerName: '희망 직무',
      width: 120,
    },
    {
      field: 'wishIndustry',
      headerName: '희망 산업',
      width: 120,
    },
    {
      field: 'wishEmploymentType',
      headerName: '희망 구직 조건',
      width: 130,
    },
    {
      field: 'applicationInfos',
      headerName: '참여 프로그램',
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <ProgramCell applicationInfos={params.value || []} />
      ),
    },
    {
      field: 'experience',
      headerName: '주요 경험',
      width: 180,
      renderCell: (params) => {
        const experienceInfos = params.row.experienceInfos || [];
        return experienceInfos
          .map((info: { title: string }) => info.title)
          .join(', ');
      },
    },
    {
      field: 'career',
      headerName: '주요 경력',
      width: 180,
      renderCell: (params) => {
        const careerInfos = params.row.careerInfos || [];
        if (!careerInfos.length) return '-';
        return careerInfos
          .map(
            (info: { company: string; job: string }) =>
              `${info.company}/${info.job}`,
          )
          .join(', ');
      },
    },
    {
      field: 'resume',
      headerName: '이력서',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <DocumentLink documentInfos={params.row.documentInfos} type="RESUME" />
      ),
    },
    {
      field: 'portfolio',
      headerName: '포트폴리오',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <DocumentLink
          documentInfos={params.row.documentInfos}
          type="PORTFOLIO"
        />
      ),
    },
    {
      field: 'personalStatement',
      headerName: '자기소개서',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <DocumentLink
          documentInfos={params.row.documentInfos}
          type="PERSONAL_STATEMENT"
        />
      ),
    },
    {
      field: 'memo',
      headerName: '메모',
      width: 100,
    },
    {
      field: 'actions',
      headerName: '메뉴',
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<Pencil />}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(`/admin/users/${params.row.id}`);
          }}
        >
          수정
        </Button>
      ),
    },
  ];

  const rows = userList.map((user) => ({
    id: user.userInfo.id,
    careerType: user.userInfo.careerType,
    name: user.userInfo.name,
    phoneNum: user.userInfo.phoneNum,
    email: user.userInfo.email,
    university: user.userInfo.university,
    wishField: user.userInfo.wishField,
    wishIndustry: user.userInfo.wishIndustry,
    wishEmploymentType: user.userInfo.wishEmploymentType,
    applicationInfos: user.applicationInfos,
    experienceInfos: user.experienceInfos,
    careerInfos: user.careerInfos,
    documentInfos: user.documentInfos,
    memo: user.userInfo.memo,
  }));

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        pagination
        paginationMode="server"
        paginationModel={{
          page: pageNum - 1,
          pageSize,
        }}
        onPaginationModelChange={(model) => {
          onPageChange(model.page + 1, model.pageSize);
        }}
        rowCount={totalElements}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: () => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              유저가 없습니다.
            </div>
          ),
          noResultsOverlay: () => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              검색 결과가 없습니다.
            </div>
          ),
        }}
      />
    </div>
  );
};

export default UserAdminTable;
