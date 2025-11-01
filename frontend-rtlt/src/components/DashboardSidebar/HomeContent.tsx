import { MapPin, Info, Mail } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export function HomeContent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/live-map"); // redirects to your setup page
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 sm:mb-4">
          Welcome to Real Time Tracking
        </h2>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
          Track locations in real-time with our advanced mapping technology. Join the live map to see active locations and share your position with others.
        </p>
        <button
         onClick={handleClick}
         className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl active:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
          <span className="flex items-center justify-center gap-3">
            <MapPin size={24} />
            Join Live Map
          </span>
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <FeatureCard
          icon={MapPin}
          title="Real-Time Updates"
          description="See location changes as they happen with instant map updates."
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <FeatureCard
          icon={Info}
          title="Accurate Tracking"
          description="Powered by GPS technology for precise location data."
          iconBgColor="bg-teal-100"
          iconColor="text-teal-600"
        />
        <FeatureCard
          icon={Mail}
          title="Secure & Private"
          description="Your location data is encrypted and protected at all times."
          iconBgColor="bg-cyan-100"
          iconColor="text-cyan-600"
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ size: number; className?: string }>;
  title: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
}

function FeatureCard({ icon: Icon, title, description, iconBgColor, iconColor }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 border border-slate-200 hover:shadow-lg active:shadow-md transition-shadow">
      <div className={`h-12 w-12 ${iconBgColor} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={iconColor} size={24} />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm sm:text-base">{description}</p>
    </div>
  );
}
