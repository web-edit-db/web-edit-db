import { z } from 'zod'

export const betterBoolean = z
  .custom<boolean>(
    (val) => {
      // if it's already a boolean, return it
      if (typeof val === 'boolean') {
        return true
      }
      // if it's a string either 'true' or 'false'
      if (typeof val === 'string' && (val === 'true' || val === 'false')) {
        return true
      }
      return false
    },
    {
      message: 'Value must be either boolean or string "true" or "false"',
    },
  )
  .transform((val) => {
    if (typeof val === 'string') {
      return val === 'true'
    }
    return val
  })

export const sqliteBoolean = z
  .custom<boolean>(
    (val) => {
      return typeof val === 'number' && (val === 1 || val === 0)
    },
    {
      message: 'Value must be either boolean or string "true" or "false" or number 1 or 0',
    },
  )
  .transform((val) => {
    if (typeof val === 'number') {
      return val === 1
    }
    return val
  })

export const betterBooleanInt = z
  .custom<boolean>(
    (val) => {
      // if it's already a boolean, return it
      if (typeof val === 'boolean') {
        return true
      }
      // if it's a string either 'true' or 'false'
      if (typeof val === 'string' && (val === 'true' || val === 'false')) {
        return true
      }
      if (typeof val === 'number' && (val === 1 || val === 0)) {
        return true
      }
      return false
    },
    {
      message: 'Value must be either boolean or string "true" or "false" or number 1 or 0',
    },
  )
  .transform((val) => {
    if (typeof val === 'string') {
      return val === 'true'
    }
    if (typeof val === 'number') {
      return val === 1
    }
    return val
  })
