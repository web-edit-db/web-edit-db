import { describe, it, expect, test } from 'vitest'
import {
  encodeTableName,
  decodeTableName,
  normalizeTableName,
  isTableNameUrlSafe,
  getTableNameInfo,
} from './table-utils'

describe('table-utils', () => {
  describe('encodeTableName', () => {
    test.each([
      // Simple alphanumeric names
      { input: 'users', expected: 'users', description: 'simple name' },
      { input: 'table123', expected: 'table123', description: 'alphanumeric' },
      { input: 'MyTable', expected: 'MyTable', description: 'mixed case' },

      // Spaces
      { input: 'user data', expected: 'user%20data', description: 'single space' },
      { input: 'my table name', expected: 'my%20table%20name', description: 'multiple spaces' },

      // Special characters
      { input: 'user@data', expected: 'user%40data', description: '@ symbol' },
      { input: 'data+info', expected: 'data%2Binfo', description: '+ symbol' },
      { input: 'test&table', expected: 'test%26table', description: '& symbol' },
      { input: 'price$table', expected: 'price%24table', description: '$ symbol' },

      // Unicode characters
      { input: 'café', expected: 'caf%C3%A9', description: 'accented character' },
      {
        input: '用户表',
        expected: '%E7%94%A8%E6%88%B7%E8%A1%A8',
        description: 'Chinese characters',
      },
      { input: 'Übung', expected: '%C3%9Cbung', description: 'German umlaut' },

      // Quotes and brackets
      { input: '"quoted table"', expected: '%22quoted%20table%22', description: 'double quotes' },
      { input: "'single quotes'", expected: "'single%20quotes'", description: 'single quotes' },
      { input: '[bracketed]', expected: '%5Bbracketed%5D', description: 'square brackets' },
      { input: '(parentheses)', expected: '(parentheses)', description: 'parentheses' },

      // Path-like characters
      { input: 'folder/table', expected: 'folder%2Ftable', description: 'forward slash' },
      { input: 'data\\info', expected: 'data%5Cinfo', description: 'backslash' },
      { input: 'query?param', expected: 'query%3Fparam', description: 'question mark' },
      { input: 'hash#tag', expected: 'hash%23tag', description: 'hash symbol' },

      // Whitespace characters
      { input: '', expected: '', description: 'empty string' },
      { input: ' ', expected: '%20', description: 'single space' },
      { input: '  ', expected: '%20%20', description: 'double space' },
      { input: '\t', expected: '%09', description: 'tab character' },
      { input: '\n', expected: '%0A', description: 'newline character' },

      // SQL injection patterns
      {
        input: "'; DROP TABLE users; --",
        expected: "'%3B%20DROP%20TABLE%20users%3B%20--",
        description: 'SQL injection attempt',
      },
      { input: 'OR 1=1', expected: 'OR%201%3D1', description: 'SQL condition' },
    ])('should encode $description: "$input" → "$expected"', ({ input, expected }) => {
      expect(encodeTableName(input)).toBe(expected)
    })

    it('should handle very long names', () => {
      const longName = 'a'.repeat(1000)
      const encoded = encodeTableName(longName)
      expect(encoded).toBe(longName) // No encoding needed for simple chars
      expect(encoded.length).toBe(1000)
    })
  })

  describe('decodeTableName', () => {
    test.each([
      // Standard decoding cases
      { input: 'user%20data', expected: 'user data', description: 'space decoding' },
      { input: 'caf%C3%A9', expected: 'café', description: 'Unicode decoding' },
      {
        input: '%22quoted%20table%22',
        expected: '"quoted table"',
        description: 'quotes and space',
      },

      // Names that don't need decoding
      { input: 'users', expected: 'users', description: 'simple name' },
      { input: 'table123', expected: 'table123', description: 'alphanumeric' },
      { input: 'my_table', expected: 'my_table', description: 'with underscore' },

      // Malformed encoding - invalid sequences
      { input: 'user%', expected: 'user%', description: 'incomplete percent' },
      { input: 'user%2', expected: 'user%2', description: 'incomplete hex' },
      { input: 'user%GG', expected: 'user%GG', description: 'invalid hex' },

      // Partial encoding - mixed valid/invalid
      { input: 'user%20%', expected: 'user %', description: 'valid then invalid' },
      { input: 'user%20data%', expected: 'user data%', description: 'valid in middle' },
      { input: 'user%20data%ZZ', expected: 'user data%ZZ', description: 'valid then invalid hex' },

      // Special cases
      { input: '', expected: '', description: 'empty string' },
      { input: '%20', expected: ' ', description: 'single space encoding' },
      { input: '%00', expected: '\x00', description: 'null byte' },
    ])('should decode $description: "$input" → "$expected"', ({ input, expected }) => {
      expect(decodeTableName(input)).toBe(expected)
    })

    it('should handle very long encoded strings', () => {
      const longEncoded = 'a'.repeat(1000)
      expect(decodeTableName(longEncoded)).toBe(longEncoded)
    })
  })

  describe('encode/decode roundtrip', () => {
    const testCases = [
      'users',
      'user data',
      'café orders',
      '"quoted table"',
      'table@domain.com',
      'price$table',
      'query?param=value',
      'path/to/table',
      'hash#tag',
      '用户表',
      'Übung',
      "'; DROP TABLE users; --",
      ' leading and trailing spaces ',
      '\t\n\r',
      'normal_table-name',
      '123_numbers',
      '',
      'a'.repeat(100),
    ]

    testCases.forEach((tableName) => {
      it(`should roundtrip correctly for: "${tableName}"`, () => {
        const encoded = encodeTableName(tableName)
        const decoded = decodeTableName(encoded)
        expect(decoded).toBe(tableName)
      })
    })
  })

  describe('normalizeTableName', () => {
    test.each([
      // Trimming whitespace
      { input: '  users  ', expected: 'users', description: 'leading and trailing spaces' },
      { input: '\t\nusers\r\n', expected: 'users', description: 'various whitespace chars' },
      { input: ' ', expected: '', description: 'single space' },

      // Preserving case
      { input: 'Users', expected: 'Users', description: 'title case' },
      { input: 'USERS', expected: 'USERS', description: 'uppercase' },
      { input: 'myTable', expected: 'myTable', description: 'camelCase' },

      // Preserving internal whitespace
      { input: '  user data  ', expected: 'user data', description: 'internal space preserved' },
      {
        input: ' my  table  name ',
        expected: 'my  table  name',
        description: 'multiple internal spaces',
      },

      // Empty and whitespace-only
      { input: '', expected: '', description: 'empty string' },
      { input: '   ', expected: '', description: 'spaces only' },
      { input: '\t\n\r', expected: '', description: 'whitespace chars only' },
    ])('should normalize $description: "$input" → "$expected"', ({ input, expected }) => {
      expect(normalizeTableName(input)).toBe(expected)
    })
  })

  describe('isTableNameUrlSafe', () => {
    test.each([
      // Safe names (should return true)
      { input: 'users', expected: true, description: 'simple name' },
      { input: 'table123', expected: true, description: 'alphanumeric' },
      { input: 'my_table', expected: true, description: 'with underscore' },
      { input: 'user-data', expected: true, description: 'with hyphen' },
      { input: 'TABLE', expected: true, description: 'uppercase' },
      { input: 'a1_b2-c3', expected: true, description: 'mixed safe chars' },
      { input: '_', expected: true, description: 'underscore only' },
      { input: '-', expected: true, description: 'hyphen only' },
      { input: '123', expected: true, description: 'numbers only' },

      // Unsafe names (should return false)
      { input: 'user data', expected: false, description: 'contains space' },
      { input: 'user@data', expected: false, description: 'contains @' },
      { input: 'data+info', expected: false, description: 'contains +' },
      { input: 'café', expected: false, description: 'contains unicode' },
      { input: '"quoted"', expected: false, description: 'contains quotes' },
      { input: 'query?param', expected: false, description: 'contains ?' },
      { input: 'path/table', expected: false, description: 'contains /' },
      { input: 'hash#tag', expected: false, description: 'contains #' },
      { input: '', expected: false, description: 'empty string' },
      { input: ' ', expected: false, description: 'space only' },
    ])('should return $expected for $description: "$input"', ({ input, expected }) => {
      expect(isTableNameUrlSafe(input)).toBe(expected)
    })
  })

  describe('getTableNameInfo', () => {
    test.each([
      {
        input: 'users',
        expected: { original: 'users', encoded: 'users', isUrlSafe: true, needsEncoding: false },
        description: 'safe name',
      },
      {
        input: 'user data',
        expected: {
          original: 'user data',
          encoded: 'user%20data',
          isUrlSafe: false,
          needsEncoding: true,
        },
        description: 'name with space',
      },
      {
        input: 'café',
        expected: { original: 'café', encoded: 'caf%C3%A9', isUrlSafe: false, needsEncoding: true },
        description: 'unicode character',
      },
      {
        input: 'user@domain.com',
        expected: {
          original: 'user@domain.com',
          encoded: 'user%40domain.com',
          isUrlSafe: false,
          needsEncoding: true,
        },
        description: 'special characters',
      },
      {
        input: '',
        expected: { original: '', encoded: '', isUrlSafe: false, needsEncoding: false },
        description: 'empty string',
      },
    ])('should provide correct info for $description: "$input"', ({ input, expected }) => {
      const info = getTableNameInfo(input)
      expect(info.original).toBe(expected.original)
      expect(info.encoded).toBe(expected.encoded)
      expect(info.isUrlSafe).toBe(expected.isUrlSafe)
      expect(info.needsEncoding).toBe(expected.needsEncoding)
    })
  })

  describe('Edge cases and error handling', () => {
    test.each([
      // Special character roundtrips
      { input: 'table\x00name', description: 'null bytes' },
      { input: 'table\x01\x02\x1F', description: 'control characters' },
      { input: 'table😀data', description: 'high Unicode code points (emoji)' },
    ])('should handle $description in roundtrip', ({ input }) => {
      const encoded = encodeTableName(input)
      const decoded = decodeTableName(encoded)
      expect(decoded).toBe(input)
    })

    test.each([
      // SQLite special cases
      { input: 'sqlite_master', description: 'system table name' },
      { input: 'main.users', description: 'qualified name' },
      { input: '123table', description: 'starts with number' },
      { input: 'select', description: 'SQL keyword' },
      { input: '', description: 'empty string' },
    ])('should handle SQLite special case: $description', ({ input }) => {
      const encoded = encodeTableName(input)
      const decoded = decodeTableName(encoded)
      expect(decoded).toBe(input)
    })

    test.each([
      // Percent encoding boundary conditions
      { input: '%', expected: '%', description: 'single percent' },
      { input: '%%', expected: '%%', description: 'double percent' },
      { input: '%2', expected: '%2', description: 'incomplete encoding' },
      { input: '%20', expected: ' ', description: 'complete encoding' },
      { input: '%20%', expected: ' %', description: 'complete then incomplete' },
      { input: '%G', expected: '%G', description: 'invalid hex first char' },
      { input: '%2G', expected: '%2G', description: 'invalid hex second char' },
    ])(
      'should handle percent boundary case $description: "$input" → "$expected"',
      ({ input, expected }) => {
        expect(decodeTableName(input)).toBe(expected)
      },
    )

    test.each([
      // Mixed valid/invalid encoding
      {
        input: 'hello%20world%ZZ',
        expected: 'hello world%ZZ',
        description: 'valid space + invalid hex',
      },
      {
        input: '%20valid%invalid%21',
        expected: ' valid%invalid!',
        description: 'mixed valid/invalid sequence',
      },
      {
        input: 'start%20%middle%21end',
        expected: 'start %middle!end',
        description: 'valid-invalid-valid pattern',
      },
    ])(
      'should handle mixed encoding $description: "$input" → "$expected"',
      ({ input, expected }) => {
        expect(decodeTableName(input)).toBe(expected)
      },
    )

    test.each([
      // Extreme malformed cases
      { input: '%', expected: '%', description: 'single percent' },
      { input: '%%%', expected: '%%%', description: 'triple percent' },
      { input: '%%%%%', expected: '%%%%%', description: 'quintuple percent' },
      { input: '%20%', expected: ' %', description: 'valid then trailing percent' },
      { input: '%20%Z', expected: ' %Z', description: 'valid then invalid single char' },
      { input: '%20%ZZ', expected: ' %ZZ', description: 'valid then invalid double char' },
      { input: '%ZZ%20', expected: '%ZZ ', description: 'invalid then valid' },
    ])(
      'should handle extreme malformed case $description: "$input" → "$expected"',
      ({ input, expected }) => {
        expect(decodeTableName(input)).toBe(expected)
      },
    )

    it('should handle maximum length names', () => {
      // SQLite has no explicit limit, but test very long names
      const maxLength = 10000
      const longName = 'a'.repeat(maxLength)
      const encoded = encodeTableName(longName)
      const decoded = decodeTableName(encoded)
      expect(decoded).toBe(longName)
      expect(decoded.length).toBe(maxLength)
    })

    it('should handle percent encoding edge cases', () => {
      // These should not be double-encoded
      const alreadyEncoded = 'user%20data'
      const doubleEncoded = encodeTableName(alreadyEncoded)
      expect(doubleEncoded).toBe('user%2520data') // % gets encoded

      const decoded = decodeTableName(doubleEncoded)
      expect(decoded).toBe(alreadyEncoded)
    })
  })
})
