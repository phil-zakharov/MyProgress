import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { PlayIcon } from '@/src/shared/icons/PlayIcon';
import { StopIcon } from '@/src/shared/icons/StopIcon';

import { Button } from './Button';

const meta = {
  title: 'shared/ui/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};

export const Green: Story = {
  args: {
    variant: 'green',
    children: 'Старт',
    leftIcon: <PlayIcon />,
  },
};

export const Red: Story = {
  args: {
    variant: 'red',
    children: 'Стоп',
    leftIcon: <StopIcon />,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'disabled',
    children: 'Button',
  },
};

export const Loading: Story = {
  args: {
    variant: 'green',
    loading: true,
    children: 'Старт',
  },
};
