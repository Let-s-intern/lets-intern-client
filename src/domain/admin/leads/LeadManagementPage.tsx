'use client';

import { useLeadManagementListQuery } from '@/api/leadManagement';
import TableTemplate from '@/domain/admin/ui/table/new/TableTemplate';
import { Button, Typography } from '@mui/material';
import { useLeadManagementFilter } from './hooks/useLeadManagementFilter';
import FilterGroupEditor from './ui/LeadFilterEditor';
import LeadUserRow, {
  TABLE_MIN_WIDTH,
  tableColumnMetaData,
} from './ui/LeadUserRow';
import { downloadCsv } from './utils/csv';

// --- Main Page ---

const LeadManagementPage = () => {
  const { data: users = [], isLoading } = useLeadManagementListQuery();

  const {
    filterTree,
    filteredUsers,
    totalUserCount,
    handleResetFilters,
    handleAddCondition,
    handleAddGroup,
    handleUpdateGroupCombinator,
    handleUpdateCondition,
    handleRemoveNode,
    getValueLabel,
    getOptionsForField,
  } = useLeadManagementFilter(users);

  // --- CSV ---

  const handleDownloadCsv = () => {
    if (!filteredUsers.length) {
      window.alert('다운로드할 데이터가 없습니다.');
      return;
    }

    downloadCsv(
      'lead-management',
      [
        '이름',
        '전화번호',
        '학년',
        '희망직군',
        '희망직무',
        '희망산업',
        '희망기업',
        '프로그램 참여 이력',
        '마그넷 신청 이력',
        '마케팅 동의 여부',
      ],
      filteredUsers.map((user) => [
        user.name,
        user.phoneNum,
        user.grade,
        user.wishJobGroup,
        user.wishJob,
        user.wishIndustry,
        user.wishCompany,
        user.programHistory.map((p) => `${p.title}(${p.id})`).join(' · '),
        user.magnetHistory.map((m) => `${m.title}(${m.id})`).join(' · '),
        user.marketingAgree ? '동의' : '미동의',
      ]),
    );
  };

  const rootHasChildren = filterTree.children.length > 0;

  return (
    <>
      <div className="px-12 pt-6">
        <div className="rounded mb-4 border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Typography className="text-xs text-gray-600">
              AND/OR 트리를 구성해 특정 이벤트·프로그램 참여 이력 여부로
              전화번호 그룹을 필터링할 수 있습니다.
            </Typography>
            <div className="ml-auto flex gap-1">
              <Button
                size="small"
                variant="text"
                onClick={handleResetFilters}
                disabled={!rootHasChildren}
              >
                조건 초기화
              </Button>
            </div>
          </div>

          <FilterGroupEditor
            node={filterTree}
            isRoot
            onAddCondition={handleAddCondition}
            onAddGroup={handleAddGroup}
            onUpdateGroupCombinator={handleUpdateGroupCombinator}
            onUpdateCondition={handleUpdateCondition}
            onRemoveNode={handleRemoveNode}
            getOptionsForField={getOptionsForField}
            getValueLabel={getValueLabel}
          />

          <div className="mt-2 text-right text-[12px] text-gray-500">
            {filteredUsers.length}/{totalUserCount}명
          </div>
        </div>
      </div>

      <div className="flex justify-end px-12">
        <Button
          variant="outlined"
          onClick={handleDownloadCsv}
          disabled={!filteredUsers.length}
        >
          CSV 내보내기
        </Button>
      </div>

      <TableTemplate
        title="리드 관리"
        columnMetaData={tableColumnMetaData}
        minWidth={TABLE_MIN_WIDTH}
      >
        {isLoading ? (
          <div className="py-6 text-center text-gray-500">로딩 중...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            표시할 데이터가 없습니다.
          </div>
        ) : (
          filteredUsers.map((user) => <LeadUserRow key={user.id} user={user} />)
        )}
      </TableTemplate>
    </>
  );
};

export default LeadManagementPage;
