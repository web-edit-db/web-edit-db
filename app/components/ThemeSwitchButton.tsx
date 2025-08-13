import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

export default function ThemeSwitchButton() {
    const { theme, toggleTheme } = useTheme();
    return (
        <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </Button>
    );
}