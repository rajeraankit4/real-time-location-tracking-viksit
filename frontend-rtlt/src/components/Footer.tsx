import { MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="text-emerald-600" size={24} />
            <span className="text-slate-600 font-medium text-sm sm:text-base">
              Real Time Location Tracking
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm text-center">
            © 2025 Real Time Location Tracking. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
