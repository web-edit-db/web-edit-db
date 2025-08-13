import { useSqlite } from "./useSqlite";

export const useVersion = () => {
    const { version } = useSqlite();
    return version;
};