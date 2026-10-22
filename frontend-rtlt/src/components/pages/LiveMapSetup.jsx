import { useNavigate } from "react-router-dom";
import { Globe, Users, UserPlus, ChevronRight } from "lucide-react";
import GradientLayout from "../GradientLayout";

const options = [
  {
    to: "/live-map/join/common",
    icon: Globe,
    title: "Join Common Map",
    description: "See everyone who is sharing their location.",
    primary: true,
  },
  {
    to: "/live-map/join-group",
    icon: Users,
    title: "Join a Group",
    description: "Enter a group code to see only your people.",
  },
  {
    to: "/live-map/create-group",
    icon: UserPlus,
    title: "Create a Group",
    description: "Start a private map and invite others.",
  },
];

export default function LiveMapSetup() {
  const navigate = useNavigate();

  return (
    <GradientLayout>
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-2xl backdrop-blur-xl">
        <div className="px-8 pb-6 pt-9 sm:px-10">
          <h1 className="text-3xl font-bold tracking-tight text-emerald-950">
            Join or create a map
          </h1>
          <p className="mt-2 text-slate-600">Choose how you want to share your location.</p>
        </div>

        <div className="space-y-3 px-6 pb-8 sm:px-8">
          {options.map(({ to, icon: Icon, title, description, primary }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                primary
                  ? "bg-emerald-950 text-white hover:bg-emerald-900"
                  : "border border-slate-200 bg-white/80 text-slate-900 hover:border-emerald-300 hover:bg-white"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  primary ? "bg-emerald-400 text-emerald-950" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold">{title}</span>
                <span
                  className={`block text-sm ${primary ? "text-emerald-100/75" : "text-slate-600"}`}
                >
                  {description}
                </span>
              </span>
              <ChevronRight
                size={20}
                aria-hidden="true"
                className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${
                  primary ? "text-emerald-300" : "text-slate-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </GradientLayout>
  );
}