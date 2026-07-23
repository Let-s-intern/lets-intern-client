import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CategoryTabs } from './index';

const meta = {
  title: 'UI/CategoryTabs',
  component: CategoryTabs,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof CategoryTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'frontend', label: '프론트엔드' },
  { value: 'backend', label: '백엔드' },
];

// CategoryTabs는 제어 컴포넌트라 render에서 상태를 소유해 상호작용을 보여준다.
export const Default: Story = {
  // onChange는 render가 자체 상태로 재정의하므로 더미값(타입 요구사항 충족용)
  args: {
    options: OPTIONS,
    selected: 'all',
    size: 'small',
    onChange: () => {},
  },
  render: (args) => {
    const [selected, setSelected] = useState(args.selected);
    return (
      <CategoryTabs {...args} selected={selected} onChange={setSelected} />
    );
  },
};

export const Large: Story = {
  args: {
    options: OPTIONS,
    selected: 'all',
    size: 'large',
    onChange: () => {},
  },
  render: (args) => {
    const [selected, setSelected] = useState(args.selected);
    return (
      <CategoryTabs {...args} selected={selected} onChange={setSelected} />
    );
  },
};
