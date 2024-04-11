import TableTemplate, {
  TableTemplateProps,
} from '../../../components/admin/ui/table/new/TableTemplate';

const MainBanners = () => {
  const columnMetaData: TableTemplateProps['columnMetaData'] = {
    bannerId: {
      headLabel: '배너 ID',
      cellWidth: 'w-2/12',
    },
    bannerImage: {
      headLabel: '배너 이미지',
      cellWidth: 'w-3/12',
    },
    bannerLink: {
      headLabel: '배너 링크',
      cellWidth: 'flex-1',
    },
    registerDate: {
      headLabel: '등록일',
      cellWidth: 'w-2/12',
    },
    remove: {
      headLabel: '삭제',
      cellWidth: 'w-2/12',
    },
  };

  return (
    <TableTemplate
      title="메인 배너 관리"
      headerButton={{
        label: '등록',
        href: '/admin/banner/main-banners/create',
      }}
      columnMetaData={columnMetaData}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <TableTemplate.Row key={index}>
          <TableTemplate.Cell cellWidth={columnMetaData.bannerId.cellWidth}>
            배너 아이디입니다.
          </TableTemplate.Cell>
          <TableTemplate.Cell cellWidth={columnMetaData.bannerImage.cellWidth}>
            배너 이미지입니다.
          </TableTemplate.Cell>
          <TableTemplate.Cell cellWidth={columnMetaData.bannerImage.cellWidth}>
            <TableTemplate.ManageContent>
              <div>hello</div>
              <div>hello</div>
            </TableTemplate.ManageContent>
          </TableTemplate.Cell>
        </TableTemplate.Row>
      ))}
    </TableTemplate>
  );
};

export default MainBanners;
