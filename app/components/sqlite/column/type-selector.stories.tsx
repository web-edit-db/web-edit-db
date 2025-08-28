import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import TypeSelector from './type-selector'

const meta = {
  title: 'SQLite/Column/TypeSelector',
  component: TypeSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'select',
      options: ['Text', 'Integer', 'Numeric', 'Real', 'Blob'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof TypeSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: '',
    disabled: false,
  },
}

export const WithSelectedType: Story = {
  args: {
    value: 'Integer',
    disabled: false,
  },
}

export const TextType: Story = {
  args: {
    value: 'Text',
    disabled: false,
  },
}

export const Disabled: Story = {
  args: {
    value: 'Real',
    disabled: true,
  },
}
