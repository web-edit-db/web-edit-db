import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import NumberInputWithPlusMinus from './number-input-with-plus-minus'

const meta = {
  title: 'SQLite/Column/NumberInputWithPlusMinus',
  component: NumberInputWithPlusMinus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof NumberInputWithPlusMinus>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: undefined,
    disabled: false,
  },
}

export const WithValue: Story = {
  args: {
    value: 42,
    disabled: false,
  },
}

export const Disabled: Story = {
  args: {
    value: 10,
    disabled: true,
  },
}

export const Zero: Story = {
  args: {
    value: 0,
    disabled: false,
  },
}

export const Negative: Story = {
  args: {
    value: -5,
    disabled: false,
  },
}
