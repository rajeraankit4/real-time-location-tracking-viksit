import { Home, Info, Mail } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  onNavigate: (section: string) => void;
  onClose: () => void;
}

export function Sidebar({ isOpen, activeSection, onNavigate, onClose }: SidebarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact Us', icon: Mail },
  ];

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    onClose();
  };

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col mt-[73px]
        `}
      >
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${activeSection === id
                  ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100'
                }
              `}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-20 cursor-default"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
