import { describe, expect, it } from 'vitest'
import { constructColumn, deconsturctColumn } from './helpers'

describe('helpers', () => {
  describe('deconsturctColumn', () => {
    it.each(['INTEGER', 'TEXT', 'NUMBER', 'BLOB', 'REAL'])(
      'should pull out the type, for %s, there is no min or max',
      (type) => {
        expect(deconsturctColumn(type)).toEqual({
          type: type.toLowerCase(),
          min: undefined,
          max: undefined,
        })
      },
    )

    it.each(['INTEGER(10)', 'TEXT(10)', 'NUMBER(10)', 'BLOB(10)', 'REAL(10)'])(
      'should pull out the type, for %s, there is only a max',
      (type) => {
        expect(deconsturctColumn(type)).toEqual({
          type: type.substring(0, type.indexOf('(')).toLowerCase(),
          min: undefined,
          max: 10,
        })
      },
    )

    it.each(['INTEGER(10, 20)', 'TEXT(10, 20)', 'NUMBER(10, 20)', 'BLOB(10, 20)', 'REAL(10, 20)'])(
      'should pull out the type, for %s, there is a min and max',
      (type) => {
        expect(deconsturctColumn(type)).toEqual({
          type: type.substring(0, type.indexOf('(')).toLowerCase(),
          min: 10,
          max: 20,
        })
      },
    )

    it('should handle an empty string', () => {
      expect(deconsturctColumn('')).toBeUndefined()
    })

    it('should handle an invalid column', () => {
      expect(deconsturctColumn('*')).toBeUndefined()
    })

    it("should handle '(10)'", () => {
      expect(deconsturctColumn('(10)')).toBeUndefined()
    })

    it("should handle '(10, 20)'", () => {
      expect(deconsturctColumn('(10, 20)')).toBeUndefined()
    })
  })

  describe('constructColumn', () => {
    it.each([
      { type: 'integer', min: undefined, max: undefined },
      { type: 'bool', min: undefined, max: undefined },
      { type: 'text', min: undefined, max: undefined },
      { type: 'number', min: undefined, max: undefined },
      { type: 'blob', min: undefined, max: undefined },
      { type: 'real', min: undefined, max: undefined },
    ])('should construct the column for %s, where there is no min or max', ({ type, min, max }) => {
      expect(constructColumn({ type, min, max })).toBe(type.toUpperCase())
    })

    it.each([
      { type: 'integer', min: 10, max: undefined },
      { type: 'bool', min: 10, max: undefined },
      { type: 'text', min: 10, max: undefined },
      { type: 'number', min: 10, max: undefined },
      { type: 'blob', min: 10, max: undefined },
      { type: 'real', min: 10, max: undefined },
    ])('should construct the column for %s, where there is only a max', ({ type, min, max }) => {
      expect(constructColumn({ type, min, max })).toBe(`${type.toUpperCase()}(${min})`)
    })

    it.each([
      { type: 'integer', min: undefined, max: 10 },
      { type: 'bool', min: undefined, max: 10 },
      { type: 'text', min: undefined, max: 10 },
      { type: 'number', min: undefined, max: 10 },
      { type: 'blob', min: undefined, max: 10 },
      { type: 'real', min: undefined, max: 10 },
    ])('should construct the column for %s, where there is only a min', ({ type, min, max }) => {
      expect(constructColumn({ type, min, max })).toBe(`${type.toUpperCase()}(${max})`)
    })

    it.each([
      { type: 'integer', min: 10, max: 20 },
      { type: 'bool', min: 10, max: 20 },
      { type: 'text', min: 10, max: 20 },
      { type: 'number', min: 10, max: 20 },
      { type: 'blob', min: 10, max: 20 },
      { type: 'real', min: 10, max: 20 },
    ])('should construct the column for %s, where there is a min and max', ({ type, min, max }) => {
      expect(constructColumn({ type, min, max })).toBe(`${type.toUpperCase()}(${min}, ${max})`)
    })
  })
})
