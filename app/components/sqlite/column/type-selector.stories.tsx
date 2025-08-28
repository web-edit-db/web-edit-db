import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import TypeSelector from './type-selector'

const meta = {
  title: 'SQLite/Column/ColumnCard/TypeSelector',
  component: TypeSelector,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'select',
      options: ['', 'Text', 'Integer', 'Numeric', 'Real', 'Blob'],
      description: 'Selected SQLite column type',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the selector is disabled',
    },
    onChange: {
      description: 'Callback when type selection changes',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof TypeSelector>

export default meta
type Story = StoryObj<typeof meta>

export const NoSelection: Story = {
  name: 'No Type Selected',
  args: {
    value: '',
    disabled: false,
  },
}

export const TextType: Story = {
  name: 'Text Type (Strings)',
  args: {
    value: 'Text',
    disabled: false,
  },
}

export const IntegerType: Story = {
  name: 'Integer Type (Whole Numbers)',
  args: {
    value: 'Integer',
    disabled: false,
  },
}

export const NumericType: Story = {
  name: 'Numeric Type (Decimals)',
  args: {
    value: 'Numeric',
    disabled: false,
  },
}

export const RealType: Story = {
  name: 'Real Type (Floating Point)',
  args: {
    value: 'Real',
    disabled: false,
  },
}

export const BlobType: Story = {
  name: 'Blob Type (Binary Data)',
  args: {
    value: 'Blob',
    disabled: false,
  },
}

export const DisabledEmpty: Story = {
  name: 'Disabled (No Selection)',
  args: {
    value: '',
    disabled: true,
  },
}

export const DisabledWithType: Story = {
  name: 'Disabled (With Selection)',
  args: {
    value: 'Integer',
    disabled: true,
  },
}
