import Profile from "@/app/(admin)/admin/_components/Profile";
import { Search, Bell, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center flex-1">
        {/* Mobile Menu Button */}
        <button onClick={onMenuClick} className="lg:hidden mr-4 text-gray-500 hover:text-gray-700">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Profile */}
        <Profile />
      </div>
    </header>
  );
}
