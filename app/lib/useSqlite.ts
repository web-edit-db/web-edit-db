import type { Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import { default as sqlite3InitModule } from '@sqlite.org/sqlite-wasm';
import { useEffect, useMemo, useState } from "react";

export const useSqlite = () => {
  const [sqlite3, setSqlite3] = useState<Sqlite3Static | null>(null);

  useEffect(() => {
    const initSqlite = async () => {
      const sqlite3 = await sqlite3InitModule({
        locateFile: (path) => {
          // Ensure WASM files are loaded from the correct location
          if (path.endsWith('.wasm')) {
            return `/sqlite3.wasm`;
          }
          return path;
        },
      });
      setSqlite3(sqlite3);
    };
    initSqlite();
  }, []);

  const version = useMemo(() => {
    if (!sqlite3) return null;
    return sqlite3.version.libVersion;
  }, [sqlite3]);

  return {
    sqlite3,
    version,
  };
};