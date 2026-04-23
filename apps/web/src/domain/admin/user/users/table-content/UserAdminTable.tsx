import { DocumentType } from '@/api/mission/missionSchema';
import { usePatchUserAdminMutation } from '@/api/user/user';
import { UserAdmin } from '@/api/user/userSchema';
import dayjs from '@/lib/dayjs';
import { getFileNameFromUrl } from '@/utils/getFileNameFromUrl';
import { Button, MenuItem, Select, TextField } from '@mui/material';
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
    userDocumentType: DocumentType;
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
      {doc.fileUrl !== ''
        ? getFileNameFromUrl(doc.userDocumentType, doc.fileUrl)
        : ''}
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

const EditableCareerTypeCell = ({
  userId,
  initialValue,
}: {
  userId: number;
  initialValue: boolean;
}) => {
  const [value, setValue] = useState(initialValue);
  const { mutate: patchUser } = usePatchUserAdminMutation({ userId });

  const handleChange = (newValue: string) => {
    const boolValue = newValue === 'QUALIFIED';
    setValue(boolValue);
    patchUser({
      id: userId,
      isPoolUp: boolValue,
    });
  };

  return (
    <Select
      value={value ? 'QUALIFIED' : 'NONE'}
      onChange={(e) => handleChange(e.target.value)}
      size="small"
      variant="standard"
      disableUnderline
      sx={{
        fontSize: '14px',
        '& .MuiSelect-select': {
          padding: '4px 8px',
        },
      }}
    >
      <MenuItem className="text-xsmall14" value="QUALIFIED">
        인재
      </MenuItem>
      <MenuItem value="NONE">없음</MenuItem>
    </Select>
  );
};

const EditableMemoCell = ({
  userId,
  initialValue,
}: {
  userId: number;
  initialValue: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || '');
  const { mutate: patchUser } = usePatchUserAdminMutation({ userId });

  const handleSave = () => {
    setIsEditing(false);
    if (value !== initialValue) {
      patchUser({
        id: userId,
        memo: value,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(initialValue || '');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        multiline
        size="small"
        variant="standard"
        fullWidth
        sx={{
          '& .MuiInputBase-input': {
            padding: '4px 8px',
          },
        }}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      style={{
        cursor: 'pointer',
        padding: '4px 8px',
        minHeight: '24px',
        width: '100%',
      }}
    >
      {value || ''}
    </div>
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
      field: 'isPoolUp',
      headerName: '분류',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <EditableCareerTypeCell
          userId={params.row.id}
          initialValue={params.value}
        />
      ),
    },
    {
      field: 'createDate',
      headerName: '가입일자',
      width: 180,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return '-';
        return dayjs(params.value).format('YYYY-MM-DD HH:mm:ss');
      },
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
      field: 'wishJob',
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
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <EditableMemoCell userId={params.row.id} initialValue={params.value} />
      ),
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
          상세
        </Button>
      ),
    },
  ];

  const rows = userList.map((user) => ({
    id: user.userInfo.id,
    careerType: user.userInfo.careerType,
    createDate: user.userInfo.createDate,
    name: user.userInfo.name,
    phoneNum: user.userInfo.phoneNum,
    email: user.userInfo.email,
    university: user.userInfo.university,
    wishJob: user.userInfo.wishJob,
    wishIndustry: user.userInfo.wishIndustry,
    wishEmploymentType: user.userInfo.wishEmploymentType,
    applicationInfos: user.applicationInfos,
    experienceInfos: user.experienceInfos,
    careerInfos: user.careerInfos,
    documentInfos: user.documentInfos,
    isPoolUp: user.userInfo.isPoolUp,
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
