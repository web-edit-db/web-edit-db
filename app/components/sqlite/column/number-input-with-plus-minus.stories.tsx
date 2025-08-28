import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import NumberInputWithPlusMinus from './number-input-with-plus-minus'

const meta = {
  title: 'SQLite/Column/ColumnCard/NumberInputWithPlusMinus',
  component: NumberInputWithPlusMinus,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'number',
      description: 'Current numeric value (undefined for empty)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input and buttons are disabled',
    },
    onChange: {
      description: 'Callback when value changes',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof NumberInputWithPlusMinus>

export default meta
type Story = StoryObj<typeof meta>

export const EmptyMinValue: Story = {
  name: 'Empty Min Value',
  args: {
    value: undefined,
    disabled: false,
  },
}

export const EmptyMaxValue: Story = {
  name: 'Empty Max Value',
  args: {
    value: undefined,
    disabled: false,
  },
}

export const MinLength: Story = {
  name: 'Min Length (Text Field)',
  args: {
    value: 1,
    disabled: false,
  },
}

export const MaxLength: Story = {
  name: 'Max Length (Text Field)',
  args: {
    value: 255,
    disabled: false,
  },
}

export const RatingMin: Story = {
  name: 'Rating Min Value',
  args: {
    value: 1,
    disabled: false,
  },
}

export const RatingMax: Story = {
  name: 'Rating Max Value',
  args: {
    value: 5,
    disabled: false,
  },
}

export const IdRange: Story = {
  name: 'ID Range Value',
  args: {
    value: 1000,
    disabled: false,
  },
}

export const LargeValue: Story = {
  name: 'Large Value',
  args: {
    value: 999999,
    disabled: false,
  },
}

export const Zero: Story = {
  name: 'Zero Value',
  args: {
    value: 0,
    disabled: false,
  },
}

export const NegativeValue: Story = {
  name: 'Negative Value',
  args: {
    value: -1,
    disabled: false,
  },
}

export const DisabledWithValue: Story = {
  name: 'Disabled with Value',
  args: {
    value: 100,
    disabled: true,
  },
}

export const DisabledEmpty: Story = {
  name: 'Disabled Empty',
  args: {
    value: undefined,
    disabled: true,
  },
}
