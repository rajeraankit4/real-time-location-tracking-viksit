import { MapPin, Menu, X } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors active:bg-slate-200"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={4} className="text-slate-700" /> : <Menu size={24} className="text-slate-700" />}
          </button>
          <MapPin className="text-emerald-600 shrink-0" size={28} />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 truncate">
            Real Time Location Tracking
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
