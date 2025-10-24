import { useState } from 'react';
import { logout } from "../utils/auth";
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { HomeContent } from './HomeContent';
import { AboutContent } from './AboutContent';
import { ContactContent } from './ContactContent';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  function onLogout() {
    if (window.confirm("Are you sure you want to log out?")) {
      logout("/");
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomeContent />;
      case 'about':
        return <AboutContent />;
      case 'contact':
        return <ContactContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
  <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          activeSection={activeSection}
          onNavigate={setActiveSection}
          onClose={closeSidebar}
        />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 capitalize">{activeSection}</h2>
              <div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-md bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
