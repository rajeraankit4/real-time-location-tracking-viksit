import type { ComponentType } from 'react';
import { MapPin, Radio, Crosshair, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const pins = [
  { x: '26%', y: '40%', label: 'You', primary: true },
  { x: '64%', y: '26%', label: 'Ana', primary: false },
  { x: '74%', y: '64%', label: 'Dev', primary: false },
  { x: '40%', y: '74%', label: 'Mira', primary: false },
];

export function HomeContent() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Hero */}
      <section className="grid overflow-hidden rounded-3xl bg-emerald-950 text-white lg:grid-cols-2">
        <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            See where everyone is, as it happens.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-emerald-100/80 sm:text-lg">
            Join the live map to watch active locations move in real time and share your own
            position with others.
          </p>
          <button
            onClick={() => navigate('/live-map')}
            className="mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-emerald-400 px-7 py-3.5 font-semibold text-emerald-950 transition-colors hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:bg-emerald-500 sm:w-fit"
          >
            <MapPin size={20} aria-hidden="true" />
            Join Live Map
          </button>
        </div>

        {/* Map preview */}
        <div
          className="relative min-h-64 border-t border-emerald-800/60 bg-emerald-900/40 lg:min-h-[26rem] lg:border-l lg:border-t-0"
          aria-hidden="true"
        >
          <svg
            className="absolute inset-0 h-full w-full text-emerald-500/30"
            viewBox="0 0 400 320"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          >
            <path d="M-10 250 C 60 210, 110 270, 180 235 S 300 180, 410 215" />
            <path d="M-10 215 C 70 170, 120 235, 190 200 S 310 140, 410 178" />
            <path d="M-10 180 C 80 130, 130 200, 200 165 S 320 100, 410 140" />
            <path d="M-10 145 C 90 90, 140 165, 210 130 S 330 60, 410 102" />
            <path d="M-10 110 C 100 50, 150 130, 220 95 S 340 20, 410 64" />
            <path d="M-10 75 C 110 10, 160 95, 230 60 S 350 -20, 410 26" />
            <path d="M0 0 L 400 320 M 400 0 L 0 320" strokeDasharray="2 8" className="opacity-60" />
          </svg>

          {pins.map((pin) => (
            <div
              key={pin.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: pin.x, top: pin.y }}
            >
              <span className="relative flex h-4 w-4 items-center justify-center">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full motion-safe:animate-ping ${
                    pin.primary ? 'bg-white/70' : 'bg-emerald-400/70'
                  }`}
                />
                <span
                  className={`relative inline-flex h-3 w-3 rounded-full ring-2 ring-emerald-950 ${
                    pin.primary ? 'bg-white' : 'bg-emerald-400'
                  }`}
                />
              </span>
              <span className="absolute left-5 top-1/2 -translate-y-1/2 rounded-md bg-emerald-950/80 px-2 py-0.5 text-xs font-medium text-emerald-100">
                {pin.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <ul className="grid gap-8 px-1 sm:grid-cols-3 sm:gap-10">
        <Feature
          icon={Radio}
          title="Real-time updates"
          description="Locations move on the map the moment they change."
        />
        <Feature
          icon={Crosshair}
          title="Accurate tracking"
          description="GPS-based positions for precise location data."
        />
        <Feature
          icon={ShieldCheck}
          title="Secure and private"
          description="Your location data is encrypted and protected at all times."
        />
      </ul>
    </div>
  );
}

interface FeatureProps {
  icon: ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  description: string;
}

function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <li className="border-t-2 border-emerald-900 pt-5">
      <div className="flex items-center gap-2.5">
        <Icon size={20} className="text-emerald-700" aria-hidden={true} />
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600 sm:text-base">
        {description}
      </p>
    </li>
  );
}