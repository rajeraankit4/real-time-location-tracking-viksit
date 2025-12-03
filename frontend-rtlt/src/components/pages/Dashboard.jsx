import { useState } from 'react';
import { logout } from "../../utils/auth";
import { Header } from '../DashboardSidebar/Header';
import { Sidebar } from '../DashboardSidebar/Sidebar';
import { Footer } from '../DashboardSidebar/Footer';
import { HomeContent } from '../DashboardSidebar/HomeContent';
import { AboutContent } from '../DashboardSidebar/AboutContent';
import { FeedbackContent } from '../DashboardSidebar/FeedbackContent';

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
      case 'feedback':
        return <FeedbackContent />;
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
            <div className="flex items-start mb-4">
              <button
                onClick={onLogout}
                className="ml-auto px-4 py-2 rounded-md bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
              >
                Logout
              </button>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
