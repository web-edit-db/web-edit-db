/**
 * Utility functions for handling SQLite table names in URLs
 *
 * SQLite table names are case-insensitive and can contain spaces and special characters.
 * We need to handle URL encoding/decoding properly while maintaining consistency.
 */

/**
 * Encodes a table name for use in URLs
 * - Uses encodeURIComponent for URL safety
 * - Handles spaces, special characters, and Unicode
 */
export function encodeTableName(tableName: string): string {
  return encodeURIComponent(tableName)
}

/**
 * Decodes a table name from a URL parameter
 * - Uses decodeURIComponent to restore original name
 * - Handles spaces, special characters, and Unicode
 * - Gracefully handles malformed encoding by attempting partial decoding
 */
export function decodeTableName(encodedTableName: string): string {
  try {
    return decodeURIComponent(encodedTableName)
  } catch (error) {
    // If decoding fails completely, try to decode piece by piece
    // This handles cases like "user%20%" where part is valid
    console.warn('Failed to decode table name, attempting partial decode:', encodedTableName, error)

    try {
      // Try to decode character by character, replacing invalid sequences
      let result = ''
      let i = 0

      while (i < encodedTableName.length) {
        if (encodedTableName[i] === '%' && i + 2 < encodedTableName.length) {
          const hexChars = encodedTableName.substring(i + 1, i + 3)

          // Check if it's valid hex
          if (/^[0-9A-Fa-f]{2}$/.test(hexChars)) {
            try {
              const decoded = decodeURIComponent(encodedTableName.substring(i, i + 3))
              result += decoded
              i += 3
            } catch {
              // If this specific percent encoding is invalid, keep it as-is
              result += encodedTableName[i]
              i++
            }
          } else {
            // Not valid hex, keep the % as-is
            result += encodedTableName[i]
            i++
          }
        } else {
          // Regular character, add as-is
          result += encodedTableName[i]
          i++
        }
      }

      return result
    } catch (partialError) {
      // If even partial decoding fails, return original
      console.warn('Partial decode also failed:', partialError)
      return encodedTableName
    }
  }
}

/**
 * Normalizes a table name for consistent display and comparison
 * - Trims whitespace
 * - Preserves original case (SQLite is case-insensitive but preserves case)
 */
export function normalizeTableName(tableName: string): string {
  return tableName.trim()
}

/**
 * Validates if a table name is safe for URLs without encoding
 * - Returns true if the name contains only alphanumeric characters, underscores, and hyphens
 * - Returns false if encoding is needed (spaces, special characters, etc.)
 */
export function isTableNameUrlSafe(tableName: string): boolean {
  // Allow alphanumeric characters, underscores, and hyphens
  const urlSafePattern = /^[a-zA-Z0-9_-]+$/
  return urlSafePattern.test(tableName)
}

/**
 * Creates a display-friendly version of a table name
 * - Shows if the name contains special characters that require encoding
 * - Useful for debugging or showing user-friendly names
 */
export function getTableNameInfo(tableName: string): {
  original: string
  encoded: string
  isUrlSafe: boolean
  needsEncoding: boolean
} {
  const encoded = encodeTableName(tableName)
  const isUrlSafe = isTableNameUrlSafe(tableName)

  return {
    original: tableName,
    encoded,
    isUrlSafe,
    needsEncoding: encoded !== tableName,
  }
}
