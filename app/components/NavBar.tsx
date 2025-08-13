import { Link } from "react-router";
import logo from "@/assets/logo.png";
import ThemeSwitchButton from "./ThemeSwitchButton";

export default function NavBar() {
    return (
        <nav className="bg-white dark:bg-gray-800 border-b-2 border-primary h-14 px-3 flex justify-between items-center shadow-lg">
            <Link to="/" className="flex items-center text-2xl text-primary font-light select-none cursor-pointer">
                <img src={logo} alt="" className="p-1.5 h-14" />
                <span className="text-primary">Web Edit DB</span>
            </Link> 
            {/* space  */}
            <div className="flex gap-1">
                <ThemeSwitchButton />
            </div>
        </nav>
    );
}