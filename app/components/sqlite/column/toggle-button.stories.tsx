import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import ToggleButton from './toggle-button'

const meta = {
  title: 'SQLite/Column/ToggleButton',
  component: ToggleButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof ToggleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    checked: false,
    label: 'Toggle Me',
    disabled: false,
  },
}

export const Checked: Story = {
  args: {
    checked: true,
    label: 'Checked',
    disabled: false,
  },
}

export const Disabled: Story = {
  args: {
    checked: false,
    label: 'Disabled',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    checked: true,
    label: 'Disabled Checked',
    disabled: true,
  },
}
