import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import ToggleButton from './toggle-button'

const meta = {
  title: 'SQLite/Column/ColumnCard/ToggleButton',
  component: ToggleButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the toggle is checked/active',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled',
    },
    label: {
      control: 'text',
      description: 'Text label displayed next to the checkbox',
    },
    onChange: {
      description: 'Callback when toggle state changes',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof ToggleButton>

export default meta
type Story = StoryObj<typeof meta>

export const NotNull: Story = {
  name: 'Not Null Constraint',
  args: {
    checked: false,
    label: 'Not Null',
    disabled: false,
  },
}

export const NotNullActive: Story = {
  name: 'Not Null Constraint (Active)',
  args: {
    checked: true,
    label: 'Not Null',
    disabled: false,
  },
}

export const UniqueConstraint: Story = {
  name: 'Unique Constraint',
  args: {
    checked: false,
    label: 'Unique',
    disabled: false,
  },
}

export const UniqueConstraintActive: Story = {
  name: 'Unique Constraint (Active)',
  args: {
    checked: true,
    label: 'Unique',
    disabled: false,
  },
}

export const PrimaryKey: Story = {
  name: 'Primary Key Constraint',
  args: {
    checked: false,
    label: 'Primary Key',
    disabled: false,
  },
}

export const PrimaryKeyActive: Story = {
  name: 'Primary Key Constraint (Active)',
  args: {
    checked: true,
    label: 'Primary Key',
    disabled: false,
  },
}

export const DisabledState: Story = {
  name: 'Disabled State',
  args: {
    checked: false,
    label: 'Not Null',
    disabled: true,
  },
}

export const DisabledCheckedState: Story = {
  name: 'Disabled Checked State',
  args: {
    checked: true,
    label: 'Primary Key',
    disabled: true,
  },
}
