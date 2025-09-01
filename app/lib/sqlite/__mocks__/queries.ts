import { fn } from 'storybook/test'

export const getVersion = fn().mockName('getVersion').mockReturnValue('3.42.0-mock')
export const getTableNames = fn().mockName('getTableNames').mockReturnValue([])
export const getTableSchema = fn().mockName('getTableSchema').mockReturnValue([])
