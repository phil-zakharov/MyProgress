import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from './Badge';

const meta = {
  title: 'shared/ui/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    status: 'pending',
    children: 'Ожидает',
  },
};

export const Done: Story = {
  args: {
    status: 'done',
    children: 'Выполнено',
  },
};

export const Skipped: Story = {
  args: {
    status: 'skipped',
    children: 'Пропущено',
  },
};

export const InProgress: Story = {
  args: {
    status: 'in-progress',
    children: 'В процессе',
  },
};
