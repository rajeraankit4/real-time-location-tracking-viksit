export function ContactContent() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-6">Contact Us</h2>
      <form className="space-y-5 sm:space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-base"
            placeholder="How can we help you?"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg active:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
