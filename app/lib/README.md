# SQLite Hook Documentation

This hook provides a React-friendly interface to the `@sqlite.org/sqlite-wasm` package, allowing you to use SQLite databases directly in the browser.

## Features

- **In-memory databases** by default (`:memory:`)
- **File-based databases** for persistence
- **Transaction support** for batch operations
- **Multiple query modes**: objects, arrays, single values
- **Error handling** with user-friendly error messages
- **Loading states** for async operations

## Installation

Make sure you have the `@sqlite.org/sqlite-wasm` package installed:

```bash
npm install @sqlite.org/sqlite-wasm
```

## Basic Usage

```tsx
import { useSqlite } from './lib/useSqlite'

function MyComponent() {
  const { database, isLoading, error, isReady, execute, queryObject } = useSqlite()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!isReady) return <div>Not ready</div>

  const handleCreateTable = async () => {
    await execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE
      )
    `)
  }

  const handleQueryUsers = async () => {
    const users = await queryObject('SELECT * FROM users')
    console.log(users)
  }

  return (
    <div>
      <button onClick={handleCreateTable}>Create Table</button>
      <button onClick={handleQueryUsers}>Query Users</button>
    </div>
  )
}
```

## API Reference

### Hook Return Values

| Property    | Type               | Description                     |
| ----------- | ------------------ | ------------------------------- |
| `sqlite3`   | `Sqlite3 \| null`  | The SQLite3 instance            |
| `database`  | `Database \| null` | The current database connection |
| `isLoading` | `boolean`          | Whether SQLite is initializing  |
| `error`     | `string \| null`   | Any error that occurred         |
| `isReady`   | `boolean`          | Whether SQLite is ready to use  |

### Database Operations

#### `execute(sql: string)`

Executes SQL statements and returns results for SELECT queries or success status for other operations.

```tsx
// Create a table
await execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`)

// Insert data
await execute("INSERT INTO users (name) VALUES ('John Doe')")

// Select data
const results = await execute('SELECT * FROM users')
```

#### `queryValue(sql: string)`

Returns a single value from the first row, first column.

```tsx
const count = await queryValue('SELECT COUNT(*) FROM users')
// Returns: 5
```

#### `queryArray(sql: string)`

Returns results as an array of arrays.

```tsx
const users = await queryArray('SELECT id, name FROM users')
// Returns: [[1, "John"], [2, "Jane"]]
```

#### `queryObject(sql: string)`

Returns results as an array of objects with column names as keys.

```tsx
const users = await queryObject('SELECT id, name FROM users')
// Returns: [{id: 1, name: "John"}, {id: 2, name: "Jane"}]
```

#### `executeBatch(statements: string[])`

Executes multiple SQL statements in a transaction.

```tsx
await executeBatch([
  "INSERT INTO users (name) VALUES ('User 1')",
  "INSERT INTO users (name) VALUES ('User 2')",
  "INSERT INTO users (name) VALUES ('User 3')",
])
```

#### `executeWithCallback(sql: string, callback: (row: unknown) => void | false)`

Executes SQL with a callback for each row. Return `false` to stop iteration.

```tsx
await executeWithCallback('SELECT * FROM users', (row) => {
  console.log('User:', row)
  // Return false to stop after first row
  return false
})
```

#### `openDatabase(filename: string)`

Opens a new database file. Use `:memory:` for in-memory databases.

```tsx
// In-memory database (default)
const db = await openDatabase(':memory:')

// File-based database
const db = await openDatabase('myapp.db')
```

### Error Handling

The hook provides built-in error handling:

```tsx
const { error, clearError } = useSqlite()

if (error) {
  return (
    <div>
      <p>Error: {error}</p>
      <button onClick={clearError}>Clear Error</button>
    </div>
  )
}
```

### Loading States

```tsx
const { isLoading, isReady } = useSqlite()

if (isLoading) {
  return <div>Initializing SQLite...</div>
}

if (!isReady) {
  return <div>SQLite not ready</div>
}

// Now safe to use database operations
```

## Database Types

The hook supports different database types:

- **`:memory:`** - In-memory database (default, not persistent)
- **`""`** - Temporary database
- **`filename.db`** - File-based database (persistent)

## Best Practices

1. **Always check `isReady`** before using database operations
2. **Use transactions** for multiple related operations
3. **Handle errors gracefully** with try-catch blocks
4. **Use appropriate query methods** for your data needs
5. **Consider memory usage** for large datasets

## Limitations

- **Browser-only**: This hook only works in browser environments
- **WASM dependency**: Requires WebAssembly support
- **Single-threaded**: Database operations are synchronous within the main thread
- **File system access**: File-based databases require appropriate permissions

## Example: Complete CRUD Operations

```tsx
function UserManager() {
  const { execute, queryObject, executeBatch } = useSqlite()

  const createUser = async (name: string, email: string) => {
    await execute(`
      INSERT INTO users (name, email) 
      VALUES ('${name}', '${email}')
    `)
  }

  const getUsers = async () => {
    return await queryObject('SELECT * FROM users ORDER BY created_at DESC')
  }

  const updateUser = async (id: number, name: string, email: string) => {
    await execute(`
      UPDATE users 
      SET name = '${name}', email = '${email}' 
      WHERE id = ${id}
    `)
  }

  const deleteUser = async (id: number) => {
    await execute(`DELETE FROM users WHERE id = ${id}`)
  }

  const deleteAllUsers = async () => {
    await executeBatch(['DELETE FROM users', 'DELETE FROM sqlite_sequence WHERE name = "users"'])
  }

  // ... rest of component
}
```

## Troubleshooting

### Common Issues

1. **"SQLite not initialized"**: Wait for `isReady` to be true
2. **"No database open"**: Check if database connection is established
3. **WASM loading errors**: Ensure the package is properly installed
4. **Memory errors**: Large databases may cause memory issues

### Debug Mode

Enable SQL tracing by opening the database with the `t` flag:

```tsx
const db = await openDatabase('myapp.db?flags=t')
```

This will log all SQL statements to the console.
