export function AboutContent() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-6">About</h2>
      <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
        <p>
          This Real-Time Location Tracking project was built as a learning initiative to understand how live location systems work across the full stack. It uses Node.js, Express.js, Socket.IO, Leaflet.js, and React.js to experiment with real-time communication, map rendering, and user authentication.
        </p>
        <p>
          The platform allows users to create or join location-sharing groups, log in through OTP or Google Authentication, and view each other's live positions on an interactive map. Features like WebSocket-powered updates, custom markers, group chat, and optional password-protected rooms were added to explore practical real-time patterns.
        </p>
        <p>
          The project is still evolving, and the goal is to learn, improve, and gather feedback from others. A dedicated feedback page is available for anyone who wants to share suggestions, report issues, or help make the system better.
        </p>
      </div>
    </div>
  );
}
