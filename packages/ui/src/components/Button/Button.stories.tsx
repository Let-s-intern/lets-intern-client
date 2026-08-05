import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './index';

const meta = {
  title: 'Component/Button',
  component: Button,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['solid', 'soft', 'outline', 'text'],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    display: {
      control: 'inline-radio',
      options: ['inline', 'full'],
    },
    disabled: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
    as: {
      control: 'inline-radio',
      options: ['button', 'a'],
    },
    href: {
      control: 'text',
      if: { arg: 'as', eq: 'a' },
    },
    onClick: { action: 'onClick' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    variant: 'solid',
    size: 'md',
    display: 'inline',
    disabled: false,
    children: '버튼 테스트',
  },
};
