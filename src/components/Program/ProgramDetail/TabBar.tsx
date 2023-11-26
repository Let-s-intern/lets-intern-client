import styled from 'styled-components';

interface TabBarProps {
  program: any;
  tab: string;
  onTabChange: (tab: string) => void;
}

interface TabItemProps {
  $active?: boolean;
}

const TabBar = ({ program, tab, onTabChange }: TabBarProps) => {
  return (
    <TabBarBlock>
      <TabItem
        onClick={() => onTabChange('DETAIL')}
        {...(tab === 'DETAIL' && { $active: true })}
      >
        <span>상세정보</span>
      </TabItem>
      <TabItem
        onClick={() => onTabChange('REVIEW')}
        {...(tab === 'REVIEW' && { $active: true })}
      >
        <span>후기</span>
      </TabItem>
      <TabItem
        onClick={() => onTabChange('FAQ')}
        {...(tab === 'FAQ' && { $active: true })}
      >
        <span>FAQ</span>
      </TabItem>
    </TabBarBlock>
  );
};

export default TabBar;

const TabBarBlock = styled.div`
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
`;

const TabItem = styled.button<TabItemProps>`
  box-sizing: border-box;
  flex: 1;
  text-align: center;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#6257F8' : '#7F7F7F')};
  border-bottom: ${({ $active }) =>
    $active ? '3px solid #6257F8;' : '1px solid #7F7F7F;'};
  cursor: pointer;

  span {
    display: block;
    ${({ $active }) => $active && 'transform: translateY(1px);'};
  }

  &:hover {
    color: #6257f8;
    border-bottom: 3px solid #6257f8;
    height: calc(4rem, 3px);

    span {
      display: block;
      transform: translateY(1px);
    }
  }
`;
