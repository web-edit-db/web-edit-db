import { useEffect } from "react";
import { useLocalStorage } from "react-use"

export const useTheme = () => {
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return {
        theme,
        toggleTheme
    };
};