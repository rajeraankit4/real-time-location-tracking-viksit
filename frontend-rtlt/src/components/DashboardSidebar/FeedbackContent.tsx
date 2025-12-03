import { useState } from "react";
import { getUserFromToken } from "../../utils/auth.js"; // adjust path as needed

export function FeedbackContent() {
  const user = getUserFromToken();   // ⭐ fetch name + email from JWT

  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user?.name || "",
        email: user?.email || "",
        feedback,
      }),
    });

    alert("Thank you! Your feedback has been submitted.");
    setFeedback("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
        Feedback
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* Name + Email in one row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={user?.name || ""}
              readOnly
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-700"
            />
          </div>
        </div>

        {/* Feedback textarea */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Your Feedback
          </label>
          <textarea
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-base"
            placeholder="Write your feedback here..."
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg active:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          Submit Feedback
        </button>

      </form>
    </div>

  );
}
