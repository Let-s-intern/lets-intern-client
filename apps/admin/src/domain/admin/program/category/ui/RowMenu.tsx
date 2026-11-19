import { IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';

export interface RowMenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

/** 줄의 부가 기능(이름 바꾸기·설정·삭제)을 "⋯" 하나에 모은다 */
const RowMenu = ({ items }: { items: RowMenuItem[] }) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <IconButton
        size="small"
        aria-label="더보기"
        onClick={(e) => {
          e.stopPropagation();
          setAnchor(e.currentTarget);
        }}
      >
        <FaEllipsisH size={12} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((item) => (
          <MenuItem
            key={item.label}
            dense
            onClick={() => {
              setAnchor(null);
              item.onClick();
            }}
            sx={item.danger ? { color: 'error.main' } : undefined}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default RowMenu;
