import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import DefaultValueSelector from './default-value-selector'

const meta = {
  title: 'SQLite/Column/ColumnCard/DefaultValueSelector',
  component: DefaultValueSelector,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      description: 'Current default value configuration',
    },
    formType: {
      control: 'select',
      options: ['Text', 'Integer', 'Numeric', 'Real', 'Blob'],
      description: 'Column type for context in value mode',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the selector is disabled',
    },
    onChange: {
      description: 'Callback when value changes',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof DefaultValueSelector>

export default meta
type Story = StoryObj<typeof meta>

export const NoDefault: Story = {
  name: 'No Default Value',
  args: {
    value: {
      mode: 'none',
    },
    formType: 'Text',
    disabled: false,
  },
}

export const TextValue: Story = {
  name: 'Text Default Value',
  args: {
    value: {
      mode: 'value',
      value: 'Untitled',
    },
    formType: 'Text',
    disabled: false,
  },
}

export const IntegerValue: Story = {
  name: 'Integer Default Value',
  args: {
    value: {
      mode: 'value',
      value: '0',
    },
    formType: 'Integer',
    disabled: false,
  },
}

export const NumericValue: Story = {
  name: 'Numeric Default Value',
  args: {
    value: {
      mode: 'value',
      value: '3.14',
    },
    formType: 'Numeric',
    disabled: false,
  },
}

export const SqlExpression: Story = {
  name: 'SQL Expression',
  args: {
    value: {
      mode: 'sql',
      value: 'CURRENT_TIMESTAMP',
    },
    formType: 'Text',
    disabled: false,
  },
}

export const SqlAutoIncrement: Story = {
  name: 'SQL AUTOINCREMENT',
  args: {
    value: {
      mode: 'sql',
      value: 'AUTOINCREMENT',
    },
    formType: 'Integer',
    disabled: false,
  },
}

export const SqlNull: Story = {
  name: 'SQL NULL',
  args: {
    value: {
      mode: 'sql',
      value: 'NULL',
    },
    formType: 'Blob',
    disabled: false,
  },
}

export const EmptyValue: Story = {
  name: 'Empty Value Mode',
  args: {
    value: {
      mode: 'value',
      value: '',
    },
    formType: 'Text',
    disabled: false,
  },
}

export const EmptySql: Story = {
  name: 'Empty SQL Mode',
  args: {
    value: {
      mode: 'sql',
      value: '',
    },
    formType: 'Integer',
    disabled: false,
  },
}

export const DisabledNone: Story = {
  name: 'Disabled (None)',
  args: {
    value: {
      mode: 'none',
    },
    formType: 'Text',
    disabled: true,
  },
}

export const DisabledWithValue: Story = {
  name: 'Disabled (With Value)',
  args: {
    value: {
      mode: 'value',
      value: 'Disabled Value',
    },
    formType: 'Text',
    disabled: true,
  },
}
