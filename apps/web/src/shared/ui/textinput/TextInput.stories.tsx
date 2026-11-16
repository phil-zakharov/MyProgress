import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextInput } from './TextInput';

const meta = {
  title: 'shared/ui/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Название занятия',
  },
};

export const Filled: Story = {
  args: {
    defaultValue: 'Название занятия',
  },
};

export const Error: Story = {
  args: {
    defaultValue: 'Название занятия',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Название занятия',
    disabled: true,
  },
};
